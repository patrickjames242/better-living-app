import React from 'react';
import { Color } from '../../../helpers/colors';

function BellIconSVG(props: { color: Color; style?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="512"
      height="512"
      viewBox="0 0 16 16"
      fill={props.color.stringValue}
      style={props.style}
    >
      <path d="M15 10c0-3.526-2.609-6.434-6-6.92V3a1 1 0 00-2 0v.08C3.609 3.566 1 6.474 1 10v1h14zM9 4.5c-3.14 0-5.72 2.425-5.975 5.5H2c0-3.309 2.691-6 6-6 1.16 0 2.24.336 3.158.908A5.959 5.959 0 009 4.5zM15 12H1a1 1 0 00-1 1v1h16v-1a1 1 0 00-1-1z"></path>
    </svg>
  );
}

export default BellIconSVG;
