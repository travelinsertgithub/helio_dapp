
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

import Footer from "../../components/Footer/Footer.js";
import IndexNavbar from "../../components/Navbars/IndexNavbar";
import Web3 from "web3";
import Meme from "../../abis/Meme.json";
import ipfs from "../../utils/ipfs";
import Swal from "sweetalert2";
import histroy from "../../utils/histroy";


let ps = null;

export default function AdminPage() {
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





    return (
        <>
            <IndexNavbar  isadmin={"true"}/>
            <div className="wrapper">
                <div className="page-header">
                    <img
                        alt="..."
                        className="dots"
                        src={require("../../assets/img/dots.png").default}
                    />
                    <img
                        alt="..."
                        className="path"
                        src={require("../../assets/img/path4.png").default}
                    />
                    <Container className="align-items-center">
                        <Row>
                            <Col lg="6" md="6">
                                <h1 className="profile-title text-left" style={{lineBreak:"anywhere"}}>{account}</h1>
                                <h5 className="text-on-back">Admin</h5>

                            </Col>
                            <Col className="ml-auto mr-auto" lg="4" md="6">
                                <Card className="card-coin card-plain">
                                    <CardHeader>
                                        <img
                                            alt="..."
                                            className="img-center img-fluid rounded-circle"
                                            src={require("../../assets/img/profile.png").default}
                                        />
                                        <h4 className="title">Profile</h4>
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
