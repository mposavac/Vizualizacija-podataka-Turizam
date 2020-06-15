import React, { useState, useEffect, useRef } from 'react';
import { pie, arc, select, event, scaleOrdinal, schemePastel1, entries } from 'd3';
import age_data from '../data/age.croatia.json';

function PieChart() {
  //Opcije za prikaz u dropdown izborniku
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
  const [property, setProperty] = useState('2019-05');
  const svgRef = useRef();
  const divRef = useRef();
  useEffect(() => {
    const svg = select(svgRef.current);
    const div = select(divRef.current);
    let width = 750,
      height = 500,
      margin = 40;

    //Radius dijagrama u ovisnosti o visini i širini
    let radius = Math.min(width, height) / 2 - margin;
    //Izvdajanje podataka za određen mjesec
    let data = age_data.filter((date) => date.datum === property)[0].data;

    //Suma broja turista
    const sums = Object.values(data).reduce((a, b) => a + b);
    //Kreiranje skale za boje kojoj je domena svaka dobna grupa
    let color = scaleOrdinal()
      .domain(['<14', '15-24', '25-34', '35-44', '45-54', '55-64', '>65'])
      .range(schemePastel1);

    // Funkcija za kreiranje generatora prstenastog grafa koji se ne sortira
    // kako bi se uvijek dobili podaci onako kao su i zadani
    let pie_chart = pie()
      .sort(null)
      .value((d) => d.value);

    //Funkcija za kreiranje prstenastog grafa od danih podataka
    let data_ready = pie_chart(entries(data));
    // Funkcija za crtanje kružnice sa zadanim vanjskim i unutarnjim radiusom
    let innerArc = arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.8);

    //Crtanje prstenastog grafa
    svg
      .select('.pie-chart-wrapper')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
      .selectAll('path')
      .data(data_ready)
      .join('path')
      .on('mousemove', (d) => {
        //Na pomicanje miša div elementu toolTip se postvalja text sa podacima o vrijednosti i udio u grafu
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

    //Ispisivanje vrijednosti na graf
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
    //Naziv grafa
    svg
      .select('.title')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${width / 2}, 35)`)
      .attr('font-size', '1.5em')
      .text('Number of tourists by age.');
  }, [property]);

  //Funkcija za promjenu mjeseca za prikaz podataka
  const handleOptionChange = (e) => {
    setProperty(e.target.value);
  };

  return (
    <div ref={divRef}>
      <svg ref={svgRef} height="500" width="750">
        <text className="title" />
        <g className="pie-chart-wrapper" />
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

export default PieChart;
