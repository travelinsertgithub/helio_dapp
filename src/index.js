// import React from 'react';
// import ReactDOM from 'react-dom';
// import 'bootstrap/dist/css/bootstrap.css'

// import * as serviceWorker from './serviceWorker';
//
// ReactDOM.render(<App />, document.getElementById('root'));
//
// serviceWorker.unregister();

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "./assets/css/nucleo-icons.css";
import "./assets/scss/blk-design-system-react.scss?v=1.2.0";
import "./assets/demo/demo.css";

// import Index from "views/Index.js";
import App from './views/Index';
import LandingPage from "./views/examples/LandingPage";
import RegisterPage from "./views/examples/RegisterPage";
import ProfilePage from "./views/examples/ProfilePage";
import AdminPage from "./views/examples/AdminPage";
import AddDoctor from "./views/examples/Doctor/AddDoctor";
import SearchDoctor from "./views/examples/Doctor/SearchDoctor";
import DoctorInfo from "./views/examples/Doctor/DoctorInfo";
import AddPatient from './views/examples/patient/AddPatient';
import SearchPatient from './views/examples/patient/SearchPatient';
import PatientInfo from './views/examples/patient/PatientInfo';
import DeleteUser from './views/examples/DeleteUser';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route path="/index" render={(props) => <App {...props} />} />
            {/*<Route*/}
            {/*    path="/landing-page"*/}
            {/*    render={(props) => <LandingPage {...props} />}*/}
            {/*/>*/}
            <Route
                path="/register-page"
                render={(props) => <RegisterPage {...props} />}
            />
            <Route
                path="/profile-page"
                render={(props) => <ProfilePage {...props} />}
            />
            <Route
                path="/admin"
                render={(props) => <AdminPage {...props} />}
            />
            <Route
                path="/add_doctor"
                render={(props) => <AddDoctor {...props} />}
            />
            <Route
                path="/search"
                render={(props) => <SearchDoctor {...props} />}
            />
            <Route
                path="/doctor"
                render={(props) => <DoctorInfo {...props} />}
            />
            <Route
                path="/add_patient"
                render={(props) => <AddPatient {...props} />}
            />
            <Route
                path="/search_patient"
                render={(props) => <SearchPatient {...props} />}
            />
            <Route
                path="/patient"
                render={(props) => <PatientInfo {...props} />}
            />
            <Route
                path="/remove"
                render={(props) => <DeleteUser {...props} />}
            />
            <Redirect from="/" to="/index" />
        </Switch>
    </BrowserRouter>,
    document.getElementById("root")
);
