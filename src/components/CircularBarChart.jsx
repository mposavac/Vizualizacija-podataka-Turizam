import React, { useState, useEffect, useRef } from 'react';
import { scaleBand, arc, select, scaleLinear, scale, scaleOrdinal } from 'd3';
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
  const [property, setProperty] = useState('2019-01');
  const svgRef = useRef();
  useEffect(() => {
    const svg = select(svgRef.current);
    let sorted = orderBy(country_data, [property], ['desc']).slice(0, 15);
    let alphabetical = orderBy(sorted, ['Zemlje'], ['asc']);
    console.log(alphabetical);
    // ZEMLJA, PROPERTY
    var margin = { top: 100, right: 0, bottom: 0, left: 0 },
      width = 460 - margin.left - margin.right,
      height = 460 - margin.top - margin.bottom;
    let innerRadius = 90,
      outerRadius = Math.min(460, 360) / 2;
    let x = scaleBand()
      .range([0, 2 * Math.PI])
      .align(0)
      .domain(alphabetical.map((d) => d.Zemlje));
    let y = scaleLinear().range([innerRadius, outerRadius]).domain([0, 400000]);
    svg
      .select('.bars')
      .attr(
        'transform',
        'translate(' + (width / 2 + margin.left) + ',' + (height / 2 + margin.top) + ')',
      )
      .selectAll('path')
      .data(alphabetical)
      .join('path')
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

    svg.selectAll('text').remove();
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
      .text((d) => d.Zemlje)
      .attr('transform', function (d) {
        return (x(d.Zemlje) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI
          ? 'rotate(180)'
          : 'rotate(0)';
      })
      .style('font-size', '11px')
      .attr('alignment-baseline', 'middle');
  }, [property]);

  const handleOptionChange = (e) => {
    console.log(e.target.value);
    setProperty(e.target.value);
    console.log(e.target.id);
  };

  return (
    <div>
      <svg ref={svgRef} height="500" width="750">
        <g className="bars"></g>
        <g className="text"></g>
      </svg>
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
