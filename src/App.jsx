import React, { useState, useEffect } from "react";
import GeoChart from "./components/GeoChart";
import world from "./data/GeoChart.world.geo.json";
import croatia from "./data/GeoChart.croatia.geo.json";
import world_data from "./data/data.world.json";
import croatia_data from "./data/data.croatia.json";
import "./style/index.scss";

function App() {
  const [geoData, setGeoData] = useState(world);
  const [data, setData] = useState(world_data);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    if (geoData === world) {
      geoData.features.forEach((feature) => {
        const tourism_data = world_data.filter(
          (country) => country["Country Code"] === feature.properties["adm0_a3"]
        );
        feature.properties.tourism = tourism_data;
      });
      setDataReady(true);
    } else {
      geoData.features.forEach((feature) => {
        const tourism_data = croatia_data.filter(
          (country) =>
            country["Županije"].toLowerCase() ===
            feature.properties["name"].toLowerCase()
        );
        feature.properties.tourism = tourism_data;
      });
      setDataReady(true);
    }
    console.log(data);
  }, [data, geoData]);

  const handleBtnClick = (e) => {
    setDataReady(false);
    if (e.target.getAttribute("class") === "btn-world") {
      setGeoData(world);
      setData(world_data);
    } else {
      setGeoData(croatia);
      setData(croatia_data);
    }
  };

  const handleDataChange = () => {
    setDataReady(false);
    if (data === croatia_data) {
      setGeoData(world);
      setData(world_data);
    } else {
      setGeoData(croatia);
      setData(croatia_data);
    }
  };

  return (
    <div className="home">
      <button className="btn-world" onClick={handleBtnClick}>
        World
      </button>
      <button className="btn-croatia" onClick={handleBtnClick}>
        Croatia
      </button>
      {dataReady && (
        <GeoChart
          geoData={geoData}
          data={data}
          property="2018"
          changeGeoData={handleDataChange}
        />
      )}
    </div>
  );
}

export default App;
