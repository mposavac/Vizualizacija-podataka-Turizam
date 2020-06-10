import React, { useEffect, useRef } from 'react';
import { select, axisBottom, axisLeft, scaleLinear, scaleOrdinal, scaleBand, event } from 'd3';
import gender_data from '../data/gender.croatia.json';

function BarChart() {
  const svgRef = useRef();
  const divRef = useRef();
  useEffect(() => {
    const svg = select(svgRef.current);
    const div = select(divRef.current);
    const title = 'Tourist by gender in Croatia';
    const xAxisLabel = 'Date';
    const yAxisLabel = 'Noumber of tourists';

    let margin = { top: 100, right: 50, bottom: 75, left: 100 };
    let height = 600,
      width = 750;

    let groups = Object.values(gender_data).map((date) => date['datum']);
    let subgroups = ['Žene', 'Muškarci'];

    let x = scaleBand()
      .domain(groups)
      .range([margin.left, width - margin.left - margin.right])
      .padding([0.2]);
    let y = scaleLinear()
      .domain([0, 2500000])
      .range([height - margin.top, margin.top]);

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(axisBottom(x).tickSize(0))
      .selectAll('text')
      .style('text-anchor', 'start')
      .attr('dx', '.8em')
      .attr('dy', '.12em')
      .attr('transform', 'rotate(65)');

    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top - margin.bottom})`)
      .call(axisLeft(y).ticks(8, 's'));

    let xSubGroup = scaleBand().domain(subgroups).range([0, x.bandwidth()]).padding([0.1]);

    let color = scaleOrdinal().domain(subgroups).range(['#ef3e36', '#377eb8']);

    svg
      .append('g')
      .attr('transform', `translate(0, ${margin.top - margin.bottom})`)
      .selectAll('g')
      .data(gender_data)
      .enter()
      .append('g')
      .attr('transform', (d) => `translate(${x(d.datum)}, 0)`)
      .selectAll('rect')
      .data((d) => subgroups.map((key) => ({ key: key, value: d[key] })))
      .enter()
      .append('rect')
      .on('mousemove', (d) => {
        div
          .selectAll('.toolTip')
          .style('top', event.pageY - 25 + 'px')
          .style('left', event.pageX + 10 + 'px')
          .style('display', 'inline-block')
          .html(d.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '<br>' + d.key);
      })
      .on('mouseout', (d) => div.selectAll('.toolTip').style('display', 'none'))
      .transition()
      .duration(500)
      .attr('x', (d) => xSubGroup(d.key))
      .attr('y', (d) => y(d.value))
      .attr('width', (d) => xSubGroup.bandwidth())
      .attr('height', (d) => height - margin.top - y(d.value))
      .attr('fill', (d) => color(d.key));

    svg
      .select('.title')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${width / 2}, 35)`)
      .attr('font-size', '1.5em')
      .text(title);

    svg
      .select('.xaxis-label')
      .attr('transform', `translate(${width / 2}, ${height - 10})`)
      .style('text-anchor', 'middle')
      .text(xAxisLabel);

    svg
      .select('.yaxis-label')
      .attr('transform', 'rotate(-90)')
      .attr('y', '25')
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Value')
      .text(yAxisLabel);
    // ;
    ['#ef3e36', '#377eb8'].forEach((element, i) => {
      svg
        .select('.legend')
        .append('rect')
        .attr('x', width - 100)
        .attr('y', 100 + i * 20)
        .attr('width', '10')
        .attr('height', '10')
        .style('fill', element);

      svg
        .select('.legend')
        .append('text')
        .attr('x', width - 80)
        .attr('y', 105 + i * 20)
        .attr('text-anchor', 'left')
        .attr('font-size', '10x')
        .style('alignment-baseline', 'middle')
        .text(i ? 'Muškarci' : 'Žene');
    });
  }, []);

  return (
    <div ref={divRef}>
      <svg ref={svgRef} height="600" width="750">
        <text className="title" />
        <text className="xaxis-label" />
        <text className="yaxis-label" />
        <g className="legend"></g>
      </svg>
      <div className="toolTip" />
    </div>
  );
}

export default BarChart;
