import React, { useContext } from "react";
import "./ExploreMenu.css";
import { StoreContext } from "../../context/StoreContext";

const ExploreMenu = ({category, setCategory}) => {
const { categories, url } = useContext(StoreContext);
    return (
        <div className="explore-menu" id="explore-menu">
            <h1>Khám phá thực đơn của chúng tôi</h1>
            <p className="explore-menu-text">Hãy chọn những món ăn được chế biến từ những nguyên liệu tốt nhất.</p>
            <div className="explore-menu-list">
                {categories.map((item, index) => (
                    <div
                        onClick={() => setCategory(prev => prev === item.name ? "All" : item.name)}
                        key={index}
                        className="explore-menu-list-item"
                    >
                        {item.image
                            ? <img className={category === item.name ? "active" : ""} src={url + "/images/" + item.image} alt={item.nameVi || item.name} />
                            : <div className={`explore-menu-placeholder ${category === item.name ? "active" : ""}`}>{(item.nameVi || item.name).charAt(0)}</div>
                        }
                        <p>{item.nameVi || item.name}</p>
                    </div>
                ))}
            </div>
            <hr/>
        </div>
    )
};
export default ExploreMenu;