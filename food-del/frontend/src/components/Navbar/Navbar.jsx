import React from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({setShowLogin}) => {
    const [menu, setMenu] = React.useState("menu");
    const {getTotalCartAmount} = React.useContext(StoreContext)

    return ( 
        <div className="navbar">
           <Link><img src={assets.logo} alt="Logo" className="logo" /></Link>
            <ul className="navbar-menu">
                <Link to="/" onClick={()=> setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
                <a href="#explore-menu" onClick={()=> setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a>
                <a href="#app-download" onClick={()=> setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile-app</a> 
                <a href="#footer" onClick={()=> setMenu("contact us")} className={menu === "contact us" ? "active" : ""}>contact us</a>
            </ul>
            <div className="navbar-right">
                <img src={assets.searchIcon} alt="" style={{height: 25}}/>
                <div className="navbar-search-icon">
                    <Link to='/cart'><img src={assets.cartIcon} alt="" style={{height: 25}}/></Link>
                    <div className={getTotalCartAmount()===0?"":"dot"}></div>
                </div>
                <button onClick={()=>setShowLogin(true)}>sign in</button>
            </div>
        </div>
    )
}
export default Navbar;