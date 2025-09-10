import * as React from "react"
import Svg, { Path } from "react-native-svg"
//---
import Sizer from "../../helpers/Sizer"

function CircleSvg(props) {
  return (
    <Svg
      width={props.width || Sizer.hSize(21)}
      height={props.height || Sizer.hSize(21)}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M18.53 10.5a8.03 8.03 0 10-8.03 8.03V21C4.701 21 0 16.299 0 10.5S4.701 0 10.5 0 21 4.701 21 10.5 16.299 21 10.5 21v-2.47a8.03 8.03 0 008.03-8.03z"
        fill="#fff"
      />
    </Svg>
  )
}

export default CircleSvg
