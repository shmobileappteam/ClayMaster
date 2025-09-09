import * as React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

function TargetPartSvg(props) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect width={19.6884} height={19.0476} rx={9.52381} fill="#EB6C0F" />
      <Path
        d="M8.86 13.333l-.793.527a.952.952 0 001.613-.042l-.82-.485zm-1.176-3.49a.952.952 0 10-1.586 1.054l.793-.527.793-.527zm5.934-2.692a.952.952 0 10-1.64-.969l.82.485.82.484zM8.86 13.333l.793-.527-1.969-2.963-.793.527-.793.527 1.969 2.963.793-.527zm3.938-6.666l-.82-.485L8.04 12.85l.82.484.82.485 3.938-6.667-.82-.484z"
        fill="#fff"
      />
    </Svg>
  );
}

export default TargetPartSvg;
