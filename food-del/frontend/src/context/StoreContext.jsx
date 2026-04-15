import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);
const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:3050"
    const [token,setToken] = useState("");
    const [foodlist, setFoodList] = useState(food_list);
    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if(token){
            await axios.post(url+"/api/cart/add",{itemId}, {headers: {token}})
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (token){
            await axios.post(url+"/api/cart/remove",{itemId}, {headers: {token}})
        }
    }
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = foodlist.find(
                    (product) => String(product._id) === String(item)
                );
                if (itemInfo) totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    };
    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            const data = response.data?.data;
            if (response.data?.success && Array.isArray(data) && data.length > 0) {
                setFoodList(prev => {
                    const newItems = data.filter(d => !prev.some(p => p._id === d._id));
                    return [...prev, ...newItems];
                });
            }
        } catch (e) {
            console.error(e);
        }
    };
    const loadCarData = async (token) => {
        try {
            const response = await axios.get(url + "/api/cart/get", {
                headers: { token },
            });
            if (response.data?.success === false) {
                // Token không hợp lệ hoặc hết hạn → clear
                localStorage.removeItem("token");
                setToken("");
                setCartItems({});
                return;
            }
            const raw = response.data?.cartData;
            setCartItems(
                raw != null && typeof raw === "object" && !Array.isArray(raw)
                    ? { ...raw }
                    : {}
            );
        } catch (e) {
            console.error(e);
        }
    };
    useEffect(()=>{
        async function loadData(){
            await fetchFoodList();
            if(localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await loadCarData(localStorage.getItem("token"));
            }
        }
        loadData();
    },[])

    const contextValue = {
        url,
        token,
        setToken,
        food_list: foodlist,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        
    }
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider;