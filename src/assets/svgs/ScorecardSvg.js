import * as React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

function ScorecardSvg(props) {
  return (
    <Svg
      width={46}
      height={46}
      viewBox="0 0 46 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect width={46} height={46} rx={5} fill="#EB6C0F" />
      <Path
        d="M29.21 10.35v2.108h4.14V35.65h-20.7V12.458h4.14V10.35h12.42zM14.72 33.542h16.56V14.567h-2.07v2.108H16.79v-2.108h-2.07v18.975zm8.798-9.488v2.109h-5.693v-2.109h5.693zm4.657-4.744v2.109h-10.35V19.31h10.35zm-9.315-4.743h8.28v-2.109h-8.28v2.109z"
        fill="#fff"
      />
    </Svg>
  );
}

export default ScorecardSvg;
