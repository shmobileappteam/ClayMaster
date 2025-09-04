import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
//---
import Sizer from '../../helpers/Sizer';

function HamburgerSvg(props) {
  return (
    <Svg
      width={props.width || Sizer.hSize(24)}
      height={props.height || Sizer.hSize(23)}
      viewBox="0 0 24 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M22.839 20c.641 0 1.161.672 1.161 1.5s-.52 1.5-1.161 1.5H1.16C.52 23 0 22.328 0 21.5S.52 20 1.161 20H22.84zm0-10c.641 0 1.161.672 1.161 1.5s-.52 1.5-1.161 1.5H1.16C.52 13 0 12.328 0 11.5S.52 10 1.161 10H22.84zm0-10C23.48 0 24 .672 24 1.5S23.48 3 22.839 3H1.16C.52 3 0 2.328 0 1.5S.52 0 1.161 0H22.84z"
        fill="#434343"
      />
    </Svg>
  );
}

export default HamburgerSvg;
