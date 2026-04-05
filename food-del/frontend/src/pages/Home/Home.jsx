import React, {useMemo, useState} from "react";
import "./Home.css"
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import AppDownload from "../../components/AppDownload/AppDownload";
import { useSearchParams } from "react-router-dom";

const Home = () => {
    const [category, setCategory] = useState("All");
    const [searchParams] = useSearchParams();
    const searchQuery = useMemo(() => (searchParams.get("search") || "").trim(), [searchParams]);
    return (
        <div>
            <Header/>
            <ExploreMenu category={category} setCategory={setCategory}/>
            <FoodDisplay category={category} searchQuery={searchQuery}/>
            <AppDownload/>
        </div>
    )
}
export default Home;