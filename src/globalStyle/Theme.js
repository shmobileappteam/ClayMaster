import { Dimensions, StyleSheet } from 'react-native';
import Sizer from '../helpers/Sizer';

const BASEOPACITY = 0.5;

const IMAGEONLOADCOLOR = {
  backgroundColor: 'lightgrey',
};

const COLORS = {
  /** App canvas — web peach background */
  mainBg: '#FFF5EB',
  /** Slightly elevated surface for cards / sections */
  surface: '#FFFFFF',
  surfaceMuted: '#FFEFE3',
  borderMuted: '#E5E5E5',
  borderSubtle: '#E5E5E5',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textMuted: '#6B6B6B',
  primary: '#EB6C0F',
  primaryLight: '#FFEFE3',
  secondary: '#1A2332',
  /** On-the-Course dark theme */
  courseBg: '#0D0D0D',
  courseSurface: '#1A1A1A',
  courseBorder: '#2A2A2A',
  courseTextMuted: '#888888',
  destructive: '#DC2626',

  //Orange Variants:
  orange100: '#EE7615',
  orange200: '#F9F9F9',
  orange300: 'rgba(235, 108, 15, 0.1)',
  orange400: 'rgba(0, 0, 0, 0.5)',
  orange500: '#FFCA28',

  //Black Variants:
  black100: '#000000',
  black200: '#3F3F3F',
  black300: '#181818',
  black400: '#434343',
  black500: '#767676',
  black600: '#525252',

  //Grey Variants:
  grey100: '#AFAFAF',
  grey200: '#797979',
  grey300: '#464646',
  grey400: 'rgba(113, 113, 113, 0.1)',
  grey500: '#8C8C8C',
  grey600: '#E6E6E6',
  grey700: '#EBEBEB',
  grey800: 'rgba(71, 71, 71, 0.1)',
  grey900: '#929292',

  //White Variants:
  white100: '#FFFFFF',
  white200: '#F5F5F5',

  //Red Variants:
  red100: 'rgba(235, 15, 15, 0.1)',
  red200: '#EB0F0F',
  red300: '#930D0D',

  //Extras
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

/** Spacing — web tailwind `spacing` + 8pt scale (logical px before Sizer) */
const SPACING = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  /** Web `screen-px` */
  screenPx: 16,
  /** Web `section` */
  section: 24,
  /** Web `component` */
  component: 12,
  /** Web `card-p` */
  cardP: 16,
};

const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
  /** Web `--radius` 0.75rem */
  web: 12,
};

/** Type scale — ClayMaster-App-UI `tailwind.config.ts` fontSize */
const TYPE = {
  h1: { size: 24, lineHeight: 31, fFamily: 'barlowBold700' },
  h2: { size: 20, lineHeight: 26, fFamily: 'barlowSemiBold600' },
  h3: { size: 18, lineHeight: 25, fFamily: 'barlowMedium500' },
  body: { size: 14, lineHeight: 21, fFamily: 'barlowRegular400' },
  bodySm: { size: 14, lineHeight: 21, fFamily: 'barlowRegular400' },
  caption: { size: 12, lineHeight: 17, fFamily: 'barlowRegular400' },
  overline: { size: 11, fFamily: 'barlowSemiBold600' },
};

const defaultBannerHeight = 152;

const SHADOWS = {
  /** Web `.cm-card-shadow` */
  card: {
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  /** Page intro / hero cards */
  banner: {
    elevation: 5,
    shadowColor: '#1A2332',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.09,
    shadowRadius: 16,
  },
  header: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  floating: {
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  /** Thumbnails, chips */
  soft: {
    elevation: 2,
    shadowColor: '#1A2332',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
};

const GLOBALSTYLE = {
  wrap: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  paddingHor: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
  },
  marginHor: {
    marginHorizontal: Sizer.hSize(SPACING.screenPx),
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
    height: Sizer.vSize(8),
  },
  /** Default elevated card — use for panels, forms, lists */
  screenCard: {
    backgroundColor: COLORS.surface,
    borderRadius: Sizer.hSize(14),
    ...SHADOWS.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderSubtle,
  },
  bgWithOpacity: (opacity = 0.3) => `rgba(0, 0, 0, ${opacity})`,
  dynamicAvatar: { uri: 'https://i.pravatar.cc/100' },
};

export {
  COLORS,
  WINDOW,
  FONTS,
  GLOBALSTYLE,
  BASEOPACITY,
  IMAGEONLOADCOLOR,
  SPACING,
  RADIUS,
  TYPE,
  SHADOWS,
  defaultBannerHeight,
};
