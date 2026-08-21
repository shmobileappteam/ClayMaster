import React from 'react';
import { ScrollView, StyleSheet, View, Linking } from 'react-native';
import { useSelector } from 'react-redux';

import { Container, Flex, Typography } from '../../../atomComponents';
import { Header } from '../../../components';
import { COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';

/**
 * Content aligned with https://claymaster.net/about-us (client usability feedback).
 */
const AboutUsScreen = () => {
  const { subscriptionEnabled } = useSelector(state => state.app);

  return (
    <Container isPadding={false}>
      <Header type="app" title="About Us" />
      <ScrollView
        style={{ ...GLOBALSTYLE.paddingHor, marginTop: Sizer.hSize(20) }}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        <Typography fFamily="barlowSemiBold600" size={18} mT={10}>
          About ClayMaster
        </Typography>

        <Typography
          fFamily="barlowRegular400"
          size={14}
          mT={10}
          color={COLORS.black}
          lineHeight={22}
        >
          We provide internet,{' '}
          <Typography fFamily="barlowBold700">
            {subscriptionEnabled
              ? 'subscription-based sporting clays education/training'
              : 'sporting clays education/training'}
          </Typography>{' '}
          designed to improve your performance via the following key services.
          We are continually adding other features as well to bring additional
          value to our subscribers.
        </Typography>

        <View style={styles.listContainer}>
          {[
            'Detailed Analytics Tool & Other Analytics Services',
            'Instructional Videos (presented by Kevin DeMichiel)',
            'Detailed Practice Drills',
            'On-line Coaching Sessions',
            'Private Community Forum',
            'Monthly Webcasts (hosted by Kevin DeMichiel)',
          ].map((item, index) => (
            <Flex key={index} gap={8} mT={8} algItems="flex-start">
              <Typography size={20} mT={-5}>
                {'\u2022'}
              </Typography>
              <Typography
                fFamily="barlowRegular400"
                size={14}
                style={{ flex: 1 }}
                lineHeight={20}
              >
                {item}
              </Typography>
            </Flex>
          ))}
        </View>

        <Typography
          fFamily="barlowRegular400"
          size={14}
          mT={20}
          color={COLORS.black}
          lineHeight={22}
        >
          Our ClayMaster team combines a retired Fortune 50 supply chain
          executive who specialized in improvement processes and
          technology/former Accenture management consultant/USMC Veteran with
          38+ years of work experience and aspiring sporting clays competitor
          with two of the top sporting clays competitors and instructors/coaches
          in the U.S. (
          <Typography fFamily="barlowBold700">Kevin DeMichiel</Typography> and{' '}
          <Typography fFamily="barlowBold700">Bill McGuire</Typography>).
        </Typography>

        <Typography
          fFamily="barlowRegular400"
          size={14}
          mT={12}
          color={COLORS.black}
          lineHeight={22}
        >
          The combination of Kevin and Bill as our featured instructors/coaches
          will provide our subscribers with an amazing wealth of sporting clays
          experience/knowledge.
        </Typography>

        <Typography fFamily="barlowSemiBold600" size={16} mT={24}>
          Kevin DeMichiel
        </Typography>
        <Typography
          fFamily="barlowRegular400"
          size={14}
          mT={8}
          color={COLORS.black}
          lineHeight={22}
        >
          Kevin is widely known for his straight forward/friendly nature as a
          professional shooter/instructor/coach. Kevin is from Forsyth, GA and
          has been shooting for 26 years. He’s a 15x NSCA All-American, 13x Team
          USA member (serving as Captain of the 2019 team) and 2x GA State
          Champion. In addition, Kevin was inducted into the GA Sporting Clays
          Association Hall of Fame in 2017.
        </Typography>

        <Typography fFamily="barlowSemiBold600" size={16} mT={24}>
          Bill McGuire
        </Typography>
        <Typography
          fFamily="barlowRegular400"
          size={14}
          mT={8}
          color={COLORS.black}
          lineHeight={22}
        >
          Bill is one of the legends in sporting clays and is also one of the
          most respected/friendliest gentlemen that you’ll meet. Bill is from
          Sweetwater, TN and has been shooting for 29 years. He’s a NSCA Hall of
          Fame member inducted in 2016, TN Sporting Clays Association Hall of
          Fame member inducted in 2024, 2x NSCA National Champion, 18x NSCA
          All-American, and 2014, 2015, 2016, and 2020 NSCA Tour Championship
          Champion.
        </Typography>

        <View style={{ marginTop: Sizer.hSize(30), alignItems: 'center' }}>
          <Typography fFamily="barlowRegular400" size={14} color={COLORS.black}>
            Website
          </Typography>
          <Typography
            fFamily="barlowBold700"
            size={14}
            color={COLORS.primary}
            style={{ textDecorationLine: 'underline', marginTop: 4 }}
            onPress={() => Linking.openURL('https://claymaster.net')}
          >
            claymaster.net
          </Typography>
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingLeft: Sizer.hSize(10),
    marginTop: Sizer.vSize(8),
  },
});

export default AboutUsScreen;
