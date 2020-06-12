import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { select, axisBottom, axisLeft, scaleLinear, scaleBand, format, area, curveBasis } from 'd3';

function AreaChart({ data, dataIndicator, isByMonths, toggleMonths, changeCountry }) {
  const svgRef = useRef();
  const divRef = useRef();
  const [yearOrMonthsData, setYearOrMonthsData] = useState(data.properties.tourism[0]);
  const height = 600,
    width = 750,
    margin = { top: 100, left: 100, right: 100, bottom: 50 };

  useEffect(() => {
    if (data.properties.tourism.length > 0) {
      if (dataIndicator === 'world') setYearOrMonthsData(data.properties.tourism[0]);
      const title = data.properties.name;
      const xAxisLabel = isByMonths ? 'Month' : 'Year';
      const yAxisLabel = 'Number of tourists';
      let keys = Object.keys(yearOrMonthsData).filter(
        (year) =>
          parseInt(year) &&
          parseInt(year) >= 1995 &&
          parseInt(year) < (dataIndicator === 'world' ? 2019 : isByMonths ? 2021 : 2020),
      );

      let new_data = keys.map((key) => {
        let tourists = yearOrMonthsData[key] === '-' ? 0 : yearOrMonthsData[key];
        return {
          year: key,
          numberOfTourists: tourists,
        };
      });

      const max = Math.max.apply(
        Math,
        new_data.map((o) => o.numberOfTourists),
      );

      const svg = select(svgRef.current);
      let xScale;
      if (dataIndicator === 'croatia' && isByMonths)
        xScale = scaleBand()
          .domain(keys)
          .range([margin.left, width - margin.left]);
      else
        xScale = scaleLinear()
          .domain(dataIndicator === 'world' ? [1995, 2018] : [2016, 2019])
          .range([margin.left, width - margin.left]);

      const yScale = scaleLinear()
        .domain([0, max])
        .range([height - margin.top, margin.top]);

      const scaleXData = (point) => xScale(point.year);
      const scaleYData = (point) => yScale(point.numberOfTourists);

      let xAxis;
      if (dataIndicator === 'world') xAxis = axisBottom(xScale).tickFormat(format('1000'));
      else if (dataIndicator === 'croatia' && isByMonths) xAxis = axisBottom(xScale).tickSize(0);
      else xAxis = axisBottom(xScale).ticks(4).tickFormat(format('1000'));
      const yAxis = axisLeft(yScale).ticks(10, 's');

      svg
        .select('.line-chart-xaxis')
        .attr('transform', `translate(0, ${height - margin.top})`)
        .call(xAxis);

      svg
        .select('.xaxis-label')
        .attr('transform', `translate(${width / 2}, ${height - 40})`)
        .style('text-anchor', 'middle')
        .text(xAxisLabel);

      if (isByMonths)
        svg
          .select('.line-chart-xaxis')
          .selectAll('text')
          .style('text-anchor', 'start')
          .attr('dx', '.8em')
          .attr('dy', '.12em')
          .attr('transform', 'rotate(65)');

      svg.select('.line-chart-yaxis').attr('transform', `translate(${margin.left}, 0)`).call(yAxis);
      svg
        .select('.yaxis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', '25')
        .attr('x', 0 - height / 2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text(yAxisLabel);

      svg.append('path').attr('class', 'line-chart-line').attr('transform', `translate(2, -1)`);

      const curve = area()
        .x(scaleXData)
        .y0(height - margin.top)
        .y1(scaleYData)
        .curve(curveBasis);

      svg.select('.line-chart-line').transition().duration(250).attr('d', curve(new_data));
      svg
        .select('.title')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${width / 2}, 35)`)
        .attr('font-size', `${dataIndicator === 'croatia' ? '1.5em' : '2em'}`)
        .text(`Arrivals in ${title} ${dataIndicator === 'croatia' ? 'županija' : ''}`);
    }
    //eslint-disable-next-line
  }, [data, yearOrMonthsData]);

  const handleDataChange = (e) => {
    if (e.target.getAttribute('id') === 'exit-btn') changeCountry(null);
    else if (isByMonths) {
      setYearOrMonthsData(data.properties.tourism[0]);
      toggleMonths();
    } else {
      setYearOrMonthsData(data.properties.tourism[1]);
      toggleMonths();
    }
  };

  const renderPeople = () => {
    let ratio = (
      data.properties.tourism[0][dataIndicator === 'croatia' ? 2019 : 2018] /
      data.properties.pop_est
    ).toFixed(2);
    let icons = [];
    for (let i = 0; i < Math.ceil(ratio); i++) {
      icons.push(<i key={i} className="fas fa-walking" />);
    }
    return (
      <div className="tourist-on-citizen">
        <div className="icons">
          <div className="people-icons" style={{ width: (20 + 4) * ratio }}>
            {icons}
          </div>
          <i className="fas fa-male"></i>
        </div>
        <div className="info">
          <span>{ratio} tourists</span>
          <span>{`on every citizen in ${dataIndicator === 'croatia' ? 2019 : 2018}`}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="chart-wrapper" ref={divRef}>
      <div
        onClick={(e) => {
          if (isByMonths) toggleMonths();
          handleDataChange(e);
        }}
        id="exit-btn"
      >
        x
      </div>
      <svg ref={svgRef} height="600" width="750">
        <text className="title" />
        <g className="line-chart-xaxis"></g>
        <text className="xaxis-label" />
        <g className="line-chart-yaxis"></g>
        <text className="yaxis-label" />
      </svg>
      {dataIndicator === 'croatia' && (
        <button className="btn-months" onClick={handleDataChange}>
          Details by {isByMonths ? 'years' : 'months'}
        </button>
      )}

      {renderPeople()}
    </div>
  );
}

const mapStateToProps = (state) => ({
  isByMonths: state.isByMonths,
});

const mapStateToDispatch = (dispatch) => ({
  toggleMonths: () => dispatch({ type: 'TOGGLE_YEARS_MONTHS' }),
  changeCountry: (countrySelected) => dispatch({ type: 'CHANGE_COUNTRY', data: countrySelected }),
});

export default connect(mapStateToProps, mapStateToDispatch)(AreaChart);
