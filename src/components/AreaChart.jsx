import React, { useEffect, useRef, useState } from 'react';
import { select, axisBottom, axisLeft, scaleLinear, format, area, curveBasis } from 'd3';

function AreaChart({ data, year, dataIndicator }) {
  const svgRef = useRef();
  const [dataToShow, setDataToShow] = useState(data.properties.tourism[0]);

  useEffect(() => {
    const title = data.properties.name;
    const xAxisLabel = 'Year';
    const yAxisLabel = 'Noumber of tourists';

    let keys = Object.keys(data.properties.tourism[0]).filter(
      (year) =>
        parseInt(year) &&
        parseInt(year) >= 1995 &&
        parseInt(year) < (dataIndicator === 'world' ? 2019 : 2020),
    );

    let new_data = keys.map((key) => {
      let tourists = data.properties.tourism[0][key];
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
    const xScale = scaleLinear()
      .domain(dataIndicator === 'world' ? [1995, 2018] : [2016, 2019])
      .range([50, 450]);
    const yScale = scaleLinear().domain([0, max]).range([450, 50]);

    const scaleXData = (point) => xScale(point.year);
    const scaleYData = (point) => yScale(point.numberOfTourists);

    let xAxis;
    if (dataIndicator === 'world') xAxis = axisBottom(xScale).tickFormat(format('1000'));
    else xAxis = axisBottom(xScale).ticks(4).tickFormat(format('1000'));
    const yAxis = axisLeft(yScale).tickFormat(format('.0s'));

    svg
      .select('.line-chart-xaxis')
      .attr('transform', 'translate(0,' + 450 + ')')
      .call(xAxis)
      .select('.axis-label')
      .attr('text-anchor', 'middle')
      .text(xAxisLabel);

    svg
      .select('.line-chart-yaxis')
      .attr('transform', 'translate(50, 0)')
      .call(yAxis)
      .select('.axis-label')
      .attr('text-anchor', 'middle')
      .text(yAxisLabel);

    svg.append('path').attr('class', 'line-chart-line').attr('transform', `translate(2,-2)`);

    const curve = area().x(scaleXData).y0(450).y1(scaleYData).curve(curveBasis);

    svg
      .select('.line-chart-line')
      .on('mouseover', () => {
        //TODO: ON HOVER SHOW VALUE
      })
      .transition()
      .duration(250)
      .attr('d', curve(new_data));
  }, [data]);

  const handleDataChange = (e) => {
    //const className = e.target.getAttribute('class');
    // if (className === 'btn-months') setDataToShow(data.properties.tourism[1]);
  };

  console.log(dataToShow);
  return (
    <div className="chart-wrapper">
      <svg ref={svgRef} height="500" width="750">
        <g className="line-chart-xaxis">
          <text className="axis-label" />
        </g>
        <g className="line-chart-yaxis">
          <text className="axis-label" />
        </g>
      </svg>

      {dataIndicator === 'croatia' && (
        <div className="btn-additional-data">
          <button className="btn-months" onClick={handleDataChange}>
            By months
          </button>
        </div>
      )}
    </div>
  );
}

export default AreaChart;
