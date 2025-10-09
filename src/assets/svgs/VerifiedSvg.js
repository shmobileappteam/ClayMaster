import * as React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import Sizer from '../../helpers/Sizer';
import { COLORS } from '../../globalStyle/Theme';

function VerifiedSvg(props) {
  return (
    <Svg
      width={Sizer.hSize(145)}
      height={Sizer.hSize(145)}
      viewBox="0 0 145 145"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M121.992 72.498a15.516 15.516 0 00-6.632-24.746 15.516 15.516 0 00-18.117-18.116 15.51 15.51 0 00-24.747-6.629 15.514 15.514 0 00-24.747 6.632 15.515 15.515 0 00-18.113 18.117 15.515 15.515 0 00-6.631 24.747 15.514 15.514 0 006.633 24.747 15.509 15.509 0 0018.116 18.113 15.512 15.512 0 0018.083 9.988 15.505 15.505 0 006.663-3.357 15.519 15.519 0 0014.125 3.217 15.522 15.522 0 0010.622-9.85 15.516 15.516 0 0018.116-18.116 15.515 15.515 0 006.629-24.747z"
        fill="#CD7828"
      />
      <Circle
        cx={72.5}
        cy={72.5}
        r={72.5}
        fill={COLORS.primary}
        fillOpacity={0.5}
      />
      <Circle cx={72.5} cy={72.5} r={57.5} fill={COLORS.primary} />
      <Path
        d="M59.28 101.139L36.359 78.283a4.631 4.631 0 010-6.552l2.785-2.782a4.652 4.652 0 016.567 0l16.663 16.614 39.242-41.606a4.651 4.651 0 016.563-.2l2.86 2.693a4.635 4.635 0 011.46 3.234 4.633 4.633 0 01-1.26 3.318l-45.28 48.034a4.662 4.662 0 01-3.316 1.463 4.644 4.644 0 01-3.361-1.36z"
        fill="#fff"
      />
    </Svg>
  );
}

export default VerifiedSvg;
