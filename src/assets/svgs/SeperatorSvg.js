import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"

function SeperatorSvg(props) {
  return (
    <Svg
      width={287}
      height={2}
      viewBox="0 0 287 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path fill="url(#paint0_linear_434_530)" d="M0 0H287V2H0z" />
      <Defs>
        <LinearGradient
          id="paint0_linear_434_530"
          x1={0}
          y1={1}
          x2={287}
          y2={1}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#471D00" />
          <Stop offset={0.514423} stopColor="#773C12" />
          <Stop offset={1} stopColor="#471D00" />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}

export default SeperatorSvg
