
import React, {useState} from "react";
import PerfectScrollbar from "perfect-scrollbar";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Label,
    FormGroup,
    Form,
    Input,
    FormText,
    NavItem,
    NavLink,
    Nav,
    Table,
    TabContent,
    TabPane,
    Container,
    Row,
    Col,
    UncontrolledTooltip,
    UncontrolledCarousel,
} from "reactstrap";
import classnames from "classnames";
import Footer from "../../../components/Footer/Footer.js";
import IndexNavbar from "../../../components/Navbars/IndexNavbar";
import Web3 from "web3";
import Meme from "../../../abis/Meme.json";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from 'yup';
import ipfs from "../../../utils/ipfs";
import axios from "axios";
import {Link,useParams} from "react-router-dom";


let ps = null;
const baseURL = "https://ipfs.infura.io:5001/api/v0/cat?arg=";

export default function Details() {

    const params = useParams();


    const [tabs, setTabs] = React.useState(1);
    const [loadweb3s, setLoadweb3s] = useState('');
    const [loadBlockchainDates, setLoadBlockchainDates] = useState('');
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [Data, setData] = useState({
        firstName: '',
        lastName: '',
        bp: '',
        sugar: '',
        weight: '',
        fever: '',
        notes: '',
        testreport: '',
        medicine: '',
        des: '',
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
        }else{
            window.alert("Smart contract not deployed to the detected network")
        }
        window.ethereum.on('accountsChanged', function (accounts) {
            window.location.reload()
        })
        setLoadBlockchainDates('true');
        await axios.get(baseURL+params.hash).then((response) => {
            const respon = response.data;
            console.log('old_hash',respon)
            setData(respon);

        });
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
                                <h1 className="profile-title text-left">{Data.firstName + " " + Data.lastName}</h1>
                                <h5 className="text-on-back" style={{fontSize:"50px"}}>{Data.des}</h5>
                                <p className="profile-description">
                                    Here we can see patient record
                                </p>
                            </Col>
                            <Col className="ml-auto mr-auto" lg="6" md="6">
                                <Card className="card-coin card-plain">
                                    <CardHeader>
                                        <img
                                            alt="..."
                                            className="img-center img-fluid rounded-circle"
                                            src={require("../../../assets/img/profile.png").default}
                                        />
                                        <h4 className="title">Details</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <Nav
                                            className="nav-tabs-primary justify-content-center"
                                            tabs
                                        >
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({
                                                        active: tabs === 1,
                                                    })}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setTabs(1);
                                                    }}
                                                    href="#pablo"
                                                >
                                                    General & notes
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({
                                                        active: tabs === 2,
                                                    })}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setTabs(2);
                                                    }}
                                                    href="#pablo"
                                                >
                                                    Test Report
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({
                                                        active: tabs === 3,
                                                    })}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setTabs(3);
                                                    }}
                                                    href="#pablo"
                                                >
                                                    Medicine
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                        <TabContent
                                            className="tab-subcategories"
                                            activeTab={"tab" + tabs}
                                        >
                                            <TabPane tabId="tab1">
                                                <h5 className="title">Blood Pressure: {Data.bp}</h5>
                                                <h5 className="title">Sugar level: {Data.sugar}</h5>
                                                <h5 className="title">Temperature: {Data.fever}</h5>
                                                <h5 className="title">Weight: {Data.weight}</h5>
                                                <blockquote className="blockquote">
                                                    <p className="mb-0">{Data.notes}</p>
                                                </blockquote>
                                            </TabPane>
                                            <TabPane tabId="tab2">
                                                <blockquote className="blockquote">
                                                    <p className="mb-0">{Data.testreport}</p>
                                                </blockquote>
                                            </TabPane>
                                            <TabPane tabId="tab3">
                                                <blockquote className="blockquote">
                                                    <p className="mb-0">{Data.medicine}</p>
                                                </blockquote>
                                            </TabPane>
                                        </TabContent>
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
