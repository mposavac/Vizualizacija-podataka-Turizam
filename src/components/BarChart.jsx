import React, { useState, useEffect } from 'react';
import { select, axisBottom, axisLeft, scaleLinear, format } from 'd3';
import age_data from '../data/age.croatia.json';

function BarChart({ property }) {
  useEffect(() => {}, [property]);

  return (
    <div>
      <svg></svg>
    </div>
  );
}

export default BarChart;
