import React, { useState, useEffect, useRef } from 'react';
import { scaleBand, arc, select, scaleLinear, event } from 'd3';
import country_data from '../data/bycountry.croatia.json';
import { orderBy } from 'lodash';

function CircularBarChart() {
  const options = [
    { property: '2019-01', value: 'Siječanj 2019.' },
    { property: '2019-02', value: 'Veljača 2019.' },
    { property: '2019-03', value: 'Ožujak 2019.' },
    { property: '2019-04', value: 'Travanj 2019.' },
    { property: '2019-05', value: 'Svibanj 2019.' },
    { property: '2019-06', value: 'Lipanj 2019.' },
    { property: '2019-07', value: 'Srpanj 2019.' },
    { property: '2019-08', value: 'Kolovoz 2019.' },
    { property: '2019-09', value: 'Rujan 2019.' },
    { property: '2019-10', value: 'Listopad 2019.' },
    { property: '2019-11', value: 'Studeni 2019.' },
    { property: '2019-12', value: 'Prosinac 2019.' },
    { property: '2020-01', value: 'Siječanj 2020.' },
    { property: '2020-02', value: 'Veljača 2020.' },
    { property: '2020-03', value: 'Ožujak 2020.' },
  ];
  const [property, setProperty] = useState('2019-07');
  const svgRef = useRef();
  const divRef = useRef();
  useEffect(() => {
    const svg = select(svgRef.current);
    const div = select(divRef.current);
    let sorted = orderBy(country_data, [property], ['desc']).slice(0, 15);
    let alphabetical = orderBy(sorted, ['Zemlje'], ['asc']);
    console.log(alphabetical);
    let margin = { top: 100, right: 0, bottom: 0, left: 0 },
      width = 460 - margin.left - margin.right,
      height = 460 - margin.top - margin.bottom;
    let innerRadius = 90,
      outerRadius = Math.min(460, 360) / 2;
    let x = scaleBand()
      .range([0, 2 * Math.PI])
      .align(0)
      .domain(alphabetical.map((d) => d.Zemlje));
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
      .attr('fill', '#69b3a2')
      .attr(
        'd',
        arc()
          .innerRadius(innerRadius)
          .outerRadius((d) => y(d[property]))
          .startAngle((d) => x(d.Zemlje))
          .endAngle((d) => x(d.Zemlje) + x.bandwidth())
          .padAngle(0.01)
          .padRadius(innerRadius),
      );

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
              //.attr('stroke', '#fff')
              //.attr('stroke-width', 2)
              .text(y.tickFormat(3, 's'))
              .clone(true)
              .attr('fill', '#000')
              .attr('stroke', 'none'),
          ),
      );
  }, [property]);

  const handleOptionChange = (e) => {
    setProperty(e.target.value);
  };

  return (
    <div ref={divRef}>
      <svg ref={svgRef} height="500" width="750">
        <g className="bars"></g>
        <g className="axis"></g>
        <g className="text"></g>
      </svg>
      <div className="toolTip" />
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
    </div>
  );
}

export default CircularBarChart;
