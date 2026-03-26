import React, { useState } from "react";
import { assets } from "../../../assets/assets";
import axios from "axios";
import './Add.css'
import { toast } from "react-toastify";

const Add = ({url}) => {
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name:"",
        description:"",
        price:"",
        category:"Salad"
    })
    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data=>({...data,[name]:value}))
    }
    const onSubmitHandler = async(event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("price",Number (data.price))
        formData.append("category", data.category)
        formData.append("image", image)

        const response = await axios.post(`${url}/api/food/add`, formData);
        if (response.data.success) {
            setData({
                name:"",
                description:"",
                price:"",
                category:"Salad"
            })
            setImage(false)
            toast.success(response.data.message)
        }else{
            toast.error(response.data.message)
        }
    }
   
    return (
        <div className="add">
            <form className="flex-col" onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col">
                    <p>Tải hình ảnh lên</p>
                    <label htmlFor="image">
                        <img src={image?URL.createObjectURL(image):assets.upfile_icon} alt=""/>
                    </label>
                    <input onChange={(e)=> setImage(e.target.files[0])} type="file" id="image" hidden required/>
                </div>
                <div className="add-product-name flex-col">
                    <p>Tên món ăn</p>
                    <input onChange={onChangeHandler} value={data.name} type="text" name="name" placeholder="Tên món ăn"/>
                </div>
                <div className="add-product-description flex-col">
                    <p>Mô tả món ăn</p>
                    <textarea
                        onChange={onChangeHandler}
                        value={data.description}
                        name="description" rows="6"
                        placeholder="Mô tả món ăn" required>
                    </textarea>
                </div>
                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Danh mục</p>
                        <select onChange={onChangeHandler} name="category" id="">
                            <option value="Salad">Salad</option>
                            <option value="Món cuốn">Meat</option>
                            <option value="Món tráng miệng">Pizza</option>
                            <option value="Sandwich">Cake</option>
                            <option value="Bánh ngọt">Noodles</option>
                            <option value="Món rau">Drink</option>
                            <option value="Súp">Soup</option>
                        </select>
                    </div>
                    <div className="add-price flex-col">
                        <p>Giá tiền</p>
                        <input onChange={onChangeHandler} value={data.price} type="Number" name="price" placeholder="$20"/>
                    </div>
                </div>
                <button type="submit" className="add-btn">Thêm</button>
            </form>
        </div>
    )
}
export default Add