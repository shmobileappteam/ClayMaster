import * as React from "react"
import Svg, { Path } from "react-native-svg"
import Sizer from "../../helpers/Sizer"

function UndoSvg(props) {
  return (
    <Svg
      width={props.width || Sizer.hSize(25)}
      height={props.height || Sizer.hSize(11)}
      viewBox="0 0 25 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M12.824 1.222c-3.237 0-6.168 1.21-8.427 3.178L0 0v11h10.992L6.57 6.576c1.697-1.418 3.859-2.298 6.253-2.298 4.323 0 8 2.823 9.281 6.722L25 10.047c-1.698-5.121-6.497-8.825-12.176-8.825z"
        fill="#fff"
      />
    </Svg>
  )
}

export default UndoSvg
