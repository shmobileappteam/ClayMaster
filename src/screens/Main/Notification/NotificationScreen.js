import React from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { Typography, Flex, Container } from '../../../atomComponents';
import Sizer from '../../../helpers/Sizer';
import { COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
// import { notif } from '../../../assets/images';
import { Header } from '../../../components';
import SlideInView from '../../../animations/SlideView';
import { NotificationSvg } from '../../../assets/svgs';

const notifications = [
  {
    id: '1',
    title: 'Round Completed',
    text: 'Round 3 has been successfully completed by Squad A.',
    time: '10m ago',
    type: 'round',
  },
  {
    id: '2',
    title: 'Score Updated',
    text: 'Your score for Station 5 has been updated. Check results tab.',
    time: '25m ago',
    type: 'score',
  },
  {
    id: '3',
    title: 'New Round Assigned',
    text: 'You have been assigned to Round 4 – starting at 2:30 PM.',
    time: '1h ago',
    type: 'assignment',
  },
  {
    id: '4',
    title: 'Download Ready',
    text: 'Score report for Squad B is now available for download.',
    time: '2h ago',
    type: 'download',
  },
  {
    id: '5',
    title: 'Sync Successful',
    text: 'ClayMaster data synchronized with backend successfully.',
    time: '3h ago',
    type: 'sync',
  },
  {
    id: '6',
    title: 'Admin Update',
    text: 'Admin panel changes have been applied to your current session.',
    time: 'Yesterday',
    type: 'admin',
  },
];

const NotificationScreen = () => {
  const renderItem = ({ item, index }) => (
    <SlideInView slide="left">
      <View style={[styles.cardContainer]}>
        <Flex gap={12} algItems="flex-start">
          <NotificationSvg />
          <Flex direction="column" flex={1}>
            <Typography
              size={14}
              color={COLORS.black300}
              fFamily="barlowBold700"
              LineHeight={18}
            >
              {item.title}
            </Typography>
            <Typography
              size={13}
              color={COLORS.black500}
              fFamily="barlowMedium500"
              mT={4}
              LineHeight={18}
            >
              {item.text}
            </Typography>
            <Typography size={11} mT={10} color={'#7B7B7B'} fFamily="barlowBold700">
              {item.time}
            </Typography>
          </Flex>
        </Flex>
      </View>
    </SlideInView>
  );

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <Header type="app" title="Notifications" />
      <FlatList
        data={notifications}
        style={{ marginTop: Sizer.vSize(24), ...GLOBALSTYLE.paddingHor }}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: Sizer.vSize(80) }}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  cardContainer: {
    padding: Sizer.hSize(16),
    borderRadius: Sizer.hSize(12),
    marginBottom: Sizer.hSize(16),
    backgroundColor: COLORS.white100,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  cardWithBg: {
    backgroundColor: '#FEF1DD',
  },

  icon: {
    flex: 1,
  },
});
