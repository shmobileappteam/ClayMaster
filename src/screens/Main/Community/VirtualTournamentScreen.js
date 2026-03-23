import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header, ScreenBanner, Button } from '../../../components';
import { BASEOPACITY, COLORS, GLOBALSTYLE, SHADOWS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';

const VirtualTournamentScreen = ({ navigation }) => {
    return (
        <Container isPadding={false} backgroundColor={COLORS.mainBg}>
            <Header type="app" title="Community" isBackVisible={true} onPresBack={() => navigation.goBack()} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
                <ScreenBanner 
                    title="Virtual Tournament"
                    subtitle="Submit your tournament scores below. Ensure all fields are filled accurately for a valid submission."
                />

                <View style={[GLOBALSTYLE.paddingHor, { marginTop: Sizer.vSize(24) }]}>
                    <View style={styles.statusBadge}>
                        <Typography color={COLORS.primary} fFamily="barlowBold700" size={13} lineHeight={16}>LIVE: MARCH 2026 VIRTUAL TOURNAMENT</Typography>
                    </View>

                    <View style={styles.whiteCard}>
                        <Typography fFamily="barlowBold700" size={16} lineHeight={22} color={COLORS.textPrimary} mB={20}>Submit score</Typography>
                        
                        <InputField label="Full Name *" placeholder="Enter your full name" />
                        <InputField label="Score *" placeholder="e.g. 92/100" keyboardType="numeric" />
                        
                        <Flex direction="row" jusContent="space-between" mT={16}>
                           <View style={{ flex: 1, marginRight: 8 }}>
                               <InputField label="Station 1 *" placeholder="0" keyboardType="numeric" mT={0} />
                           </View>
                           <View style={{ flex: 1, marginLeft: 8 }}>
                               <InputField label="Station 2 *" placeholder="0" keyboardType="numeric" mT={0} />
                           </View>
                        </Flex>
                        {/* Repeat for more stations in a real app, keeping it simple for UI demo */}

                        <View style={{ marginTop: Sizer.vSize(24) }}>
                            <Typography size={13} color={COLORS.textPrimary} fFamily="barlowSemiBold600" mB={10}>Proof of Score (Photo) *</Typography>
                            <TouchableOpacity style={styles.filePicker} activeOpacity={0.88}>
                                <Typography size={14} color={COLORS.textMuted} fFamily="barlowRegular400">Choose file (No file chosen)</Typography>
                                <Icon name="camera" iconFamily="Ionicons" size={22} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>

                        <Button label="Submit score" mt={32} btnStyle={{ width: '100%' }} textStyle={{ textTransform: 'none' }} />
                    </View>
                </View>
            </ScrollView>
        </Container>
    );
};

const InputField = ({ label, placeholder, mT = 16, ...props }) => (
    <View style={{ marginTop: Sizer.vSize(mT) }}>
        <Typography size={13} color={COLORS.textPrimary} fFamily="barlowSemiBold600" mB={6}>{label}</Typography>
        <TextInput 
            style={styles.input} 
            placeholder={placeholder} 
            placeholderTextColor={COLORS.textMuted}
            {...props}
        />
    </View>
);

export default VirtualTournamentScreen;

const styles = StyleSheet.create({
    statusBadge: {
        backgroundColor: COLORS.surface,
        borderRadius: Sizer.hSize(12),
        paddingVertical: Sizer.vSize(14),
        alignItems: 'center',
        marginBottom: Sizer.vSize(20),
        borderWidth: 1.5,
        borderColor: 'rgba(232, 93, 4, 0.4)',
        ...SHADOWS.card,
    },
    whiteCard: {
        backgroundColor: COLORS.surface,
        borderRadius: Sizer.hSize(14),
        padding: Sizer.hSize(20),
        ...SHADOWS.card,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.borderSubtle,
    },
    input: {
        height: Sizer.vSize(50),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.borderSubtle,
        borderRadius: Sizer.hSize(10),
        paddingHorizontal: Sizer.hSize(16),
        fontFamily: 'Barlow-Medium',
        fontSize: 15,
        color: COLORS.textPrimary,
        backgroundColor: COLORS.surfaceMuted,
    },
    filePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Sizer.hSize(16),
        borderWidth: 1,
        borderColor: COLORS.borderMuted,
        borderStyle: 'dashed',
        borderRadius: Sizer.hSize(10),
        height: Sizer.vSize(54),
        backgroundColor: COLORS.surfaceMuted,
    }
});
