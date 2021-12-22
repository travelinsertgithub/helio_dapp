
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
    Table, DropdownItem,

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
import {Link} from "react-router-dom";


let ps = null;
const baseURL = "https://ipfs.infura.io:5001/api/v0/cat?arg=";

export default function ViewRecords() {

    const [loadweb3s, setLoadweb3s] = useState('');
    const [loadBlockchainDates, setLoadBlockchainDates] = useState('');
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [patID, setpatID] = useState('');
    const [isDoctor, setIsDoctor] = useState(false);
    const [isPatient, setIsPatient] = useState(false);
    const [details,setDetails] = useState(null);
    const [Data,setData] = useState([]);
    console.log(Data);

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
                            setDetails([response.data]);
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
                        setData(respon);

                    });

                })

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

    const detailsPage = (hash) =>{
        console.log(hash);
    }
    return (
        <>
            <IndexNavbar  isadmin={"false"} isdoctor={"false"} ishome={"false"}/>
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
                                        <Table>
                                        <thead>
                                            <tr>
                                                <th className="text-center">#</th>
                                                <th>Doctor Address</th>
                                                <th>Patient Address</th>
                                                <th className="text-center">Description</th>
                                                <th className="text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {Data.map((records,i) => {
                                            console.log(i,records[0]);
                                            return(
                                            <tr>
                                                <td className="text-center">{parseInt(i+1)}</td>
                                                <td>{records[0].dr_id}</td>
                                                <td>{records[0].pat_id}</td>
                                                <td className="text-center">{records[0].des}</td>

                                                <td className="text-right">
                                                    <Button className="btn-simple" onClick={ () => window.location.href="/details/"+records[0].c_Hash} color="info">
                                                        View
                                                    </Button>{` `}

                                                </td>
                                            </tr>
                                            );
                                        })}

                                        </tbody>
                                    </Table>
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
