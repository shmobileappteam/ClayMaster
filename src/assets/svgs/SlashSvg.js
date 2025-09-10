import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
//---
import Sizer from '../../helpers/Sizer';

function SlashSvg(props) {
  return (
    <Svg
      width={props.width || Sizer.hSize(21)}
      height={props.height || Sizer.hSize(21)}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path d="M21 1.62L1.62 21 0 19.38 19.38 0 21 1.62z" fill="#fff" />
    </Svg>
  );
}

export default SlashSvg;
