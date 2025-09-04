import { Dimensions } from 'react-native';
import Sizer from '../helpers/Sizer';

const BASEOPACITY = 0.5;

const IMAGEONLOADCOLOR = {
  backgroundColor: 'lightgrey',
};

const COLORS = {
  mainBg: '#FFEFE3',
  primary: '#EB6C0F',
  secondary: '#7C0000',

  //Orange Variants:
  orange100: '#EE7615',
  orange200: '#F9F9F9',

  //Black Variants:
  black100: '#000000',
  black200: '#3F3F3F',
  black300: '#181818',
  black400: '#434343',

  //Grey Variants:
  grey100: '#AFAFAF',
  grey200: '#797979',

  //White Variants:
  white100: '#FFFFFF',
  white200: '#F5F5F5',

  red: '#B90205',
  green: '#1b8567',
  yellow: '#E9C80D',
};

const FONTS = {
  //Font 01
  //Barlow
  barlowRegular400: 'Barlow-Regular',
  barlowMedium500: 'Barlow-Medium',
  barlowSemiBold600: 'Barlow-SemiBold',
  barlowBold700: 'Barlow-Bold',
  barlowBoldItalic700: 'Barlow-BoldItalic',
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
