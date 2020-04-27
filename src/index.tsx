import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { City } from "./Model";
import App from "./App";

const cities = localStorage.getItem("cities");
let data: City[] = cities ? JSON.parse(cities) : [];

ReactDOM.render(<App cities={data} />, document.querySelector("#root"));
