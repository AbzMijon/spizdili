import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

// Animation
import AOS from "aos";
import "aos/dist/aos.css";


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

AOS.init();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Router>
      <App />
      <ToastContainer />
    </Router>
);
