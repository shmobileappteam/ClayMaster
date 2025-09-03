import { Dimensions } from 'react-native';
import Sizer from '../helpers/Sizer';

const BASEOPACITY = 0.5;

const IMAGEONLOADCOLOR = {
  backgroundColor: 'lightgrey',
};

const COLORS = {
  mainBg: '#FFFFFF',
  primary: '#FF0000',
  secondary: '#7C0000',

  //Red Variants:
  red100: '#FCECEC',
  red200: '#FFD9D9',
  red300: '#FFEFEF',
  red400: '#FEDEDE',
  red500: '#9A0101',
  red600: '#FFE0E0',
  red700: '#FFB6B6',
  red800: '#FFE5E5',
  red900: '#3C0E0E',

  //Black Variants:
  black100: '#161616',
  black200: '#060B15',
  black300: '#494C58',
  black400: '#12141A',
  black500: '#101520',
  black600: '#000000',

  //Grey Variants:
  grey100: '#9E9E9E',
  grey200: '#7B7B8D',
  grey300: '#E1E1E1',
  grey400: '#EEEEEE',
  grey500: '#404040',
  grey600: '#B7B7B7',
  grey700: '#F0F0F0',
  grey800: '#7D7D7D',

  //White Variants:
  white100: '#FFFFFF',
  white200: '#F5F5F5',

  red: '#B90205',
  green: '#1b8567',
  yellow: '#E9C80D',
};

const FONTS = {
  //Font 01
  //Poppins
  poppinsRegular400: 'Poppins-Regular',
  poppinsMedium500: 'Poppins-Medium',
  poppinsSemiBold600: 'Poppins-SemiBold',
  poppinsBold700: 'Poppins-Bold',

  //Font 02
  // SF PRO Dispaly:
  sfprodisplayMedium500: 'SFPRODISPLAYMEDIUM',
};

const WINDOW = {
  height: Dimensions.get('window').height,
  width: Dimensions.get('window').width,
  fixPadding: 24,
};

const GLOBALSTYLE = {
  wrap: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  paddingHor: {
    paddingHorizontal: Sizer.hSize(24),
  },
  marginHor: {
    marginHorizontal: Sizer.hSize(24),
  },
  checkBoxWrapper: {
    width: Sizer.hSize(24),
    height: Sizer.hSize(24),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Sizer.hSize(10),
    overflow: 'hidden',
  },
  listBottomPadding: {
    paddingBottom: Sizer.vSize(100),
  },
  topListBottomMargin: {
    marginBottom: Sizer.vSize(194),
  },
  itemSeparatorVertically: {
    height: Sizer.vSize(16),
  },
  itemSeparatorHorizontally: {
    height: Sizer.vSize(10),
  },
  bgWithOpacity: (opacity = 0.3) => `rgba(0, 0, 0, ${opacity})`,
  dynamicAvatar: { uri: 'https://i.pravatar.cc/100' },
};

export { COLORS, WINDOW, FONTS, GLOBALSTYLE, BASEOPACITY, IMAGEONLOADCOLOR };
