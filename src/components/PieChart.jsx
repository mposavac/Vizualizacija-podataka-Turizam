import React, { useState, useEffect, useRef } from 'react';
import { pie, arc, select, event, scaleOrdinal, schemePastel1, entries } from 'd3';
import age_data from '../data/age.croatia.json';

function PieChart() {
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
  const [property, setProperty] = useState('2019-05');
  const svgRef = useRef();
  const divRef = useRef();
  useEffect(() => {
    const svg = select(svgRef.current);
    const div = select(divRef.current);
    let width = 450,
      height = 450,
      margin = 40;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    let radius = Math.min(width, height) / 2 - margin;
    let data = age_data.filter((date) => date.datum === property)[0].data;
    console.log(data);
    const sums = Object.values(data).reduce((a, b) => a + b);

    let color = scaleOrdinal()
      .domain(['<14', '15-24', '25-34', '35-44', '45-54', '55-64', '>65'])
      .range(schemePastel1);
    let pie_chart = pie()
      .sort(null)
      .value((d) => d.value);
    let data_ready = pie_chart(entries(data));
    let innerArc = arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.8);

    svg
      .select('.pie-chart-wrapper')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
      .selectAll('path')
      .data(data_ready)
      .join('path')
      .on('mousemove', (d) => {
        div
          .selectAll('.toolTip')
          .style('top', event.pageY - 25 + 'px')
          .style('left', event.pageX + 10 + 'px')
          .style('display', 'inline-block')
          .html(
            d.data.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
              '<br>' +
              Math.round((d.value / sums) * 100) +
              '%',
          );
      })
      .on('mouseout', (d) => div.selectAll('.toolTip').style('display', 'none'))
      .transition()
      .duration(500)
      .attr('d', innerArc)
      .attr('fill', (d) => color(d.data.key))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.7);

    svg
      .select('.pie-chart-wrapper')
      .selectAll('.pie-value-age')
      .data(data_ready)
      .join('text')
      .transition()
      .duration(500)
      .attr('class', 'pie-value-age')
      .text((d) => d.data.key)
      .attr('transform', (d) => 'translate(' + innerArc.centroid(d) + ')')
      .style('text-anchor', 'middle')
      .style('font-size', 17);

    //ADD LEGEND sa postocima
    /*
    svg
      .selectAll('.legend')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
      .selectAll('rect')
      .data(color.domain())
      .join('rect')
      .attr('width', 12)
      .attr('height', 12)
      .style('fill', color);
      */
  }, [property]);

  const handleOptionChange = (e) => {
    setProperty(e.target.value);
  };

  return (
    <div ref={divRef}>
      <svg ref={svgRef} height="500" width="750">
        <g className="pie-chart-wrapper"></g>
        <g className="legend"></g>
      </svg>
      <div className="toolTip"></div>
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

export default PieChart;
