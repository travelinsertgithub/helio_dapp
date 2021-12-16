
import React, {useState} from "react";
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


let ps = null;

export default function AddPatient() {
    const [isAdmin, setIsAdmin] = useState('');
    const [loadweb3s, setLoadweb3s] = useState('');
    const [loadBlockchainDates, setLoadBlockchainDates] = useState('');
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);

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
            const adminId = await contract.methods.getAdmin().call()

            if(adminId == accounts[0]){
                setIsAdmin('false')
            }else{
                // Swal.fire({
                //     icon: 'error',
                //     title: 'Oops...',
                //     text: 'Only Admin have access!',
                // }).then((value)=>{
                //     // history.push("/home")
                //     window.location.href="/index";
                // });
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

    const AddPatientForm = () => {
        const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
        const formik = useFormik({
            initialValues: {
                firstName: '',
                lastName: '',
                email: '',
                age: '',
                city: '',
                state: '',
                country: '',
                mobile: '',
                accid: '',
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
                mobile: Yup.string().matches(phoneRegExp, 'Mobile number is not valid'),
                accid: Yup.string()
                    .max(42, 'Must be 20 characters')
                    .min(42, 'Must be 20 characters')
                    .required('Required'),

            }),
            onSubmit: async values => {
                const result = JSON.stringify(values, null, 2);
                await ipfs.add(result).then(
                    hash => {
                        console.log(hash.path)
                        contract.methods.addPatInfo(values.accid,hash.path).send({from: account})
                            .on("confirmation", (r) => {
                                console.log("Patient Added Successfully")
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Success',
                                    text: 'Patient Registered Successfully!',
                                })
                                window.location.reload();
                            }).on("error",(er)=>{
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: '1.Only Admin can Add Users\n2.This id Already have a role',
                            })
                            // window.location.reload();
                        });
                    });
            },

        });
        return (
        <Form onSubmit={formik.handleSubmit}>
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

            <Button
                className="btn-round float-right"
                color="primary"
                data-placement="right"
                id="tooltip341148792"
                type="submit"
            >
                Add Patient
            </Button>
        </Form>
        );
    }
    return (
        <>
            <IndexNavbar  isadmin={"true"}/>
            <div className="wrapper">

                <section className="section">
                    <Container>
                        <Row>
                            <Col md="6">
                                <Card className="card-plain">
                                    <CardHeader>
                                        <h1 className="profile-title text-left">Add Patient</h1>
                                        <h5 className="text-on-back">Pt</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <AddPatientForm />
                                    </CardBody>
                                </Card>
                            </Col>

                        </Row>
                    </Container>
                </section>
                <Footer />
            </div>
        </>
    );
}
