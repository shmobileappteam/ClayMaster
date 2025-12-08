import { Linking, ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header } from '../../../components';
import { COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';

const HelpAndSupportScreen = () => {
    const handleEmailPress = () => {
        Linking.openURL('mailto:support@claymaster.net');
    };

    return (
        <Container isPadding={false}>
            <Header type="app" title="Help & Support" />
            <ScrollView
                style={{ ...GLOBALSTYLE.paddingHor, marginTop: Sizer.hSize(20) }}
                contentContainerStyle={{ paddingBottom: 50 }}
                showsVerticalScrollIndicator={false}
            >
                <Typography fFamily="barlowRegular400" size={14} mT={10} color={COLORS.black}>
                    We’re here to assist you! If you have any questions, concerns, or need assistance with the app, our support team is ready to help.
                </Typography>

                <Typography fFamily="barlowSemiBold600" size={16} mT={20}>
                    Contact Us:
                </Typography>

                <TouchableOpacity onPress={handleEmailPress} activeOpacity={0.7}>
                    <Flex gap={8} mT={10} algItems="center">
                        <Icon name="mail" iconFamily="Ionicons" size={20} color={COLORS.primary} />
                        <Typography fFamily="barlowRegular400" size={14}>
                            Email: <Typography fFamily="barlowBold700" color={COLORS.primary}>support@claymaster.net</Typography>
                        </Typography>
                    </Flex>
                </TouchableOpacity>

                <Typography fFamily="barlowSemiBold600" size={16} mT={20}>
                    What We Can Help With:
                </Typography>

                <View style={styles.listContainer}>
                    {[
                        'Account setup and login issues',
                        'App navigation and features',
                        'Troubleshooting errors or bugs',
                        'Suggestions and feedback',
                    ].map((item, index) => (
                        <Flex key={index} gap={8} mT={8}>
                            <Typography size={20} lineHeight={20}>{'\u2022'}</Typography>
                            <Typography fFamily="barlowRegular400" size={14} style={{ flex: 1 }}>
                                {item}
                            </Typography>
                        </Flex>
                    ))}
                </View>

                <Typography fFamily="barlowSemiBold600" size={16} mT={20}>
                    How to Reach Us:
                </Typography>
                <Typography fFamily="barlowRegular400" size={14} mT={10}>
                    Simply send us an email at{' '}
                    <Typography fFamily="barlowBold700" onPress={handleEmailPress} color={COLORS.primary}>
                        support@claymaster.net
                    </Typography>{' '}
                    with a brief description of your issue, and our team will get back to you as soon as possible.
                </Typography>

                <Typography fFamily="barlowSemiBold600" size={16} mT={20}>
                    Response Time:
                </Typography>
                <Typography fFamily="barlowRegular400" size={14} mT={10}>
                    We aim to respond to all inquiries within{' '}
                    <Typography fFamily="barlowBold700">24–48 hours</Typography>.
                </Typography>

                <Typography fFamily="barlowRegular400" size={14} mT={30} textAlign="center" color={COLORS.grey}>
                    Thank you for using ClayMaster!{'\n'}Your satisfaction is our priority.
                </Typography>

            </ScrollView>
        </Container>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        paddingLeft: Sizer.hSize(10),
    },
});

export default HelpAndSupportScreen;
