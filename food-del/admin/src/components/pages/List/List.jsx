import React, { useEffect, useState } from "react";
import axios from "axios";
import './List.css';
import { toast } from "react-toastify";

const List = () => {
    const url = "http://localhost:3000"
    const [list, setList] = useState([]);
    const fetchList = async ()=>{
        const response = await axios.get(`${url}/api/food/list`)
        console.log(response.data)
        if(response.data.success){
            setList(response.data.data)
        }else{
            toast.error("Error")
        }
    }
    useEffect(()=>{
        fetchList();
    },[])
    return (
        <div className="list add flex-col">
            <p>Add food list</p>
            <div className="list-table">
                <div className="list-table-fomart title">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b>Action</b>
                </div>
                {list.map((item,index)=>{
                    return(
                        <div key={index} className="list-table-fomart">
                            <img src={`${url}/image/` + item.image} alt=""/>
                            <p>{item.name}</p>
                            <p>{item.category}</p>
                            <p>${item.price}</p>
                            <p>X</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
export default List