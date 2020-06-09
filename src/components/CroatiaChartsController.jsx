import React, { useState } from 'react';
import { connect } from 'react-redux';
import PieChart from './PieChart';
import GroupedBarChart from './GroupedBarChart';
import CircularBarChart from './CircularBarChart';

function CroatiaChartsController({ changeCountry, countrySelected }) {
  const [chart, setChart] = useState(null);

  const handleChartChange = (e) => {
    const id = e.target.getAttribute('id');
    if (id === 'exit-btn') setChart(null);
    else if (id === chart) setChart(null);
    else setChart(id);
    changeCountry(null);
  };
  let btnNames = ['age', 'gender', 'country'];
  let btnIcons = {
    age: 'baby',
    gender: 'venus-mars',
    country: 'globe-americas',
  };
  return (
    <div
      className="croatia-extra-charts"
      style={
        countrySelected
          ? { right: '-10%', opacity: 0 }
          : chart
          ? { background: 'rgba(255,255,255, 0.8)', width: '100%' }
          : { background: 'rgba(255,255,255, 0)', width: '10%' }
      }
    >
      {chart && (
        <div onClick={handleChartChange} id="exit-btn">
          x
        </div>
      )}
      <div className="croatia-btns">
        {btnNames.map((btn) => (
          <button key={btn} id={`btn-${btn}`} className="btn" onClick={handleChartChange}>
            <i className={`fas fa-${btnIcons[btn]}`} />
            <span>Show by {btn}</span>
          </button>
        ))}
      </div>

      {chart === 'btn-age' && !countrySelected && <PieChart />}
      {chart === 'btn-country' && !countrySelected && <CircularBarChart />}
      {chart === 'btn-gender' && !countrySelected && <GroupedBarChart />}
    </div>
  );
}

const mapStateToProps = (store) => ({
  countrySelected: store.countrySelected,
});

const mapStateToDispatch = (dispatch) => ({
  changeCountry: (countrySelected) => dispatch({ type: 'CHANGE_COUNTRY', data: countrySelected }),
});

export default connect(mapStateToProps, mapStateToDispatch)(CroatiaChartsController);
