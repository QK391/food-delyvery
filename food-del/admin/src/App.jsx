import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Route, Routes } from "react-router-dom";
import Add from './components/pages/Add/Add';
import List from './components/pages/List/List';
import Orders from "./components/pages/Orders/Orders";
import Ratings from "./components/pages/Ratings/Ratings";
import Coupons from "./components/pages/Coupons/Coupons";
import Categories from "./components/pages/Categories/Categories";
import { ToastContainer, toast } from 'react-toastify';

const App=()=>{
    const url = "http://localhost:3050"
    return (
        <div>
            <ToastContainer/>
            <Navbar/>
            <hr/>
            <div className="app-content">
                <Sidebar/>
                <Routes>
                    <Route path="/add" element={<Add url={url}/>}/>
                    <Route path="/list" element={<List url={url}/>}/>
                    <Route path="/orders" element={<Orders url={url}/>}/>
                    <Route path="/ratings" element={<Ratings url={url}/>}/>
                    <Route path="/coupons" element={<Coupons url={url}/>}/>
                    <Route path="/categories" element={<Categories url={url}/>}/>
                </Routes>
            </div>
        </div>
    )
}
export default App;