import React, { useState } from "react";
import GeoChart from "./components/GeoChart";
import world from "./data/GeoChart.world.geo.json";
import croatia from "./data/GeoChart.croatia.geo.json";
import "./style/index.scss";

function App() {
  const [geoData, setGeoData] = useState(world);

  const handleBtnClick = (e) => {
    if (e.target.getAttribute("class") === "btn-world") setGeoData(world);
    else setGeoData(croatia);
  };
  return (
    <div className="home">
      <button className="btn-world" onClick={handleBtnClick}>
        World
      </button>
      <button className="btn-croatia" onClick={handleBtnClick}>
        Croatia
      </button>
      <GeoChart
        data={geoData}
        property="pop_est"
        changeGeoData={() => setGeoData(croatia)}
      />
    </div>
  );
}

export default App;
