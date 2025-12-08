import { ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header } from '../../../components';
import { COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';

const TermsAndConditionsScreen = () => {
    return (
        <Container isPadding={false}>
            <Header type="app" title="Terms & Conditions" />
            <ScrollView
                style={{ ...GLOBALSTYLE.paddingHor, marginTop: Sizer.hSize(20) }}
                contentContainerStyle={{ paddingBottom: 50 }}
                showsVerticalScrollIndicator={false}
            >
                <Typography fFamily="barlowBold700" size={16} mT={10}>
                    ClayMaster Mobile App Terms & Conditions
                </Typography>

                <Typography fFamily="barlowSemiBold600" size={14} mT={5}>
                    Last Updated: December 4, 2025
                </Typography>

                <Typography fFamily="barlowRegular400" size={14} mT={10} color={COLORS.black}>
                    Welcome to the ClayMaster Mobile App (the "App"). These Terms & Conditions ("Terms") govern your access to and use of the App, provided by <Typography fFamily="barlowBold700">ClayMaster LLC</Typography> ("Company," "we," "us," or "our"). By downloading, accessing, or using the App, you agree to be bound by these Terms, our Privacy Policy, and any other policies referenced herein.
                </Typography>

                <Typography fFamily="barlowRegular400" size={14} mT={10} color={COLORS.black}>
                    If you do not agree to these Terms, you must immediately stop using the App.
                </Typography>

                <View style={styles.divider} />

                <Section title="1. General Use">
                    The App provides subscription-based access to sporting clays tools, instructional videos, practice drills, online coaching, community forums, and other related content.
                    {'\n\n'}
                    You may use the App only for lawful purposes and in accordance with these Terms. You are responsible for all activity on your account.
                </Section>

                <Section title="2. Eligibility & Age">
                    The App is intended for users <Typography fFamily="barlowBold700">13 years and older</Typography>. By using the App, you represent that you meet the age requirements to form a binding contract in your jurisdiction.
                </Section>

                <Section title="3. Account Registration & Security">
                    Some features require an account. When creating an account, you agree to provide accurate information. Keep your username and password confidential. You are responsible for any activity under your account. Notify us immediately of any unauthorized access.
                    {'\n\n'}
                    We may suspend or terminate accounts for security or policy violations at our discretion.
                </Section>

                <Section title="4. Subscription & Payment Terms">
                    Some App content and features are available through subscription plans or one-time purchases. By subscribing or purchasing, you agree to:
                    {'\n'}
                    <Flex gap={8} mT={8}>
                        <Typography size={20} lineHeight={20}>{'\u2022'}</Typography>
                        <Typography fFamily="barlowRegular400" size={14} style={{ flex: 1 }}>
                            Pay all applicable fees in <Typography fFamily="barlowBold700">USD</Typography>.
                        </Typography>
                    </Flex>
                    <Flex gap={8} mT={8}>
                        <Typography size={20} lineHeight={20}>{'\u2022'}</Typography>
                        <Typography fFamily="barlowRegular400" size={14} style={{ flex: 1 }}>
                            Keep a valid payment method on file.
                        </Typography>
                    </Flex>
                    <Flex gap={8} mT={8}>
                        <Typography size={20} lineHeight={20}>{'\u2022'}</Typography>
                        <Typography fFamily="barlowRegular400" size={14} style={{ flex: 1 }}>
                            Authorize recurring charges for subscription plans until canceled.
                        </Typography>
                    </Flex>

                    {'\n'}
                    <Typography fFamily="barlowBold700">Cancellation & Refunds:</Typography>
                    {'\n'}
                    <Flex gap={8} mT={8}>
                        <Typography size={20} lineHeight={20}>{'\u2022'}</Typography>
                        <Typography fFamily="barlowRegular400" size={14} style={{ flex: 1 }}>
                            Subscriptions can be canceled at any time, but all payments for the current billing period are non-refundable.
                        </Typography>
                    </Flex>
                    {'\n'}
                    <Flex gap={8} mT={8}>
                        <Typography size={20} lineHeight={20}>{'\u2022'}</Typography>
                        <Typography fFamily="barlowRegular400" size={14} style={{ flex: 1 }}>
                            Due to the digital nature of our content, <Typography fFamily="barlowBold700">no returns or refunds</Typography> are provided after purchase.
                        </Typography>
                    </Flex>

                    {'\n'}
                    <Typography fFamily="barlowBold700">Chargebacks:</Typography>
                    {'\n'}
                    Attempting a chargeback without contacting us may result in additional fees, and you remain liable for all amounts due.
                </Section>

                <Section title="5. Intellectual Property">
                    All content in the App, including videos, analytics tools, instructional materials, trademarks, and other materials, is owned by ClayMaster LLC or its licensors. You may only access content for personal, non-commercial use.
                    {'\n\n'}
                    You may not copy, distribute, modify, or create derivative works from App content without our written permission.
                </Section>

                <Section title="6. User-Generated Content">
                    Users may post reviews, comments, photos, or other content ("User Content") in the App. By submitting User Content, you grant ClayMaster a <Typography fFamily="barlowBold700">non-exclusive, royalty-free, worldwide license</Typography> to use, reproduce, modify, and display the content for marketing or other business purposes.
                    {'\n\n'}
                    You are responsible for any content you submit and must comply with all applicable laws. We reserve the right to remove User Content at our discretion.
                </Section>

                <Section title="7. Privacy & Data Collection">
                    Your use of the App is subject to our Privacy Policy (support@claymaster.net), which explains what data we collect, how it is used, and your rights. By using the App, you consent to our data practices.
                </Section>

                <Section title="8. Restricted Use">
                    <Flex gap={8} mT={8}>
                        <Typography size={20}>{'\u2022'}</Typography>
                        <Typography size={14} style={{ flex: 1 }}>
                            Use the App in violation of any laws.
                        </Typography>
                    </Flex>

                    <Flex gap={8} mT={8}>
                        <Typography size={20}>{'\u2022'}</Typography>
                        <Typography size={14} style={{ flex: 1 }}>
                            Interfere with App operations, including hacking, malware, or unauthorized access.
                        </Typography>
                    </Flex>

                    <Flex gap={8} mT={8}>
                        <Typography size={20}>{'\u2022'}</Typography>
                        <Typography size={14} style={{ flex: 1 }}>
                            Impersonate others or post harmful, offensive, or illegal content.
                        </Typography>
                    </Flex>

                    <Flex gap={8} mT={8}>
                        <Typography size={20}>{'\u2022'}</Typography>
                        <Typography size={14} style={{ flex: 1 }}>
                            Use automated tools (bots, scrapers, crawlers) to access the App.
                        </Typography>
                    </Flex>
                </Section>

                <Section title="9. Third-Party Services">
                    The App may link to third-party services, ads, or content. We are not responsible for third-party sites or their policies. Your use of these services is at your own risk.
                </Section>

                <Section title="10. Disclaimer & No Guarantee">
                    The App and its content are provided “as-is” for informational and educational purposes. We do not guarantee specific results, performance improvements, or financial gain.
                    {'\n\n'}
                    We disclaim all warranties, express or implied, including merchantability or fitness for a particular purpose.
                </Section>

                <Section title="11. Limitation of Liability">
                    ClayMaster LLC is not liable for any damages arising from your use of the App, including indirect, incidental, or consequential damages. Our maximum liability is limited to the total amount you paid for App subscriptions or purchases.
                </Section>

                <Section title="12. Indemnification">
                    You agree to defend, indemnify, and hold harmless ClayMaster LLC, its affiliates, and partners from claims, damages, or liabilities arising from your use of the App or violation of these Terms.
                </Section>

                <Section title="13. Governing Law & Arbitration">
                    These Terms are governed by the laws of Florida, USA. Any disputes will be resolved through binding arbitration in Nassau County, Florida, under the rules of the American Arbitration Association.
                </Section>

                <Section title="14. Changes to Terms">
                    We may update these Terms at any time. Continued use of the App constitutes acceptance of updated Terms.
                </Section>

                <Section title="15. Contact">
                    For questions, concerns, or support, please contact us at:
                    {'\n\n'}
                    📧 support@claymaster.net
                    {'\n\n'}
                    Thank you for using ClayMaster! We’re committed to helping you improve your sporting clays performance.
                </Section>


            </ScrollView>
        </Container>
    );
};

const Section = ({ title, children }) => (
    <View style={styles.section}>
        <Typography fFamily="barlowSemiBold600" size={16} mT={10}>
            {title}
        </Typography>
        <Typography fFamily="barlowRegular400" size={14} mT={5} color={COLORS.black} lineHeight={20}>
            {children}
        </Typography>
    </View>
);

const styles = StyleSheet.create({
    divider: {
        height: 1,
        backgroundColor: COLORS.grey,
        marginVertical: Sizer.hSize(10),
        opacity: 0.2
    },
    section: {
        marginBottom: Sizer.hSize(15)
    }
});

export default TermsAndConditionsScreen;
