
import React, {useState} from "react";
import { Line } from "react-chartjs-2";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  ListGroupItem,
  ListGroup,
  Container,
  Row,
  Col,
} from "reactstrap";
import Footer from "../components/Footer/Footer.js";
import bigChartData from "../variables/charts.js";
import IndexNavbar from "../components/Navbars/IndexNavbar";
import Web3 from "web3";
import Meme from "../abis/Meme.json";
import ipfs from "../utils/ipfs";

export default function App() {
  const [loadweb3s, setLoadweb3s] = useState('');
  const [loadBlockchainDates, setLoadBlockchainDates] = useState('');
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);

  React.useEffect(() => {
    document.body.classList.toggle("landing-page");

     return function cleanup() {
      document.body.classList.toggle("landing-page");
    };

    if (!loadweb3s) {
      loadWeb3();
    }
    if (!loadBlockchainDates) {
      loadBlockchainDate();
    }
  },[]);

  const loadWeb3 = async () => {
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }else{
      window.alert('Please use Metamask');
    }
  };

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
  };





  return (
      <>
        <IndexNavbar isadmin={"false"} isdoctor={"false"} ishome={"true"}/>
        <div className="wrapper">
          <div className="page-header">
            <img
                alt="..."
                className="path"
                src={require("../assets/img/blob.png").default}
            />
            <img
                alt="..."
                className="path2"
                src={require("../assets/img/path2.png").default}
            />
            <img
                alt="..."
                className="shapes triangle"
                src={require("../assets/img/triunghiuri.png").default}
            />
            <img
                alt="..."
                className="shapes wave"
                src={require("../assets/img/waves.png").default}
            />
            <img
                alt="..."
                className="shapes squares"
                src={require("../assets/img/patrat.png").default}
            />
            <img
                alt="..."
                className="shapes circle"
                src={require("../assets/img/cercuri.png").default}
            />
            <div className="content-center">
              <Row className="row-grid justify-content-between align-items-center text-left">
                <Col lg="6" md="6">
                  <h1 className="text-white">
                    Welcome to helio <br />
                    <span className="text-white">health chain</span>
                  </h1>
                  <p className="text-white mb-3">
                    We are here for your Care
                  </p>
                </Col>
                <Col lg="4" md="5">
                  <img
                      alt="..."
                      className="img-fluid"
                      src={require("../assets/img/etherum.png").default}
                  />
                </Col>
              </Row>
            </div>
          </div>
          <section className="section section-lg">
            <section className="section">

            </section>
          </section>
          <Footer />
        </div>
      </>
  );
}
