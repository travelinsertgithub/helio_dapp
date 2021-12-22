
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
    UncontrolledTooltip,
    CardTitle,
} from "reactstrap";

import Footer from "../../../components/Footer/Footer.js";
import IndexNavbar from "../../../components/Navbars/IndexNavbar";
import Web3 from "web3";
import Meme from "../../../abis/Meme.json";
import Swal from "sweetalert2";
import histroy from "../../../utils/histroy";
import axios from "axios";
import {Link} from "react-router-dom";

import QRCode from 'qrcode.react';
let ps = null;
const baseURL = "https://ipfs.infura.io:5001/api/v0/cat?arg=";

export default function DoctorProfile() {
    const [isDoctor, setIsDoctor] = useState('');
    const [loadweb3s, setLoadweb3s] = useState('');
    const [loadBlockchainDates, setLoadBlockchainDates] = useState('');
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
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
        Speciality: '',
        qualification: '',
        regno:'',
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
            await contract.methods.getDr(accounts[0]).call().then(value =>{
                console.log("Doctor info hash : ",value)
                axios.get(baseURL+value).then((response) => {
                    setDetails(response.data);
                    console.log(response.data);
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
            <IndexNavbar  isadmin={"false"} isdoctor={"true"} ishome={"false"}/>
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
                    <Container className="align-items-center">
                        <Row>
                            <Col lg="6" md="6">
                                <h1 className="profile-title text-left" style={{lineBreak:"anywhere"}}>{details.firstName + ' ' +details.lastName + ' ' + details.qualification}</h1>
                                <h5 className="text-on-back">DR</h5>

                            </Col>
                            <Col className="ml-auto mr-auto" lg="6" md="6">
                                <Card className="card-coin card-plain">
                                    <CardHeader>
                                        <img
                                            alt="..."
                                            className="img-center img-fluid rounded-circle"
                                            src={require("../../../assets/img/profile.png").default}
                                        />
                                        <h4 className="title">Profile <a href="/Doctor_edit" style={{cursor:"pointer"}}><i className="tim-icons icon-pencil"></i></a></h4>
                                        <p className="text-center">{details.email}</p>
                                        <p className="text-center">Age: {details.age}</p>
                                        <p className="text-center">{details.Speciality}</p>
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

                <Footer />
            </div>
        </>
    );
}
