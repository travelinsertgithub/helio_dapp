
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
  UncontrolledCarousel, CardTitle,
} from "reactstrap";

import Footer from "../../components/Footer/Footer.js";
import IndexNavbar from "../../components/Navbars/IndexNavbar";
import Web3 from "web3";
import Meme from "../../abis/Meme.json";
import ipfs from "../../utils/ipfs";

const carouselItems = [
  {
    src: require("../../assets/img/denys.jpg").default,
    altText: "Slide 1",
    caption: "Big City Life, United States",
  },
  {
    src: require("../../assets/img/fabien-bazanegue.jpg").default,
    altText: "Slide 2",
    caption: "Somewhere Beyond, United States",
  },
  {
    src: require("../../assets/img/mark-finn.jpg").default,
    altText: "Slide 3",
    caption: "Stocks, United States",
  },
];

let ps = null;

export default function ProfilePage() {
  const [tabs, setTabs] = React.useState(1);
  const [loadweb3s, setLoadweb3s] = useState('');
  const [loadBlockchainDates, setLoadBlockchainDates] = useState('');
  const [account, setAccount] = useState('');
  const [buffer, setBuffer] = useState(null);
  const [contarct, setContarct] = useState(null);
  const [memeHash, setmemeHash] = useState('null');


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
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.documentElement.className += " perfect-scrollbar-off";
        document.documentElement.classList.remove("perfect-scrollbar-on");
      }
      document.body.classList.toggle("profile-page");
    };
  },[]);

  const loadWeb3 = async () => {
    console.log("hello");
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
      setContarct(contract)
      const memeHash = await contract.methods.get().call()
      setmemeHash(memeHash)
    }else{
      window.alert("Smart contract not deployed to the detected network")
    }
  };

  const captureFile = (event) =>{
    event.preventDefault();
    const  file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () =>{
      setBuffer(Buffer(reader.result))
    }
  }

  const onSubmit = async (event) =>{
    event.preventDefault();
    console.log('form submitting');

    const added = await ipfs.add(buffer)
    // const val = new CID(added.path).toV1().toString('base32')
    const val = added.path
    const memeHashs = val;

    await contarct.methods.set(memeHashs).send({from:account}).then((r)=>{
      setmemeHash(memeHashs)
      window.alert("hi");
    })
  }


  return (
    <>
      <IndexNavbar isadmin={"false"} isdoctor={"false"} ishome={"true"}/>
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
                <h5 className="text-on-back">Role</h5>

              </Col>
              <Col className="ml-auto mr-auto" lg="4" md="6">
                <Card className="card-coin card-plain">
                  <CardHeader>
                    <img
                      alt="..."
                      className="img-center img-fluid rounded-circle"
                      src={`https://ipfs.infura.io:5001/api/v0/cat?arg=${memeHash}`}
                    />
                    <h4 className="title">Profile</h4>
                  </CardHeader>
                  <CardBody>
                    <form onSubmit={onSubmit}>
                      <input type="file" onChange={captureFile}/>
                      <input type="submit"/>
                    </form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
        <section className="section section-lg">
          <section className="section">
            <img
                alt="..."
                className="path"
                src={require("../../assets/img/path4.png").default}
            />
            <Container>
              <Row className="row-grid justify-content-between">
                <Col className="mt-lg-5" md="5">
                  <Row>
                    <Col className="px-2 py-2" lg="6" sm="12">
                      <Card className="card-stats">
                        <CardBody>
                          <Row>
                            <Col md="4" xs="5">
                              <div className="icon-big text-center icon-warning">
                                <i className="tim-icons icon-single-02 text-warning" />
                              </div>
                            </Col>
                            <Col md="8" xs="7">
                              <div className="numbers">
                                <CardTitle tag="p">3,237</CardTitle>
                                <p />
                                <p className="card-category">Doctors</p>
                              </div>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col className="px-2 py-2" lg="6" sm="12">
                      <Card className="card-stats upper bg-default">
                        <CardBody>
                          <Row>
                            <Col md="4" xs="5">
                              <div className="icon-big text-center icon-warning">
                                <i className="tim-icons icon-single-02 text-white" />
                              </div>
                            </Col>
                            <Col md="8" xs="7">
                              <div className="numbers">
                                <CardTitle tag="p">3,653</CardTitle>
                                <p />
                                <p className="card-category">patient</p>
                              </div>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>

                </Col>
                <Col md="6">
                  <div className="pl-md-5">
                    <h1>
                      Large <br />
                      Achivements
                    </h1>
                    <p>
                      I should be capable of drawing a single stroke at the
                      present moment; and yet I feel that I never was a greater
                      artist than now.
                    </p>
                    <br />
                    <p>
                      When, while the lovely valley teems with vapour around me,
                      and the meridian sun strikes the upper surface of the
                      impenetrable foliage of my trees, and but a few stray.
                    </p>
                    <br />
                    <a
                        className="font-weight-bold text-info mt-5"
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                    >
                      Show all{" "}
                      <i className="tim-icons icon-minimal-right text-info" />
                    </a>
                  </div>
                </Col>
              </Row>
            </Container>
          </section>
        </section>

        <Footer />
      </div>
    </>
  );
}
