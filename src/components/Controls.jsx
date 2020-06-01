import React, { useEffect } from 'react';
import TextTransition, { presets } from 'react-text-transition';

function Controls({
  dataIndicator,
  year,
  yearsRange,
  handleBtnClick,
  handleYearChange,
  isPlayed,
  play,
}) {
  const playPoints = {
    play: ['0 100, 0 0, 50 25, 50 75', '49 25, 100 50, 100 50, 49 75'],
    pause: ['0 100, 0 0, 35 0, 35 100', '65 0, 100 0, 100 100, 65 100'],
  };

  useEffect(() => {
    document
      .querySelector('.controls')
      .querySelectorAll('animate')
      .forEach((element) => element.beginElement());
  }, [isPlayed]);
  return (
    <div className="controls">
      <button className="btn-world" onClick={handleBtnClick}>
        World
      </button>
      <button className="btn-croatia" onClick={handleBtnClick}>
        Croatia
      </button>
      <br />
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
        <input
          type="range"
          id="year"
          min={dataIndicator === 'world' ? yearsRange.world.min : yearsRange.croatia.min}
          max={dataIndicator === 'world' ? yearsRange.world.max : yearsRange.croatia.max}
          value={year}
          onChange={handleYearChange}
          step="1"
        />
        <TextTransition text={year} springConifg={presets.wobbly} className="year-label" />
      </div>
    </div>
  );
}

export default Controls;
