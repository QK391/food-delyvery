import React, {useState} from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({setShowLogin}) => {
    const [menu, setMenu] = useState("home");
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const {getTotalCartAmount,token,setToken} = React.useContext(StoreContext);
    const navigate = useNavigate();
    const logout = ()=>{
        localStorage.removeItem("token");
        setToken("");
        navigate("/")
    }

    const handleSearch = () => {
        if (searchQuery.trim() !== "") {
            // Điều hướng sang trang chủ hoặc trang tìm kiếm kèm theo query string
            navigate(`/?search=${searchQuery}`);
        }
    }

    return ( 
        <div className="navbar">
           <Link to="/" onClick={() => { setMenu("home"); window.scrollTo(0, 0); }}><img src={assets.logo} alt="Logo" className="logo" /></Link>
            <ul className="navbar-menu">
                <Link to="/" onClick={()=> setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
                <a href="#explore-menu" onClick={()=> setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a>
                <a href="#app-download" onClick={()=> setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile-app</a> 
                <a href="#footer" onClick={()=> setMenu("contact us")} className={menu === "contact us" ? "active" : ""}>contact us</a>
            </ul>
            <div className="navbar-right">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {showSearch && (
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            style={{ padding: "5px 10px", borderRadius: "20px", border: "1px solid #ccc", outline: "none" }} 
                        />
                    )}
                    <img src={assets.searchIcon} alt="" onClick={() => setShowSearch(!showSearch)} style={{ height: 25, cursor: "pointer" }} />
                </div>
                <div className="navbar-search-icon">
                    <Link to='/cart'><img src={assets.cartIcon} alt="" style={{height: 25}}/></Link>
                    <div className={getTotalCartAmount()===0?"":"dot"}></div>
                </div>
                {!token?<button onClick={()=>setShowLogin(true)}>Sign in</button>:
                <div className="navbar-profile">
                    <img src={assets.user_icon} alt=""/>
                    <ul className="nav-profile-dropdown">
                        <li onClick={()=>navigate("/myorders")}><img src={assets.bag_icon} alt="" />Orders</li>
                        <hr/>
                        <li onClick={logout}><img src={assets.logout_icon} alt="" />Logout</li>
                    </ul>
                </div>}
            </div>
        </div>
    )
}
export default Navbar;