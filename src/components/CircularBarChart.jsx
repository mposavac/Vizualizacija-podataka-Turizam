import React, { useState, useEffect, useRef } from 'react';
import { scaleBand, arc, select, scaleLinear, event, scaleOrdinal, schemeSet2 } from 'd3';
import country_data from '../data/bycountry.croatia.json';
import { orderBy } from 'lodash';

function CircularBarChart() {
  const options = [
    { property: '2019-01', value: 'January 2019.' },
    { property: '2019-02', value: 'February 2019.' },
    { property: '2019-03', value: 'March 2019.' },
    { property: '2019-04', value: 'April 2019.' },
    { property: '2019-05', value: 'May 2019.' },
    { property: '2019-06', value: 'June 2019.' },
    { property: '2019-07', value: 'July 2019.' },
    { property: '2019-08', value: 'August 2019.' },
    { property: '2019-09', value: 'September 2019.' },
    { property: '2019-10', value: 'October 2019.' },
    { property: '2019-11', value: 'November 2019.' },
    { property: '2019-12', value: 'December 2019.' },
    { property: '2020-01', value: 'January 2020.' },
    { property: '2020-02', value: 'February 2020.' },
    { property: '2020-03', value: 'March 2020.' },
  ];
  const [property, setProperty] = useState('2019-07');
  const svgRef = useRef();
  const divRef = useRef();
  useEffect(() => {
    const svg = select(svgRef.current);
    const div = select(divRef.current);
    let sorted = orderBy(country_data, [property], ['desc']).slice(0, 15);
    let alphabetical = orderBy(sorted, ['Zemlje'], ['asc']);

    let margin = { top: 100, right: 0, bottom: 100, left: 0 },
      width = 750 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;
    let innerRadius = 90,
      outerRadius = Math.min(600, 450) / 2;
    let x = scaleBand()
      .range([0, 2 * Math.PI])
      .align(0)
      .domain(alphabetical.map((d) => d.Zemlje));
    let color = scaleOrdinal().domain([0, 15]).range(schemeSet2);
    const getMaximum = () => {
      if (property === '2019-06' || property === '2019-07' || property === '2019-08') return 800000;
      return 400000;
    };
    let y = scaleLinear().range([innerRadius, outerRadius]).domain([0, getMaximum()]);

    svg
      .select('.bars')
      .attr(
        'transform',
        'translate(' + (width / 2 + margin.left) + ',' + (height / 2 + margin.top) + ')',
      )
      .selectAll('path')
      .data(alphabetical)
      .join('path')
      .on('mousemove', (d) => {
        div
          .selectAll('.toolTip')
          .style('top', event.pageY - 25 + 'px')
          .style('left', event.pageX + 10 + 'px')
          .style('display', 'inline-block')
          .html(d[property].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
      })
      .on('mouseout', (d) => div.selectAll('.toolTip').style('display', 'none'))
      .transition()
      .duration(1000)
      .attr(
        'd',
        arc()
          .innerRadius(innerRadius)
          .outerRadius((d) => y(d[property]))
          .startAngle((d) => x(d.Zemlje))
          .endAngle((d) => x(d.Zemlje) + x.bandwidth())
          .padAngle(0.01)
          .padRadius(innerRadius),
      )
      .attr('fill', (d, i) => color(i));

    svg.select('.text').selectAll('text').remove();
    svg
      .select('.text')
      .attr(
        'transform',
        'translate(' + (width / 2 + margin.left) + ',' + (height / 2 + margin.top) + ')',
      )
      .selectAll('.text-wrapper')
      .data(alphabetical)
      .join('g')
      .attr('class', 'text-wrapper')
      .transition()
      .duration(1000)
      .attr('text-anchor', function (d) {
        return (x(d.Zemlje) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI
          ? 'end'
          : 'start';
      })
      .attr('transform', function (d) {
        return (
          'rotate(' +
          (((x(d.Zemlje) + x.bandwidth() / 2) * 180) / Math.PI - 90) +
          ')' +
          'translate(' +
          (y(d[property]) + 10) +
          ',0)'
        );
      });
    svg
      .selectAll('.text-wrapper')
      .append('text')
      .data(alphabetical)
      .on('mousemove', (d) => {
        div
          .selectAll('.toolTip')
          .style('top', event.pageY - 25 + 'px')
          .style('left', event.pageX + 10 + 'px')
          .style('display', 'inline-block')
          .html(d[property].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
      })
      .on('mouseout', (d) => div.selectAll('.toolTip').style('display', 'none'))
      .text((d) => d.Zemlje)
      .attr('transform', function (d) {
        return (x(d.Zemlje) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI
          ? 'rotate(180)'
          : 'rotate(0)';
      })
      .style('font-size', '12px')
      .attr('alignment-baseline', 'middle');

    svg.selectAll('.axis').selectAll('g').remove();

    svg
      .selectAll('.axis')
      .attr('text-anchor', 'middle')
      .attr(
        'transform',
        'translate(' + (width / 2 + margin.left) + ',' + (height / 2 + margin.top) + ')',
      )
      .call((g) =>
        g
          .selectAll('g')
          .data(y.ticks(5).slice(1))
          .join('g')
          .attr('fill', 'none')
          .call((g) =>
            g.append('circle').attr('stroke', '#000').attr('stroke-opacity', 0.2).attr('r', y),
          )
          .call((g) =>
            g
              .append('text')
              .attr('y', (d) => -y(d))
              .attr('dy', '-.5em')
              .text(y.tickFormat(3, 's'))
              .clone(true)
              .attr('fill', '#000')
              .attr('stroke', 'none'),
          ),
      );
    svg
      .select('.title')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${width / 2}, 35)`)
      .attr('font-size', '1.5em')
      .text('Number of tourists by country.');
  }, [property]);

  const handleOptionChange = (e) => {
    setProperty(e.target.value);
  };

  return (
    <div ref={divRef}>
      <svg ref={svgRef} height="600" width="750">
        <text className="title" />
        <g className="bars" />
        <g className="axis" />
        <g className="text" />
      </svg>
      <div className="toolTip" />
      <div className="select-wrapper">
        <select
          value={property}
          name="months-options"
          id="months-select"
          onChange={handleOptionChange}
        >
          {options.map((option) => (
            <option
              key={option.property}
              value={option.property}
              id={option.property}
              defaultValue={property}
            >
              {option.value}
            </option>
          ))}
        </select>
        <span>></span>
      </div>
    </div>
  );
}

export default CircularBarChart;
