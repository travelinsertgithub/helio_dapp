
import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {

  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,

} from "reactstrap";

export default function IndexNavbar({isadmin,isdoctor,ishome}) {
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isDoctor, setIsDoctor] = React.useState(false);
  const [isHome, setIsHome] = React.useState(false);
  const [collapseOut, setCollapseOut] = React.useState("");
  const [color, setColor] = React.useState("navbar-transparent");
  React.useEffect(() => {
    window.addEventListener("scroll", changeColor);
    if(!isAdmin){
      if(isadmin == "true"){
        setIsAdmin(true);
      }
      if(isdoctor == "true"){
        setIsDoctor(true);
      }
      if(ishome == "true"){
        setIsHome(true);
      }
    }
    return function cleanup() {
      window.removeEventListener("scroll", changeColor);
    };

  },[]);
  const changeColor = () => {
    if (
      document.documentElement.scrollTop > 99 ||
      document.body.scrollTop > 99
    ) {
      setColor("bg-info");
    } else if (
      document.documentElement.scrollTop < 100 ||
      document.body.scrollTop < 100
    ) {
      setColor("navbar-transparent");
    }
  };
  const toggleCollapse = () => {
    document.documentElement.classList.toggle("nav-open");
    setCollapseOpen(!collapseOpen);
  };
  const onCollapseExiting = () => {
    setCollapseOut("collapsing-out");
  };
  const onCollapseExited = () => {
    setCollapseOut("");
  };
  const scrollToDownload = () => {
    document
      .getElementById("download-section")
      .scrollIntoView({ behavior: "smooth" });
  };
  return (
    <Navbar className={"fixed-top " + color} color-on-scroll="100" expand="lg">
      <Container>
        <div className="navbar-translate">
          <NavbarBrand to="/" tag={Link} id="navbar-brand">
            <span>Helio</span>
          </NavbarBrand>

          <button
            aria-expanded={collapseOpen}
            className="navbar-toggler navbar-toggler"
            onClick={toggleCollapse}
          >
            <span className="navbar-toggler-bar bar1" />
            <span className="navbar-toggler-bar bar2" />
            <span className="navbar-toggler-bar bar3" />
          </button>
        </div>
        <Collapse
          className={"justify-content-end " + collapseOut}
          navbar
          isOpen={collapseOpen}
          onExiting={onCollapseExiting}
          onExited={onCollapseExited}
        >
          <div className="navbar-collapse-header">
            <Row>
              <Col className="collapse-brand" xs="6">
                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                  Helio
                </a>
              </Col>
              <Col className="collapse-close text-right" xs="6">
                <button
                  aria-expanded={collapseOpen}
                  className="navbar-toggler"
                  onClick={toggleCollapse}
                >
                  <i className="tim-icons icon-simple-remove" />
                </button>
              </Col>
            </Row>
          </div>
          <Nav navbar>


            {/*<UncontrolledDropdown nav>*/}
            {/*  <DropdownToggle*/}
            {/*    caret*/}
            {/*    color="default"*/}
            {/*    data-toggle="dropdown"*/}
            {/*    href="#pablo"*/}
            {/*    nav*/}
            {/*    onClick={(e) => e.preventDefault()}*/}
            {/*  >*/}
            {/*    <i className="fa fa-cogs d-lg-none d-xl-none" />*/}
            {/*    Menus*/}
            {/*  </DropdownToggle>*/}
            {/*  <DropdownMenu className="dropdown-with-icons">*/}

            {/*    <DropdownItem tag={Link} to="/register-page">*/}
            {/*      <i className="tim-icons icon-bullet-list-67" />*/}
            {/*      Register Page*/}
            {/*    </DropdownItem>*/}
            {/*    <DropdownItem tag={Link} to="/landing-page">*/}
            {/*      <i className="tim-icons icon-image-02" />*/}
            {/*      Landing Page*/}
            {/*    </DropdownItem>*/}
            {/*    <DropdownItem tag={Link} to="/profile-page">*/}
            {/*      <i className="tim-icons icon-single-02" />*/}
            {/*      Profile Page*/}
            {/*    </DropdownItem>*/}
            {/*  </DropdownMenu>*/}
            {/*</UncontrolledDropdown>*/}
            {isAdmin ?
                <UncontrolledDropdown nav>
                  <DropdownToggle
                      caret
                      color="default"
                      data-toggle="dropdown"
                      href="#pablo"
                      nav
                      onClick={(e) => e.preventDefault()}
                  >
                    <i className="fa fa-cogs d-lg-none d-xl-none" />
                    Admin
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-with-icons">

                    <DropdownItem tag={Link} to="/add_doctor">
                      <i className="tim-icons icon-bullet-list-67" />
                      Add Doctor
                    </DropdownItem>
                    <DropdownItem tag={Link} to="/add_patient">
                      <i className="tim-icons icon-image-02" />
                      Add Patient
                    </DropdownItem>
                    <DropdownItem tag={Link} to="/search">
                      <i className="tim-icons icon-single-02" />
                      View Doctor
                    </DropdownItem>
                    {/*<DropdownItem tag={Link} to="/search_patient">*/}
                    {/*  <i className="tim-icons icon-single-02" />*/}
                    {/*  View Patient*/}
                    {/*</DropdownItem>*/}
                    <DropdownItem tag={Link} to="/remove">
                      <i className="tim-icons icon-single-02" />
                      Delete User
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                : <>

                </>}
            {isDoctor ?
                <>
                  <UncontrolledDropdown nav>
                    <DropdownToggle
                        caret
                        color="default"
                        data-toggle="dropdown"
                        href="#pablo"
                        nav
                        onClick={(e) => e.preventDefault()}
                    >
                      <i className="fa fa-cogs d-lg-none d-xl-none" />
                      Doctor
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-with-icons">

                      <DropdownItem tag={Link} to="/add_record">
                        <i className="tim-icons icon-bullet-list-67" />
                        Add Record
                      </DropdownItem>

                      <DropdownItem tag={Link} to="/view_record">
                        <i className="tim-icons icon-single-02" />
                        View record
                      </DropdownItem>
                      {/*<DropdownItem tag={Link} to="/search_patient">*/}
                      {/*  <i className="tim-icons icon-single-02" />*/}
                      {/*  View Patient*/}
                      {/*</DropdownItem>*/}

                    </DropdownMenu>
                  </UncontrolledDropdown>
                </>
                :
                <></>
            }
            {isHome ?
                <>
                  <NavItem className="p-0">
                    <NavLink
                        data-placement="bottom"
                        tag={Link}
                        rel="noopener noreferrer"
                        to="/Doctor_Profile"
                        title="Profile"
                    >
                      I am Doctor
                      <p className="d-lg-none d-xl-none">Profile</p>
                    </NavLink>
                  </NavItem>
                  <NavItem className="p-0">
                    <NavLink
                        data-placement="bottom"
                        tag={Link}
                        rel="noopener noreferrer"
                        to="/patient_profile"
                        title="Profile"
                    >
                      I am Patient
                      <p className="d-lg-none d-xl-none">Profile</p>
                    </NavLink>
                  </NavItem>
                </>
                :
                <></>
            }
            <NavItem className="p-0">
              <NavLink
                  data-placement="bottom"
                  tag={Link}
                  rel="noopener noreferrer"
                  to="/admin"
                  title="Profile"
              >
                <i className="tim-icons icon-single-02"/>
                <p className="d-lg-none d-xl-none">Profile</p>
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}
