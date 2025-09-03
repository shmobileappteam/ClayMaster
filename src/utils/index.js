import {Platform, StatusBar} from 'react-native';

export const setStatusBar = ({
  color = 'transparent',
  content = 'dark-content',
  hidden = false,
}) => {
  StatusBar.setBarStyle(content);
  StatusBar.setHidden(hidden);
  if (Platform.OS == 'ios') return;
  StatusBar.setBackgroundColor(color);
};
