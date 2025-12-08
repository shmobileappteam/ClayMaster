import React from 'react';
import { ScrollView, StyleSheet, View, Linking } from 'react-native';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header } from '../../../components';
import { COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';

const AboutUsScreen = () => {
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

                <Typography fFamily="barlowRegular400" size={14} mT={10} color={COLORS.black}>
                    ClayMaster provides{' '}
                    <Typography fFamily="barlowBold700">
                        subscription-based sporting clays performance improvement
                    </Typography>{' '}
                    through a suite of unique tools and services:
                </Typography>

                <View style={styles.listContainer}>
                    {[
                        'Detailed Sporting Clays Analytics Tool & other analytics services',
                        <>Target-specific instructional videos presented by <Typography fFamily="barlowBold700">Kevin DeMichiel</Typography></>,
                        'Sporting clays practice drills',
                        'Online coaching sessions',
                        'Private community forum for sporting clays enthusiasts',
                        'Monthly webcasts hosted by Kevin DeMichiel',
                    ].map((item, index) => (
                        <Flex key={index} gap={8} mT={8} algItems={'flex-start'}>
                            <Typography size={20} mT={-5} >{'\u2022'}</Typography>
                            <Typography fFamily="barlowRegular400" size={14} style={{ flex: 1 }}>
                                {item}
                            </Typography>
                        </Flex>
                    ))}
                </View>

                <Typography fFamily="barlowRegular400" size={14} mT={20}>
                    Our team combines expertise from diverse backgrounds:
                </Typography>

                <View style={styles.listContainer}>
                    <Flex gap={8} mT={8}>
                        <Typography size={20} mT={-5}>{'\u2022'}</Typography>
                        <Typography fFamily="barlowRegular400" size={14} style={{ flex: 1 }}>
                            A retired{' '}
                            <Typography fFamily="barlowBold700">
                                Fortune 50 supply chain executive
                            </Typography>
                            , former Accenture management consultant, and{' '}
                            <Typography fFamily="barlowBold700">USMC Veteran</Typography> with
                            38+ years of experience
                        </Typography>
                    </Flex>

                    <Flex gap={8} mT={8}>
                        <Typography size={20} mT={-5} >{'\u2022'}</Typography>
                        <Typography fFamily="barlowRegular400" size={14} style={{ flex: 1 }}>
                            <Typography fFamily="barlowBold700">Kevin DeMichiel</Typography>, ONE
                            of the top sporting clays competitors and instructors in the U.S.
                            Kevin is a 15-time National Sporting Clays Association (NSCA)
                            All-American, 13-time Team USA member (captain of the 2019 team),
                            two-time Georgia State Champion, and a 2017 inductee into the
                            Georgia Sporting Clays Association Hall of Fame
                        </Typography>
                    </Flex>
                </View>

                <Typography fFamily="barlowRegular400" size={14} mT={20}>
                    At ClayMaster, our mission is to help you improve your sporting clays
                    performance with expert guidance, innovative tools, and a supportive
                    community.
                </Typography>
                <View style={{ marginTop: Sizer.hSize(30), alignItems: 'center' }}>
                    <Typography fFamily="barlowRegular400" size={14} color={COLORS.black}>
                        🌐 Website
                    </Typography>

                    <Typography
                        fFamily="barlowBold700"
                        size={14}
                        color={COLORS.primary}
                        style={{ textDecorationLine: 'underline', marginTop: 4 }}
                        onPress={() => Linking.openURL('https://www.claymaster.net')}
                    >
                        www.claymaster.net
                    </Typography>
                </View>
            </ScrollView>
        </Container>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        paddingLeft: Sizer.hSize(10),
    },
});

export default AboutUsScreen;
