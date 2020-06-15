import React, { useRef, useEffect, useState } from 'react';
import { select, geoPath, geoMercator, min, max, scaleLinear, event, zoom, zoomIdentity } from 'd3';
import { connect } from 'react-redux';
import useResize from '../utils/useResize';

function GeoChart({ geoData, data, property, dataIndicator, countrySelected, changeCountry }) {
  const svgRef = useRef();
  const refWrapper = useRef();
  const dimensions = useResize(refWrapper);
  const svg = select(svgRef.current);
  const div = select(refWrapper.current);
  const [minProp, setMinProp] = useState();
  const [maxProp, setMaxProp] = useState();

  //Ova funkcija se poziva nakon svake promjene data indikatora (svijet ili hrvatska)
  useEffect(() => {
    changeCountry(null);
    //eslint-disable-next-line
  }, [dataIndicator]);

  //Ova funkcija se poziva nakon svake promjene godine i podataka (svijet ili hrvatska)
  useEffect(() => {
    //Pronalazak minimalnog i maksimalnog broja dolazaka za određenu godinu
    const min_prop = min(data, (feature) => (feature[property] !== '' ? feature[property] : null));
    const max_prop = max(data, (feature) => feature[property]);

    setMinProp(min_prop);
    setMaxProp(max_prop);
  }, [data, property]);

  //Ova funkcija se poziva nakon svake promjene podataka, godine i promjene velicine ekrana
  useEffect(() => {
    if (countrySelected && dataIndicator === 'world') {
      const code = countrySelected.properties.adm0_a3.toLowerCase();

      //Promjena pozadinske slike u zastavu odabrane zemlje
      svg
        .select('.image_background')
        .attr('xlink:href', `https://restcountries.eu/data/${code}.svg`);
    }

    //Zoom funkcija koja omogućava zoom i pan po karti
    let zoomSvg = zoom()
      .scaleExtent([1, 8])
      .on('zoom', () => {
        svg.select('g').selectAll('path').attr('transform', event.transform);
      });
    svg.call(zoomSvg.transform, zoomIdentity);

    const colorScale = scaleLinear().domain([minProp, maxProp]).range(['#F2FEEC', '#43B929']);

    const { width, height } = dimensions || refWrapper.current.getBoundingClientRect();

    //Mapiranje geoJson podataka
    const projection = geoMercator()
      .fitSize([width, height], countrySelected || geoData)
      .precision(100);
    const pathGenerator = geoPath().projection(projection);

    //Funkcija se poziva nakon clicka i postavlja zemlju koja se nakon toga zoomira
    const mouseClick = function (feature) {
      changeCountry(countrySelected === feature ? null : feature);
    };

    svg
      .select('g')
      .selectAll('.country')
      .data(geoData.features)
      .join('path')
      .on('mousemove', (d) => {
        //Na pomicanje miša div elementu toolTip se postvalja text sa podacima o zemlji preko koje se prelazi
        div
          .selectAll('.toolTip')
          .style('top', event.pageY - 25 + 'px')
          .style('left', event.pageX + 10 + 'px')
          .style('display', 'inline-block')
          .html(
            `${d.properties.name}<br>${
              d.properties.tourism.length > 0 && d.properties.tourism[0][property]
                ? d.properties.tourism[0][property].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : 0
            }`,
          );
      })
      .on('mouseout', (d) => div.selectAll('.toolTip').style('display', 'none'))
      .on('click', mouseClick)
      .attr('class', 'country')
      .transition()
      //Crtanje karte
      .attr('d', (feature) => pathGenerator(feature))
      .attr('fill', (feature) => {
        //Funkcija za bojanje zemalja
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
      });

    svg.call(zoomSvg);

    //eslint-disable-next-line
  }, [dataIndicator, property, dimensions, countrySelected]);

  return (
    <div className="svg-wrapper" ref={refWrapper}>
      <svg
        ref={svgRef}
        style={countrySelected ? { pointerEvents: 'none' } : { pointerEvents: 'auto' }}
      >
        <defs>
          <pattern
            id="country_background"
            patternUnits="userSpaceOnUse"
            width="100%"
            height="100vh"
          >
            <image className="image_background" x="0" y="0" width="100%" height="100vh" />
          </pattern>
        </defs>
        <g></g>
      </svg>
      <div className="toolTip" />
    </div>
  );
}

//Redux funkcije za čitanje iz spremnika i pisanje podataka
const mapStateToProps = (state) => ({
  countrySelected: state.countrySelected,
});

const mapStateToDispatch = (dispatch) => ({
  changeCountry: (countrySelected) => dispatch({ type: 'CHANGE_COUNTRY', data: countrySelected }),
});

export default connect(mapStateToProps, mapStateToDispatch)(GeoChart);
