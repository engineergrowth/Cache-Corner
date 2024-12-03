import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Modal from "react-modal";
import "./styles/index.css";

Modal.setAppElement('#root');


ReactDOM.createRoot(document.getElementById("root")).render(<App />);
