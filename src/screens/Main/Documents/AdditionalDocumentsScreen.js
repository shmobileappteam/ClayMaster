import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header, ScreenBanner } from '../../../components';
import { COLORS, GLOBALSTYLE, SHADOWS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';

const DOCUMENTS = [
    { name: 'My path to sporting clays', size: '250.00 KB', type: 'pdf' },
    { name: 'Sporting clay fundamentals', size: '180.20 KB', type: 'pdf' },
    { name: 'Customer onboarding – beginning shooter', size: '310.45 KB', type: 'excel' },
    { name: 'Three primary lead methods illustrations', size: '215.10 KB', type: 'pdf' },
    { name: 'Classic plan automated onboarding checklist', size: '410.00 KB', type: 'excel' },
    { name: 'Pro plan automated onboarding checklist', size: '290.40 KB', type: 'excel' },
];

const AdditionalDocumentsScreen = () => {
    return (
        <Container isPadding={false} backgroundColor={COLORS.mainBg}>
            <Header type="app" title="Academy" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                <ScreenBanner 
                    title="Additional documents"
                    subtitle="Access a library of important documents, onboarding checklists, and training fundamentals."
                />

                <View style={styles.sectionHeader}>
                    <Typography fFamily="barlowBold700" size={16} lineHeight={22} color={COLORS.textPrimary}>Documents list</Typography>
                </View>

                <View style={[GLOBALSTYLE.paddingHor, { marginTop: Sizer.vSize(16), paddingHorizontal: Sizer.hSize(20) }]}>
                    {DOCUMENTS.map((doc, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={styles.docRow}
                            activeOpacity={0.88}
                        >
                            <View style={[styles.iconBox, { backgroundColor: doc.type === 'excel' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(232, 93, 4, 0.1)' }]}>
                                <Icon 
                                    name={doc.type === 'excel' ? "stats-chart" : "document-text"} 
                                    iconFamily="Ionicons" 
                                    size={24} 
                                    color={doc.type === 'excel' ? "#2E7D32" : COLORS.primary} 
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: Sizer.hSize(16), marginRight: Sizer.hSize(12) }}>
                                <Typography fFamily="barlowBold700" size={15} color={COLORS.textPrimary} lineHeight={20}>{doc.name}</Typography>
                                <Typography size={13} color={COLORS.textMuted} mT={6}>Size: {doc.size}</Typography>
                            </View>
                            <Flex direction="row" algItems="center" gap={12}>
                                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.88}>
                                    <Icon name="eye-outline" iconFamily="Ionicons" size={20} color={COLORS.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.88}>
                                    <Icon name="download-outline" iconFamily="Ionicons" size={20} color={COLORS.primary} />
                                </TouchableOpacity>
                            </Flex>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </Container>
    );
};

export default AdditionalDocumentsScreen;

const styles = StyleSheet.create({
    sectionHeader: {
        backgroundColor: COLORS.mainBg,
        paddingHorizontal: Sizer.hSize(20),
        paddingVertical: Sizer.vSize(16),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.borderSubtle,
        marginBottom: Sizer.vSize(8),
    },
    docRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Sizer.hSize(16),
        marginBottom: Sizer.vSize(12),
        backgroundColor: COLORS.surface,
        borderRadius: Sizer.hSize(14),
        ...SHADOWS.card,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.borderSubtle,
    },
    iconBox: {
        width: Sizer.hSize(52),
        height: Sizer.hSize(52),
        borderRadius: Sizer.hSize(12),
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionBtn: {
        width: Sizer.hSize(38),
        height: Sizer.hSize(38),
        borderRadius: Sizer.hSize(10),
        backgroundColor: COLORS.surfaceMuted,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
