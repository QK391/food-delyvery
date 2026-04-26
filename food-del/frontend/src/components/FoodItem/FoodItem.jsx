import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import StarRating from "../StarRating/StarRating";

const FoodItem = ({ id, name, price, description, image, avgRating, ratingCount }) => {
    const ctx = useContext(StoreContext);
    const cartItems = ctx?.cartItems ?? {};
    const { addToCart, removeFromCart, url } = ctx ?? {};
    return (
        <div className="food-item">
            <div className="food-item-img-container">
                <img className="food-item-img" src={image?.includes('/') ? image : url + "/images/" + image} alt={name} />
                {!cartItems[id]
                    ? <img className="add" onClick={() => addToCart(id)} src={assets.add_icon} alt="" />
                    : <div className="food-item-counter">
                        <img className="remove" onClick={() => removeFromCart(id)} src={assets.remove_icon} alt="" />
                        <p>{cartItems[id]}</p>
                        <img className="add" onClick={() => addToCart(id)} src={assets.add_icon} alt="" />
                    </div>
                }
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    {ratingCount > 0
                        ? <div className="food-item-rating-wrapper">
                            <StarRating value={avgRating} size="sm" />
                            <span className="food-item-rating-count">({ratingCount})</span>
                          </div>
                        : <span className="food-item-no-rating">Chưa có đánh giá</span>
                    }
                </div>
                <p className="food-item-desc">{description}</p>
                <p className="food-item-price">{price}VND</p>
            </div>
        </div>
    )
}
export default FoodItem;