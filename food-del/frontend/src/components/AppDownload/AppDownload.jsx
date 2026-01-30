import React from "react";
import "./AppDownload.css";
import { assets } from "../../assets/assets";
const AppDownload = () => {
    return (
        <div className="app-download" id="app-download">
            <p>For Experience Download <br/> Tomamto App</p>
           <div className="app-downlaod-platforms">
            <img src={assets.app_store} alt=""></img>
            <img src={assets.play_store} alt=""></img>
           </div>
        </div>
    );
}
export default AppDownload;