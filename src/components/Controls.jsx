import React from 'react';

function Controls({
  dataIndicator,
  year,
  yearsRange,
  handleBtnClick,
  handleYearChange,
  isPlayed,
  play,
}) {
  console.log(year);
  return (
    <div>
      <button className="btn-world" onClick={handleBtnClick}>
        World
      </button>
      <button className="btn-croatia" onClick={handleBtnClick}>
        Croatia
      </button>
      <br />
      <i className={isPlayed ? 'fas fa-pause' : 'fas fa-play'} onClick={play} />
      <input
        type="range"
        id="year"
        min={dataIndicator === 'world' ? yearsRange.world.min : yearsRange.croatia.min}
        max={dataIndicator === 'world' ? yearsRange.world.max : yearsRange.croatia.max}
        value={year}
        onChange={handleYearChange}
        step="1"
      />
      <label htmlFor="year">{year}</label>
    </div>
  );
}

export default Controls;
