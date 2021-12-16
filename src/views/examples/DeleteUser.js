
import React, {useState} from "react";
import PerfectScrollbar from "perfect-scrollbar";
import {
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Label,
    Button,
    Input,
    Container,
    Row,
    Col,

} from "reactstrap";
import axios from "axios";

import Footer from "../../components/Footer/Footer.js";
import IndexNavbar from "../../components/Navbars/IndexNavbar";
import Web3 from "web3";
import Meme from "../../abis/Meme.json";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from 'yup';
import ipfs from "../../utils/ipfs";

let ps = null;
const baseURL = "https://ipfs.infura.io:5001/api/v0/cat?arg=";

export default function DeleteUser() {
    const [isAdmin, setIsAdmin] = useState('');
    const [Drinfo, setDrinfo] = useState('');
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
        if(!Drinfo){
            // getDrInfo();
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



    const AddDoctorForm = () => {
        const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
        const formik = useFormik({
            initialValues: {
                role: '',
                accid: '',

            },

            validationSchema: Yup.object({

                role: Yup.string()
                    .required('Required'),
                accid: Yup.string()
                    .max(42, 'Must be 20 characters')
                    .min(42, 'Must be 20 characters')
                    .required('Required'),

            }),
            onSubmit: async values => {
                const result = JSON.stringify(values, null, 2);
                if(values.role==="Doctor")
                {
                    try {
                        contract.methods.delDr(values.accid).send({from: account}).on("confirmation", (r) => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: 'Doctor removed successfully!',
                            })
                            window.location.reload();
                        }).on("error",(er)=>{
                            Swal.fire({
                                icon: 'error',
                                title: 'Not Found',
                                text: 'Doctor id doesnot Exist',
                            })

                            window.location.reload();
                        });
                    }catch (e) {
                        Swal.fire({
                            icon: 'error',
                            title: 'error',
                            text: 'Someting Went wrong',
                        })
                    }

                }
                else if(values.role === "Patient"){
                    contract.methods.delPat(values.acc_id).send({from: account}).on("confirmation", (r) => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'patient removed successfully!',
                        })
                        window.location.reload();
                    }).on("error",(er)=>{
                        Swal.fire({
                            icon: 'error',
                            title: 'Not Found',
                            text: 'patient id doesnot Exist!',
                        })
                        window.location.reload();
                    });
                }
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
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.accid}
                            />
                            {formik.touched.accid && formik.errors.accid ? (
                                <div>{formik.errors.accid}</div>
                            ) : null}
                        </FormGroup>
                    </Col>
                    <Col md="12">
                        <FormGroup>
                            <Label for="exampleSelect1">Example select</Label>
                            <select
                                name="role"
                                classname="form-control"
                                id="role"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                            <option value="">Select Role</option>
                            <option calue="Doctor">Doctor</option>
                            <option value="Patient">Patient</option>
                            </select>
                            {formik.touched.role && formik.errors.role ? (
                                <div>{formik.errors.role}</div>
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
                    Delete
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
                                        <h1 className="profile-title text-left">Delete</h1>
                                        <h5 className="text-on-back">User</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <AddDoctorForm />
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
