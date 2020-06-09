import React, { useEffect, useRef } from 'react';
import { select, axisBottom, axisLeft, scaleLinear, scaleOrdinal, scaleBand, event } from 'd3';
import gender_data from '../data/gender.croatia.json';

function BarChart() {
  const svgRef = useRef();
  const divRef = useRef();
  useEffect(() => {
    const svg = select(svgRef.current);
    const div = select(divRef.current);
    //const title = data.properties.name;
    //const xAxisLabel = 'Date';
    //const yAxisLabel = 'Noumber of tourists';

    // let margin = { top: 10, right: 30, bottom: 20, left: 50 };
    //let height = 400 - margin.top - margin.bottom;

    let groups = Object.values(gender_data).map((date) => date['datum']);
    let subgroups = ['Žene', 'Muškarci'];

    let x = scaleBand().domain(groups).range([0, 450]).padding([0.2]);
    let y = scaleLinear().domain([0, 2000000]).range([450, 0]);

    svg
      .append('g')
      .attr('transform', `translate(75, ${450})`)
      .call(axisBottom(x).tickSize(0))
      .selectAll('text')
      .style('text-anchor', 'start')
      .attr('dx', '.8em')
      .attr('dy', '.12em')
      .attr('transform', 'rotate(65)');
    svg.append('g').attr('transform', 'translate(75, 0)').call(axisLeft(y));

    let xSubGroup = scaleBand().domain(subgroups).range([0, x.bandwidth()]).padding([0.05]);

    let color = scaleOrdinal().domain(subgroups).range(['#e41a1c', '#377eb8']);

    svg
      .append('g')
      .attr('transform', 'translate(75,0)')
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
      .attr('height', (d) => 450 - y(d.value))
      .attr('fill', (d) => color(d.key));
  }, []);

  return (
    <div ref={divRef}>
      <svg ref={svgRef} height="500" width="750" />
      <div className="toolTip" />
    </div>
  );
}

export default BarChart;
