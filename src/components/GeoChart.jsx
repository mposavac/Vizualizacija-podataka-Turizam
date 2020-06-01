import React, { useRef, useEffect, useState } from 'react';
import { select, geoPath, geoMercator, min, max, scaleLinear, event } from 'd3';
import { connect } from 'react-redux';
import useResize from '../utils/useResize';

function GeoChart({ geoData, data, property, dataIndicator, countrySelected, changeCountry }) {
  const svgRef = useRef();
  const refWrapper = useRef();
  const dimensions = useResize(refWrapper);
  const [hoverText, setHoverText] = useState(null);

  const svg = select(svgRef.current);

  useEffect(() => {
    changeCountry(null);
  }, [dataIndicator]);
  useEffect(() => {
    const minProp = min(data, (feature) => (feature[property] !== '' ? feature[property] : null));
    const maxProp = max(data, (feature) => feature[property]);
    const colorScale = scaleLinear().domain([minProp, maxProp]).range(['lightgray', 'green']);

    const { width, height } = dimensions || refWrapper.current.getBoundingClientRect();
    const projection = geoMercator()
      .fitSize([width, height], countrySelected || geoData)
      .precision(100);

    const pathGenerator = geoPath().projection(projection);

    const mouseOver = function (feature) {
      setHoverText({
        name: feature.properties.name,
        x: event.x - 50,
        y: event.y + 20,
      });
      svg.selectAll('.country').transition().duration(250).style('opacity', 0.6);
      select(this).transition().duration(250).style('opacity', 1);
    };

    const mouseLeave = function () {
      setHoverText(null);
      svg.selectAll('.country').transition().duration(250).style('opacity', 1);
    };

    const mouseClick = function (feature) {
      changeCountry(countrySelected === feature ? null : feature);
      setHoverText(null);
      //PROMJENITI BOJU OZNACENOG ELEMENTA
    };
    svg
      .selectAll('.country')
      .data(geoData.features)
      .join('path')
      .on('mouseover', mouseOver)
      .on('mouseleave', mouseLeave)
      .on('click', mouseClick)
      .attr('class', 'country')
      .transition()
      .attr('fill', (feature) =>
        colorScale(
          feature.properties.tourism.length > 0 ? feature.properties.tourism[0][property] : 0,
        ),
      )
      .attr('d', (feature) => pathGenerator(feature));
  }, [geoData, data, property, dimensions, countrySelected]);

  useEffect(() => {
    svg
      .selectAll('.label-background')
      .data([hoverText])
      .join('rect')
      .attr('x', (feature) => feature && feature.x)
      .attr('y', (feature) => feature && feature.y)
      .attr('rx', '8')
      .attr('height', '25')
      .attr('width', dataIndicator === 'world' ? '125' : '175')
      .attr('fill-opacity', (feature) => (feature ? '1' : '0'))
      .attr('class', 'label-background');
    svg
      .selectAll('.text')
      .data([hoverText])
      .join('text')
      .attr('class', 'text')
      .attr('text-anchor', 'middle')
      .attr(
        'x',
        (feature) => feature && (dataIndicator === 'world' ? feature.x + 62.5 : feature.x + 87.5),
      )
      .attr('y', (feature) => feature && feature.y + 18)
      .text((feature) => feature && feature.name);
  }, [svg, hoverText, dataIndicator]);

  return (
    <React.Fragment>
      <div className="svg-wrapper" ref={refWrapper}>
        <svg ref={svgRef} />
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  countrySelected: state.countrySelected,
});

const mapStateToDispatch = (dispatch) => ({
  changeCountry: (countrySelected) => dispatch({ type: 'CHANGE_COUNTRY', data: countrySelected }),
});

export default connect(mapStateToProps, mapStateToDispatch)(GeoChart);
