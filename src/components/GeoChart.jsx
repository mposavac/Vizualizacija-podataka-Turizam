import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator, min, max, scaleLinear } from "d3";
import useResize from "../utils/useResize";

function GeoChart({ data, property, changeGeoData }) {
  const svgRef = useRef();
  const refWrapper = useRef();
  const dimensions = useResize(refWrapper);
  const [countrySelected, setConutrySelected] = useState(null);

  useEffect(() => {
    const svg = select(svgRef.current);

    const minProp = min(
      data.features,
      (feature) => feature.properties[property]
    );
    const maxProp = max(
      data.features,
      (feature) => feature.properties[property]
    );
    const colorScale = scaleLinear()
      .domain([minProp, maxProp])
      .range(["lightgray", "green"]);

    const { width, height } =
      dimensions || refWrapper.current.getBoundingClientRect();
    const projection = geoMercator()
      .fitSize([width, height], countrySelected || data)
      .precision(100);

    const pathGenerator = geoPath().projection(projection);

    svg
      .selectAll(".country")
      .data(data.features)
      .join("path")
      .on("click", (feature) => {
        if (feature.properties["sovereignt"] === "Croatia") changeGeoData();
        else setConutrySelected(countrySelected === feature ? null : feature);
      })
      .attr("class", "country")
      .transition()
      .attr("fill", (feature) => colorScale(feature.properties[property]))
      .attr("d", (feature) => pathGenerator(feature));
  }, [data, property, dimensions, countrySelected, changeGeoData]);
  return (
    <div className="svg-wrapper" ref={refWrapper}>
      <svg ref={svgRef} />
    </div>
  );
}

export default GeoChart;
