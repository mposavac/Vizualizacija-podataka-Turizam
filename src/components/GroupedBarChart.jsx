import React, { useState, useEffect, useRef } from 'react';
import { select, axisBottom, axisLeft, scaleLinear, scaleOrdinal, scaleBand, bandwith } from 'd3';
import gender_data from '../data/gender.croatia.json';

function BarChart() {
  const svgRef = useRef();
  useEffect(() => {
    const svg = select(svgRef.current);
    //const title = data.properties.name;
    const xAxisLabel = 'Date';
    const yAxisLabel = 'Noumber of tourists';

    let margin = { top: 10, right: 30, bottom: 20, left: 50 };
    let height = 400 - margin.top - margin.bottom;

    let groups = Object.values(gender_data).map((date) => date['datum']);
    let subgroups = ['Muškarci', 'Žene'];

    let x = scaleBand().domain(groups).range([0, 450]).padding([0.2]);
    let y = scaleLinear().domain([0, 2000000]).range([450, 0]);

    svg.append('g').attr('transform', `translate(75, ${height})`).call(axisBottom(x).tickSize(0));
    svg.append('g').attr('transform', 'translate(75, 0)').call(axisLeft(y));

    let xSubGroup = scaleBand().domain(subgroups).range([0, x.bandwidth()]).padding([0.05]);

    let color = scaleOrdinal().domain(subgroups).range(['#e41a1c', '#377eb8']);

    svg
      .append('g')
      .selectAll('g')
      .data(gender_data)
      .enter()
      .append('g')
      .attr('transform', (d) => `translate(${x(d.datum)}, 0)`)
      .selectAll('rect')
      .data((d) => {
        return subgroups.map((key) => ({ key: key, value: d[key] }));
      })
      .enter()
      .append('rect')
      .attr('x', (d) => xSubGroup(d.key))
      .attr('y', (d) => y(d.value))
      .attr('width', (d) => xSubGroup.bandwidth())
      .attr('height', (d) => 450 - y(d.value))
      .attr('fill', (d) => color(d.key));
  }, []);

  return (
    <div>
      <svg ref={svgRef} height="500" width="750"></svg>
    </div>
  );
}

export default BarChart;
