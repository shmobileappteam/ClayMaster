import React, { memo } from 'react';
// import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { Fontisto } from '@react-native-vector-icons/fontisto';
// import { Foundation } from '@react-native-vector-icons/foundation';
import { Ionicons } from '@react-native-vector-icons/ionicons';
// import { MaterialCommunityIcons } from '@react-native-vector-icons/material-community-icons';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { Octicons } from '@react-native-vector-icons/octicons';
// import { Zocial } from '@react-native-vector-icons/zocial';
// import { Entypo } from '@react-native-vector-icons/entypo';
import { AntDesign } from '@react-native-vector-icons/ant-design';
import { Feather } from '@react-native-vector-icons/feather';
// import { SimpleLineIcons } from '@react-native-vector-icons/simple-line-icons';
import { FontAwesome5 } from '@react-native-vector-icons/fontawesome5';
// import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

const Icon = ({ name, iconFamily, size, color, style }) => {
  switch (iconFamily) {
    case 'Fontisto':
      return <Fontisto name={name} size={size} color={color} style={style} />;
    // case 'Foundation':
    //   return <Foundation name={name} size={size} color={color} style={style} />;
    case 'Ionicons':
      return <Ionicons name={name} size={size} color={color} style={style} />;
    // case 'MaterialCommunityIcons':
    //   return (
    //     <MaterialCommunityIcons
    //       name={name}
    //       size={size}
    //       color={color}
    //       style={style}
    //     />
    //   );
    case 'MaterialIcons':
      return (
        <MaterialIcons name={name} size={size} color={color} style={style} />
      );
    case 'Octicons':
      return <Octicons name={name} size={size} color={color} style={style} />;
    // case 'Zocial':
    //   return <Zocial name={name} size={size} color={color} style={style} />;
    // case 'Entypo':
    //   return <Entypo name={name} size={size} color={color} style={style} />;
    case 'AntDesign':
      return <AntDesign name={name} size={size} color={color} style={style} />;
    case 'Feather':
      return <Feather name={name} size={size} color={color} style={style} />;
    // case 'SimpleLineIcons':
    //   return <SimpleLineIcons name={name} size={size} color={color} style={style} />;
    case 'FontAwesome5':
      return (
        <FontAwesome5 name={name} size={size} color={color} style={style} ss />
      );
    // case 'FontAwesome6':
    //   return <FontAwesome6 name={name} size={size} color={color} style={style} />;

    default:
      return <Fontisto name={name} size={size} color={color} style={style} />;
    // return <FontAwesome name={name} size={size} color={color} style={style} />;
  }
};

export default memo(Icon);
