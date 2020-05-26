import React, { useRef, useEffect, useState } from 'react';
import { select, geoPath, geoMercator, min, max, scaleLinear } from 'd3';
import useResize from '../utils/useResize';

function GeoChart({ geoData, data, property }) {
  const svgRef = useRef();
  const refWrapper = useRef();
  const dimensions = useResize(refWrapper);
  const [countrySelected, setConutrySelected] = useState(null);

  useEffect(() => {
    const svg = select(svgRef.current);
    const minProp = min(data, (feature) => (feature[property] !== '' ? feature[property] : null));
    const maxProp = max(data, (feature) => feature[property]);
    const colorScale = scaleLinear().domain([minProp, maxProp]).range(['lightgray', 'green']);

    const { width, height } = dimensions || refWrapper.current.getBoundingClientRect();
    const projection = geoMercator()
      .fitSize([width, height], countrySelected || geoData)
      .precision(100);

    const pathGenerator = geoPath().projection(projection);

    svg
      .selectAll('.country')
      .data(geoData.features)
      .join('path')
      .on('click', (feature) => {
        setConutrySelected(countrySelected === feature ? null : feature);
      })
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
    <div className="svg-wrapper" ref={refWrapper}>
      <svg ref={svgRef} />
    </div>
  );
}

export default GeoChart;
