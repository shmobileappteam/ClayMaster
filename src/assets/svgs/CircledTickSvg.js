import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

import Sizer from '../../helpers/Sizer';

function CircledTickSvg(props) {
  return (
    <Svg
      width={props.width || Sizer.hSize(103)}
      height={props.height || Sizer.hSize(103)}
      viewBox="0 0 103 103"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M51.5 103a51.498 51.498 0 0036.416-87.916A51.5 51.5 0 1051.5 103zm-1.328-30.671l28.612-34.333-8.79-7.325L45.39 60.192 32.657 47.454l-8.091 8.092 17.166 17.166 4.43 4.43 4.01-4.813z"
        fill="#EB6C0F"
      />
    </Svg>
  );
}

export default CircledTickSvg;
