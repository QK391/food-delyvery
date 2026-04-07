import React from "react";
import "./AppDownload.css";
import { assets } from "../../assets/assets";
const AppDownload = () => {
    return (
        <div className="app-download" id="app-download">
            <p>Tải ứng dụng Tomato để
            <br/> có trải nghiệm tốt hơn</p>
           <div className="app-downlaod-platforms">
            <img src={assets.app_store} alt=""></img>
            <img src={assets.play_store} alt=""></img>
           </div>
        </div>
    );
}
export default AppDownload;