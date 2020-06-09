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
    const colorScale = scaleLinear().domain([minProp, maxProp]).range(['#F2FEEC', '#43B929']);

    const { width, height } = dimensions || refWrapper.current.getBoundingClientRect();
    const projection = geoMercator()
      .fitSize([width, height], countrySelected || geoData)
      .precision(100);

    const pathGenerator = geoPath().projection(projection);

    const mouseClick = function (feature) {
      changeCountry(countrySelected === feature ? null : feature);
    };

    if (countrySelected && dataIndicator === 'world') {
      const code = countrySelected.properties.adm0_a3.toLowerCase();
      svg
        .select('.image_background')
        .attr('xlink:href', `https://restcountries.eu/data/${code}.svg`);
    }

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
      .attr('fill', (feature) => {
        if (countrySelected) {
          if (dataIndicator === 'world' && feature === countrySelected)
            return 'url(#country_background)';
          else if (dataIndicator === 'croatia' && feature === countrySelected) return '#ef3e36';
          else return '#EFEFEF';
        } else {
          return colorScale(
            feature.properties.tourism.length > 0 ? feature.properties.tourism[0][property] : 0,
          );
        }
      })
      .attr('d', (feature) => pathGenerator(feature));
  }, [geoData, data, property, dimensions, countrySelected]);

  return (
    <React.Fragment>
      <div className="svg-wrapper" ref={refWrapper}>
        <svg ref={svgRef}>
          <defs>
            <pattern
              id="country_background"
              patternUnits="userSpaceOnUse"
              width="100%"
              height="100vh"
            >
              <image className="image_background" x="0" y="00" width="100%" height="100vh" />
            </pattern>
          </defs>
        </svg>
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
