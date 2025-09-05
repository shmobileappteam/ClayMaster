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
    text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem',
    time: '20m ago',
  },
  {
    id: '2',
    text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem',
    time: '20m ago',
  },
  {
    id: '3',
    text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem',
    time: '20m ago',
  },
  {
    id: '4',
    text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem',
    time: '20m ago',
  },
  {
    id: '5',
    text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem',
    time: '20m ago',
  },
];

const NotificationScreen = () => {
  const renderItem = ({ item, index }) => (
    <SlideInView slide="left">
      <View style={[styles.cardContainer]}>
        <Flex gap={12}>
          <NotificationSvg />
          <Flex direction="column" flex={1}>
            <Typography
              size={14}
              color={COLORS.black100}
              fFamily="barlowMedium500"
              LineHeight={18}
            >
              {item.text}
            </Typography>
            <Typography size={12} mT={10} color={"#7B7B7B"}>
              {item.time}
            </Typography>
          </Flex>
        </Flex>
      </View>
    </SlideInView>
  );

  return (
    <Container isPadding={false}>
      <Header type="app" title="Notifications" />
      <FlatList
        data={notifications}
        style={{ marginTop: Sizer.vSize(18), ...GLOBALSTYLE.paddingHor }}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  cardContainer: {
    padding: Sizer.hSize(8),
    borderRadius: Sizer.hSize(12),
    marginBottom: Sizer.hSize(12),
    backgroundColor: COLORS.white100,
  },
  cardWithBg: {
    backgroundColor: '#FEF1DD',
  },

  icon: {
    flex: 1,
  },
});
