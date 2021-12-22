
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
import QRCode from 'qrcode.react';
import {Link} from "react-router-dom";


let ps = null;
const baseURL = "https://ipfs.infura.io:5001/api/v0/cat?arg=";

export default function PatientProfile() {

    const [loadweb3s, setLoadweb3s] = useState('');
    const [loadBlockchainDates, setLoadBlockchainDates] = useState('');
    const [account, setAccount] = useState('0x00000000000000000000000000000000000');
    const [contract, setContract] = useState(null);
    const [patID, setpatID] = useState('');
    const [isDoctor, setIsDoctor] = useState(false);
    const [isPatient, setIsPatient] = useState(false);
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
                const  result = await contract.methods.isPat(accounts[0]).call()
                console.log(result)
                if(result=== "1"){
                    setIsPatient(true)
                }
                else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Only Patient have access!',
                    }).then((value)=>{
                        window.location.href="/index";
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Only Patient have access!',
                }).then((value)=>{
                    window.location.href="/index";
                });
            }
            await contract.methods.getPatInfo(accounts[0]).call().then(value =>{
                axios.get(baseURL+value).then((response) => {
                    setDetails(response.data);
                    setIsPatient(true);
                });
            })
            await contract.methods.viewMedRec(accounts[0]).call().then( Hash =>{
                console.log(Hash)
                axios.get(baseURL+Hash).then((response) => {
                    const respon = response.data;
                    setData(respon);

                });

            })
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

    const downloadQR = () => {
        const canvas = document.getElementById(account);
        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = account + ".png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };


    return (
        <>
            <IndexNavbar  isadmin={"false"} isdoctor={"false"} ishome={"false"}/>
            <div className="wrapper">
                <div className="page-header">
                    <img
                        alt="..."
                        className="dots"
                        src={require("../../../assets/img/dots.png").default}
                    />
                    <img
                        alt="..."
                        className="path"
                        src={require("../../../assets/img/path4.png").default}
                    />
                <Container>
                    <Row>
                        <Col lg="6" md="6">
                            <h1 className="profile-title text-left" style={{lineBreak:"anywhere"}}>{details.firstName + ' ' +details.lastName }</h1>
                        </Col>
                        <Col className="ml-auto mr-auto" lg="6" md="6">
                            <Card className="card-coin card-plain">
                                <CardHeader>
                                    <img
                                        alt="..."
                                        className="img-center img-fluid rounded-circle"
                                        src={require("../../../assets/img/profile.png").default}
                                    />
                                    <h4 className="title">Profile</h4>
                                    <p className="text-center">{details.email}</p>
                                    <p className="text-center">Age: {details.age}</p>
                                    <p className="text-center">{details.mobile}</p>
                                    <p className="text-center">{details.city +', '+ details.state + ', '+ details.country }</p>
                                    <blockquote className="blockquote">
                                        <div>
                                            <QRCode
                                                id={account}
                                                value={account}
                                                size={290}
                                                level={"H"}
                                                includeMargin={true}
                                            />
                                            <a onClick={downloadQR} style={{display:"block",textAlign:"center",cursor:"pointer"}}> Download QR </a>
                                        </div>
                                    </blockquote>
                                </CardHeader>
                                <CardBody>

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
                </div>
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

                <Footer />
            </div>
        </>
    );
}
