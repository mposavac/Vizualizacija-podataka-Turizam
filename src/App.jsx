import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import GeoChart from './components/GeoChart';
import AreaChart from './components/AreaChart';
import CroatiaChartsController from './components/CroatiaChartsController';
import Controls from './components/Controls';
import world from './data/GeoChart.world.geo.json';
import croatia from './data/GeoChart.croatia.geo.json';
import world_data from './data/data.world.json';
import croatia_data from './data/data.croatia.json';
import croatia_bymonths_data from './data/data2019-2020.croatia.json';
import './style/index.scss';

function App({ countrySelected }) {
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
    world.features.forEach((feature) => {
      const tourism_data = world_data.filter(
        (country) => country['Country Code'] === feature.properties['adm0_a3'],
      );
      feature.properties.tourism = tourism_data;
    });

    croatia.features.forEach((feature) => {
      const tourism_data = croatia_data.filter(
        (country) => country['Županije'].toLowerCase() === feature.properties['name'].toLowerCase(),
      );

      const bymonths_data = croatia_bymonths_data.filter(
        (country) =>
          country['Prostorna jedinica'].toLowerCase() === feature.properties['name'].toLowerCase(),
      );
      feature.properties.tourism = [...tourism_data, ...bymonths_data];
    });
    setDataReady(true);
  }, []);

  useEffect(() => {
    if (year < yearsRange[dataIndicator].max && isPlayed) {
      let timeout = setTimeout(() => {
        const yearIncreased = year + 1;
        setYear(yearIncreased);
      }, 1000);
      return () => {
        clearTimeout(timeout);
      };
    } else setIsPlayed(false);
    //eslint-disable-next-line
  }, [isPlayed, year, setYear]);

  const handleBtnClick = (e) => {
    setDataReady(false);
    setIsPlayed(false);
    if (e.target.getAttribute('class') === 'btn-world') {
      setGeoData(world);
      setData(world_data);
      setDataIndicator('world');
      setYear(yearsRange.world.min);
      setTimeout(() => {
        setDataReady(true);
      }, 100);
    } else {
      setGeoData(croatia);
      setData(croatia_data);
      setDataIndicator('croatia');
      setYear(yearsRange.croatia.min);
      setTimeout(() => {
        setDataReady(true);
      }, 100);
    }
  };

  const handleYearChange = (e) => {
    setIsPlayed(false);
    setYear(parseInt(e));
  };

  const play = async () => {
    if (dataIndicator === 'world' && year === yearsRange.world.max) setYear(yearsRange.world.min);
    if (dataIndicator === 'croatia' && year === yearsRange.croatia.max)
      setYear(yearsRange.croatia.min);
    if (isPlayed) setIsPlayed(false);
    else setIsPlayed(true);
  };

  return (
    <div className="home">
      {dataReady ? (
        <GeoChart geoData={geoData} data={data} property={year} dataIndicator={dataIndicator} />
      ) : (
        <div className="svg-wrapper"></div>
      )}
      {countrySelected && (
        <AreaChart data={countrySelected} year={year} dataIndicator={dataIndicator} />
      )}

      <Controls
        handleBtnClick={handleBtnClick}
        handleYearChange={handleYearChange}
        year={year}
        yearsRange={yearsRange}
        dataIndicator={dataIndicator}
        play={play}
        isPlayed={isPlayed}
      />
      {dataIndicator === 'croatia' && <CroatiaChartsController countrySelected={countrySelected} />}
    </div>
  );
}

const mapStateToProps = (state) => ({
  countrySelected: state.countrySelected,
});
export default connect(mapStateToProps)(App);
