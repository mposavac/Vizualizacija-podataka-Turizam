import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import TextTransition, { presets } from 'react-text-transition';
import Slider from 'rc-slider';
import world_img from '../assets/world.png';
import croatia_img from '../assets/croatia.png';
import 'rc-slider/assets/index.css';

//Funkcija za prikaz kontrola za geoChart i promjenu podataka na hrvatsku ili svijet
function Controls({
  dataIndicator,
  year,
  yearsRange,
  handleBtnClick,
  handleYearChange,
  isPlayed,
  play,
  countrySelected,
}) {
  //Putanja za play i pause button
  const playPoints = {
    play: ['0 100, 0 0, 50 25, 50 75', '49 25, 100 50, 100 50, 49 75'],
    pause: ['0 100, 0 0, 35 0, 35 100', '65 0, 100 0, 100 100, 65 100'],
  };

  //Ova se funkcija poziva nakon promjene isPLayed argumenta te animira polygon svga
  useEffect(() => {
    document
      .querySelector('.controls')
      .querySelectorAll('animate')
      .forEach((element) => element.beginElement());
  }, [isPlayed]);

  return (
    <div
      className="controls"
      style={
        countrySelected
          ? { opacity: '0', pointerEvents: 'none' }
          : { opacity: '1', pointerEvents: 'auto' }
      }
    >
      <div className="btns">
        <button
          className="btn-world"
          id="btn"
          onClick={handleBtnClick}
          disabled={dataIndicator === 'world'}
        >
          <div style={dataIndicator === 'world' ? { maringLeft: '0' } : { maringLeft: '-100%' }}>
            <img src={world_img} alt="World_img" />
          </div>
          <span>World</span>
        </button>
        <button
          className="btn-croatia"
          id="btn"
          onClick={handleBtnClick}
          disabled={dataIndicator === 'croatia'}
        >
          <div>
            <img src={croatia_img} alt="Croatia_icon" />
          </div>
          <span>Croatia</span>
        </button>
      </div>
      <div className="year-range-container">
        <svg className="play-btn" viewBox="0 0 100 100" width="18" height="18" onClick={play}>
          <polygon id="play1" points="">
            <animate
              xlinkHref="#play1"
              attributeName="points"
              dur="0.25s"
              fill="freeze"
              from={isPlayed ? playPoints.play[0] : playPoints.pause[0]}
              to={isPlayed ? playPoints.pause[0] : playPoints.play[0]}
            ></animate>
          </polygon>
          <polygon id="play2" points="">
            <animate
              xlinkHref="#play2"
              attributeName="points"
              dur="0.25s"
              fill="freeze"
              from={isPlayed ? playPoints.play[1] : playPoints.pause[1]}
              to={isPlayed ? playPoints.pause[1] : playPoints.play[1]}
            ></animate>
          </polygon>
        </svg>
        <Slider
          id="year"
          min={dataIndicator === 'world' ? yearsRange.world.min : yearsRange.croatia.min}
          max={dataIndicator === 'world' ? yearsRange.world.max : yearsRange.croatia.max}
          value={year}
          defaultValue={dataIndicator === 'world' ? yearsRange.world.min : yearsRange.croatia.min}
          onChange={handleYearChange}
          step="1"
        />
        <TextTransition text={year} springConifg={presets.wobbly} className="year-label" />
      </div>
    </div>
  );
}

//Redux funkcije za čitanje iz spremnika
const mapStateToProps = (state) => ({
  countrySelected: state.countrySelected,
});

export default connect(mapStateToProps)(Controls);
