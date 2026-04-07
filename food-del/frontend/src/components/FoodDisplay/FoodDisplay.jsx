import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category, searchQuery = "" }) => {
    const { food_list } = useContext(StoreContext);
    const normalizedSearch = searchQuery.toLowerCase();
    const filteredFoodList = food_list.filter((item) => {
        const matchCategory =
            normalizedSearch ||
            category === "All" ||
            category === item.category;
        if (!matchCategory) return false;
        if (!normalizedSearch) return true;

        const matchName = item.name?.toLowerCase().includes(normalizedSearch);
        const matchDescription = item.description
            ?.toLowerCase()
            .includes(normalizedSearch);
        return matchName || matchDescription;
    });
    return (
        <div className="food-display" id="food-display">
            <h2>Những món ăn dành cho bạn:</h2>
            <div className="food-display-list">
                {filteredFoodList.map((item, index) => (
                    <FoodItem
                        key={index}
                        id={item._id}
                        name={item.name}
                        price={item.price}
                        description={item.description}
                        image={item.image}
                    />
                ))}
            </div>
        </div>
    )
}
export default FoodDisplay;