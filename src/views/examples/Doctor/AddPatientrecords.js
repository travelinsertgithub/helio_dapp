
import React, {useState,useEffect} from "react";
import PerfectScrollbar from "perfect-scrollbar";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    Container,
    Row,
    Col,

} from "reactstrap";

import Footer from "../../../components/Footer/Footer.js";
import IndexNavbar from "../../../components/Navbars/IndexNavbar";
import Web3 from "web3";
import Meme from "../../../abis/Meme.json";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from 'yup';
import ipfs from "../../../utils/ipfs";
import axios from "axios";


let ps = null;
const baseURL = "https://ipfs.infura.io:5001/api/v0/cat?arg=";

export default function AddPatientrecord() {

    const [loadweb3s, setLoadweb3s] = useState('');
    const [loadBlockchainDates, setLoadBlockchainDates] = useState('');
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [patID, setpatID] = useState('');
    const [isDoctor, setIsDoctor] = useState(false);
    const [isPatient, setIsPatient] = useState(false);
    const [AllHash, setAllHash]=useState([]);
    console.log("AllHash",AllHash)
    const [details,setDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        age: '',
        city: '',
        state: '',
        country: '',
        mobile: '',
        accid: '',
    });

    React.useEffect(() => {

        if (navigator.platform.indexOf("Win") > -1) {
            document.documentElement.className += " perfect-scrollbar-on";
            document.documentElement.classList.remove("perfect-scrollbar-off");
            let tables = document.querySelectorAll(".table-responsive");
            for (let i = 0; i < tables.length; i++) {
                ps = new PerfectScrollbar(tables[i]);
            }
        }
        document.body.classList.toggle("profile-page");

        if(!loadweb3s) {
            loadWeb3();
        }
        if(!loadBlockchainDates) {
            loadBlockchainDate();
        }

        return function cleanup() {

            document.body.classList.toggle("profile-page");
        };
    },[]);

    const loadBlockchainDate = async () => {
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        setAccount(accounts[0])
        const networkId = await web3.eth.net.getId()
        const networkData = Meme.networks[networkId]
        if(networkData){
            const abi = Meme.abi
            const address = networkData.address
            const contract = web3.eth.Contract(abi,address)
            setContract(contract)
            try {
                const  result = await contract.methods.isDr(accounts[0]).call()
                console.log(result)
                if(result=== "1"){
                    setIsDoctor(true)
                }
                else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Only Doctor have access!',
                    }).then((value)=>{
                        window.location.href="/index";
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Only Doctor have access!',
                }).then((value)=>{
                    window.location.href="/index";
                });
            }
        }else{
            window.alert("Smart contract not deployed to the detected network")
        }
        window.ethereum.on('accountsChanged', function (accounts) {
            window.location.reload()
        })
        setLoadBlockchainDates('true');

    };

    const loadWeb3 = async () => {
        if(window.ethereum){
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } if(window.web3){
            window.web3 = new Web3(window.web3.currentProvider)
        }else{
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
        setLoadweb3s('true');
    };

    const SearchPatient = () => {
        const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
        const formik = useFormik({
            initialValues: {
                accid: '',
            },

            validationSchema: Yup.object({
                accid: Yup.string()
                    .max(42, 'Must be 20 characters')
                    .min(42, 'Must be 20 characters')
                    .required('Required'),
            }),
            onSubmit: async values => {
                const result = JSON.stringify(values, null, 2);
                setpatID(values.accid)
                try {
                    await contract.methods.getPatInfo(values.accid).call().then(value =>{
                        axios.get(baseURL+value).then((response) => {
                            setDetails(response.data);
                            setIsPatient(true);
                        });
                    })
                } catch (error) {
                    {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Not a Patient id',
                            text: 'The patient id is not Present',
                        }).then(()=>{
                            window.location.href = "add_record";
                        })
                    }
                }
                await contract.methods.viewMedRec(values.accid).call().then( Hash =>{
                    console.log(Hash)
                    axios.get(baseURL+Hash).then((response) => {
                        const respon = response.data;
                        console.log('old_hash',respon)
                        setAllHash(respon);
                    });

                })
                // await contract.methods.search(values.accid).send({from : account})
                //     .on("confirmation" ,(e)=>{
                //         window.location.href="/doctor"
                //     }).on("error",(err)=>{
                //         Swal.fire({
                //             icon: 'error',
                //             title: 'Error',
                //             text: 'The particular id is not a doctor',
                //         })
                //
                //     })

            },

        });
        return (
            <Form onSubmit={formik.handleSubmit}>

                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>Account Id</label>
                            <Input
                                id="accid"
                                name="accid"
                                type="text"
                                placeholder="Search with Hash code"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.accid}
                            />
                            {formik.touched.accid && formik.errors.accid ? (
                                <div>{formik.errors.accid}</div>
                            ) : null}
                        </FormGroup>
                    </Col>
                </Row>


                <Button
                    className="btn-round float-right"
                    color="primary"
                    data-placement="right"
                    id="tooltip341148792"
                    type="submit"
                >
                    Search
                </Button>
            </Form>
        );
    }

    const timeout = async (valuesToContract,accid) => {
        const res =[valuesToContract];
        setAllHash(AllHash => [...AllHash, res]);
        const  hasharray = AllHash;
        hasharray.push(res);
        console.log("afterpush",hasharray);
        console.log("afterpushjson",JSON.stringify(hasharray, null, 2));

            await ipfs.add(JSON.stringify(hasharray, null, 2)).then(
                    allhasH =>{
                        console.log("IPFS all HASH :-"+allhasH.path)
                        contract.methods.addMedRecord(allhasH.path,accid).send({from: account}).on("confirmation",
                            (r) => {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Success',
                                    text: 'Medical record added Successfully!',
                                }).then(()=>{
                                    window.location.reload();
                                })


                            }).then((value)=>{
                            window.location.reload();
                        })
                    })
    }

    const AddRecords = () => {
        const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
        const formik = useFormik({
            initialValues: {
                firstName: details.firstName,
                lastName: details.lastName,
                email: details.email,
                age: details.age,
                city: details.city,
                state: details.state,
                country: details.country,
                mobile: details.mobile,
                accid: details.accid,
                bp:'',
                sugar:'',
                weight:'',
                fever:'',
                notes:'',
                testreport:'',
                medicine:'',
                des:'',


            },

            validationSchema: Yup.object({
                firstName: Yup.string()
                    .max(15, 'Must be 15 characters or less')
                    .required('Required'),
                lastName: Yup.string()
                    .max(20, 'Must be 20 characters or less')
                    .required('Required'),
                email: Yup.string().email('Invalid email address').required('Required'),
                age: Yup.number()
                    .required('Required')
                    .test(
                        'Is 20+?',
                        'Age must be greater than 20!',
                        (value) => value >= 20
                    ),
                city: Yup.string()
                    .required('Required'),
                state: Yup.string()
                    .required('Required'),
                country: Yup.string()
                    .required('Required'),
                des: Yup.string()
                    .required('Required')
                    .max(20, 'Must be 15 characters or less'),

                mobile: Yup.string().matches(phoneRegExp, 'Mobile number is not valid'),
                accid: Yup.string()
                    .max(42, 'Must be 20 characters')
                    .min(42, 'Must be 20 characters')
                    .required('Required')

            }),
            onSubmit: async values => {

                    const dr_id = account;
                    const pat_id = values.accid;
                    const des = values.des;
                    const valuesToSend = {
                        ...values,
                    }


                const result = JSON.stringify(valuesToSend, null, 2);
                console.log(result);


                await ipfs.add(result).then(
                    hash => {
                        const AddedHash = hash.path;
                        console.log("IPFS HASH :-+++++",AddedHash);
                        const c_Hash = AddedHash;
                        const valuesToContract = {
                            dr_id,
                            pat_id,
                            des,
                            c_Hash
                        }

                        timeout(valuesToContract,values.accid)
                    });




                // await ipfs.add(result).then(
                //     hash => {
                //         console.log(hash.path)
                //
                //         contract.methods.addDrInfo(values.accid,hash.path).send({from: account})
                //             .on("confirmation", (r) => {
                //                 console.log("Doctor Added Successfully")
                //                 Swal.fire({
                //                     icon: 'success',
                //                     title: 'Success',
                //                     text: 'Doctor Registered Successfully!',
                //                 })
                //                 window.location.reload();
                //             }).on("error",(er)=>{
                //             Swal.fire({
                //                 icon: 'error',
                //                 title: 'Error',
                //                 text: '1.Only Admin can Add Users\n2.This id Already have a role',
                //             })
                //             window.location.reload();
                //         });
                //     });
            },

        });
        return (
            <Form onSubmit={formik.handleSubmit}>
                <Row>
                    <Col md="6">
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <label>First Name</label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.firstName}
                                    />
                                    {formik.touched.firstName && formik.errors.firstName ? (
                                        <div>{formik.errors.firstName}</div>
                                    ) : null}
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <label>Last Name</label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.lastName}
                                    />
                                    {formik.touched.lastName && formik.errors.lastName ? (
                                        <div>{formik.errors.lastName}</div>
                                    ) : null}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12">
                                <FormGroup>
                                    <label>Email</label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.email}
                                    />
                                    {formik.touched.email && formik.errors.email ? (
                                        <div>{formik.errors.email}</div>
                                    ) : null}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <label>Age</label>
                                    <Input
                                        id="age"
                                        name="age"
                                        type="number"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.age}
                                    />
                                    {formik.touched.age && formik.errors.age ? (
                                        <div>{formik.errors.age}</div>
                                    ) : null}
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <label>Mobile</label>
                                    <Input
                                        id="mobile"
                                        name="mobile"
                                        type="text"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.mobile}
                                    />
                                    {formik.touched.mobile && formik.errors.mobile ? (
                                        <div>{formik.errors.mobile}</div>
                                    ) : null}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="4">
                                <FormGroup>
                                    <label>City</label>
                                    <Input
                                        id="city"
                                        name="city"
                                        type="text"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.city}
                                    />
                                    {formik.touched.city && formik.errors.city ? (
                                        <div>{formik.errors.city}</div>
                                    ) : null}
                                </FormGroup>
                            </Col>
                            <Col md="4">
                                <FormGroup>
                                    <label>State</label>
                                    <Input
                                        id="state"
                                        name="state"
                                        type="text"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.state}
                                    />
                                    {formik.touched.state && formik.errors.state ? (
                                        <div>{formik.errors.state}</div>
                                    ) : null}
                                </FormGroup>
                            </Col>
                            <Col md="4">
                                <FormGroup>
                                    <label>Country</label>
                                    <Input
                                        id="country"
                                        name="country"
                                        type="text"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.country}
                                    />
                                    {formik.touched.country && formik.errors.country ? (
                                        <div>{formik.errors.country}</div>
                                    ) : null}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>Account Id</label>
                            <Input
                                id="accid"
                                name="accid"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.accid}
                            />
                            {formik.touched.accid && formik.errors.accid ? (
                                <div>{formik.errors.accid}</div>
                            ) : null}
                        </FormGroup>
                    </Col>
                </Row>
                    </Col>
                    <Col md="6" style={{BorderLeft:"1px solid"}}>
                        <Row>
                            <Col md="4">
                                <FormGroup>
                                    <label>Blood pressure</label>
                                    <Input
                                        id="bp"
                                        name="bp"
                                        type="text"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.bp}
                                    />

                                </FormGroup>
                            </Col>
                            <Col md="4">
                                <FormGroup>
                                    <label>Sugar</label>
                                    <Input
                                        id="sugar"
                                        name="sugar"
                                        type="text"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.sugar}
                                    />

                                </FormGroup>
                            </Col>
                            <Col md="4">
                                <FormGroup>
                                    <label>Weight</label>
                                    <Input
                                        id="weight"
                                        name="weight"
                                        type="text"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.weight}
                                    />

                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <label>Fever</label>
                                    <Input
                                        id="fever"
                                        name="fever"
                                        type="text"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.fever}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <label>Description</label>
                                    <Input
                                        id="des"
                                        name="des"
                                        type="text"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.des}
                                    />
                                    {formik.touched.des && formik.errors.des ? (
                                        <div>{formik.errors.des}</div>
                                    ) : null}
                                </FormGroup>
                            </Col>
                            <Col md="12">
                                <FormGroup>
                                    <label>Test Report</label>
                                    <Input
                                        id="testreport"
                                        name="testreport"
                                        type="textarea"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.testreport}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="12">
                                <FormGroup>
                                    <label>Medicine Report</label>
                                    <Input
                                        id="medicine"
                                        name="medicine"
                                        type="textarea"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.medicine}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="12">
                                <FormGroup>
                                    <label>Notes</label>
                                    <Input
                                        id="notes"
                                        name="notes"
                                        type="textarea"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.notes}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Button
                            className="btn-round float-right"
                            color="primary"
                            data-placement="right"
                            id="tooltip341148792"
                            type="submit"
                        >
                            Save
                        </Button>
                    </Col>

                </Row>
            </Form>
        );
    }
    return (
        <>
            <IndexNavbar  isadmin={"false"} isdoctor={"true"} ishome={"false"}/>
            <div className="wrapper">
                {isDoctor
                    ?
                <section className="section">
                    <Container>
                        <Row>
                            <Col md="12">
                                <Card className="card-plain">
                                    <CardHeader>
                                        <p className="text-on-back" style={{fontSize:"3em"}}>Patient</p>
                                    </CardHeader>
                                    <CardBody>
                                        <SearchPatient />
                                    </CardBody>
                                </Card>
                            </Col>

                        </Row>
                    </Container>
                </section>
                    :<></>}
                {isPatient
                    ?
                <section className="section">
                    <Container>
                        <Row>
                            <Col md="12">
                                <Card className="card-plain">
                                    <CardHeader>
                                        <h5 className="text-on-back" style={{fontSize:"3em"}}>Records</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <AddRecords />
                                    </CardBody>
                                </Card>
                            </Col>

                        </Row>
                    </Container>
                </section>
                    : <></> }
                <Footer />
            </div>
        </>
    );
}
