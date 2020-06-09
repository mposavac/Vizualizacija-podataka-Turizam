import React, { useRef, useEffect, useState } from 'react';
import { select, geoPath, geoMercator, min, max, scaleLinear, event } from 'd3';
import { connect } from 'react-redux';
import useResize from '../utils/useResize';

function GeoChart({ geoData, data, property, dataIndicator, countrySelected, changeCountry }) {
  const svgRef = useRef();
  const refWrapper = useRef();
  const dimensions = useResize(refWrapper);
  const svg = select(svgRef.current);

  useEffect(() => {
    changeCountry(null);
  }, [dataIndicator]);
  useEffect(() => {
    const div = select(refWrapper.current);
    const minProp = min(data, (feature) => (feature[property] !== '' ? feature[property] : null));
    const maxProp = max(data, (feature) => feature[property]);
    const colorScale = scaleLinear().domain([minProp, maxProp]).range(['lightgray', 'green']);

    const { width, height } = dimensions || refWrapper.current.getBoundingClientRect();
    const projection = geoMercator()
      .fitSize([width, height], countrySelected || geoData)
      .precision(100);

    const pathGenerator = geoPath().projection(projection);

    const mouseClick = function (feature) {
      changeCountry(countrySelected === feature ? null : feature);
      //PROMJENITI BOJU OZNACENOG ELEMENTA
    };
    svg
      .selectAll('.country')
      .data(geoData.features)
      .join('path')
      .on('mousemove', (d) => {
        div
          .selectAll('.toolTip')
          .style('top', event.pageY - 25 + 'px')
          .style('left', event.pageX + 10 + 'px')
          .style('display', 'inline-block')
          .html(d.properties.name);
      })
      .on('mouseout', (d) => div.selectAll('.toolTip').style('display', 'none'))
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

  return (
    <React.Fragment>
      <div className="svg-wrapper" ref={refWrapper}>
        <svg ref={svgRef} />
        <div className="toolTip" />
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
