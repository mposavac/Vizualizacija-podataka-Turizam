import React, { useState, useEffect } from 'react';
import GeoChart from './components/GeoChart';
import Controls from './components/Controls';
import world from './data/GeoChart.world.geo.json';
import croatia from './data/GeoChart.croatia.geo.json';
import world_data from './data/data.world.json';
import croatia_data from './data/data.croatia.json';
import './style/index.scss';

function App() {
  const [geoData, setGeoData] = useState(world);
  const [data, setData] = useState(world_data);
  const [dataReady, setDataReady] = useState(false);
  const [dataIndicator, setDataIndicator] = useState('world');
  const [isPlayed, setIsPlayed] = useState(false);
  const yearsRange = {
    world: {
      min: 1995,
      max: 2018,
    },
    croatia: {
      min: 2016,
      max: 2019,
    },
  };
  const [year, setYear] = useState(yearsRange.world.min);

  useEffect(() => {
    if (geoData === world) {
      geoData.features.forEach((feature) => {
        const tourism_data = world_data.filter(
          (country) => country['Country Code'] === feature.properties['adm0_a3'],
        );
        feature.properties.tourism = tourism_data;
      });
      setDataReady(true);
    } else {
      geoData.features.forEach((feature) => {
        const tourism_data = croatia_data.filter(
          (country) =>
            country['Županije'].toLowerCase() === feature.properties['name'].toLowerCase(),
        );
        feature.properties.tourism = tourism_data;
      });
      setDataReady(true);
    }
  }, [data, geoData]);

  useEffect(() => {
    if (year < yearsRange[dataIndicator].max && isPlayed) {
      let timeout = setTimeout(() => {
        const yearIncreased = year + 1;
        setYear(yearIncreased);
      }, 1000);
      return () => clearTimeout(timeout);
    }
    //eslint-disable-next-line
  }, [isPlayed, year, setYear]);

  const handleBtnClick = (e) => {
    setDataReady(false);
    if (e.target.getAttribute('class') === 'btn-world') {
      setGeoData(world);
      setData(world_data);
      setDataIndicator('world');
      setYear(yearsRange.world.min);
    } else {
      setGeoData(croatia);
      setData(croatia_data);
      setDataIndicator('croatia');
      setYear(yearsRange.croatia.min);
    }
  };

  const handleYearChange = (e) => {
    setIsPlayed(false);
    setYear(parseInt(e.target.value));
  };

  const play = async () => {
    if (isPlayed) setIsPlayed(false);
    else {
      setIsPlayed(true);
    }
  };

  return (
    <div className="home">
      {dataReady && <GeoChart geoData={geoData} data={data} property={year} />}
      <Controls
        handleBtnClick={handleBtnClick}
        handleYearChange={handleYearChange}
        year={year}
        yearsRange={yearsRange}
        dataIndicator={dataIndicator}
        play={play}
        isPlayed={isPlayed}
      />
    </div>
  );
}

export default App;
