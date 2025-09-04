import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
//----
import Sizer from '../../helpers/Sizer';

function BellSvg(props) {
  return (
    <Svg
 
      width={props.width || Sizer.hSize(19)}
      height={props.height || Sizer.hSize(25)}
      viewBox="0 0 19 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        clipRule="evenodd"
        d="M9.612 1C4.439 1 2.19 5.684 2.19 8.781c0 2.315.335 1.633-.946 4.457-1.564 4.023 4.727 5.668 8.367 5.668 3.639 0 9.93-1.645 8.367-5.668-1.281-2.824-.946-2.142-.946-4.457C17.033 5.684 14.784 1 9.612 1z"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.307 21.998c-1.51 1.686-3.866 1.706-5.39 0"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default BellSvg;
