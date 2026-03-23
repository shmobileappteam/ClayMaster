import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header, ScreenBanner, Button } from '../../../components';
import {
  BASEOPACITY,
  COLORS,
  GLOBALSTYLE,
  SHADOWS,
} from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';

const DRILLS = [
  { name: '2ND TARGET BP-HP-VPP PRACTICE DRILL', size: '216.43 KB' },
  { name: 'ADDITIONAL CONSIDERATIONS PRACTICE DRILL', size: '208.06 KB' },
  { name: 'ADVANCED SHOT ANALYSIS PRACTICE DRILL', size: '686.3 KB' },
  { name: 'DROPPER PRACTICE DRILL', size: '167.65 KB' },
  { name: 'INCREASE TECHNICAL SKILLS PRACTICE DRILL', size: '210.76 KB' },
  { name: 'LEAD METHODS PRACTICE DRILL', size: '250.00 KB' },
  { name: 'MULTIPLE BPS PRACTICE DRILL', size: '180.20 KB' },
  { name: 'TARGET PRESENTATION PRACTICE DRILL', size: '310.45 KB' },
  { name: 'TRUE PAIRS PRACTICE DRILL', size: '215.10 KB' },
  { name: 'TOURNAMENT SHOOT OFF PRACTICE DRILL', size: '410.00 KB' },
  { name: 'RUNNING STATIONS PRACTICE DRILL', size: '290.40 KB' },
  { name: 'SPECIALTY TARGETS PRACTICE DRILL', size: '330.12 KB' },
];

const DrillsScreen = ({ navigation }) => {
  const [selectedDrill, setSelectedDrill] = useState(null);

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <Header type="app" title="Academy" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <ScreenBanner
          title="Practice drills"
          subtitle="Proven, high impact practice drills designed to improve your overall sporting clays skills and prepare you for competition."
        />

        <View
          style={[
            GLOBALSTYLE.paddingHor,
            { marginTop: Sizer.vSize(24), paddingHorizontal: Sizer.hSize(20) },
          ]}
        >
          <Typography
            fFamily="barlowBold700"
            size={16}
            lineHeight={22}
            color={COLORS.textPrimary}
            mB={16}
          >
            Documents
          </Typography>

          {DRILLS.map((drill, index) => (
            <TouchableOpacity
              key={index}
              style={styles.drillRow}
              activeOpacity={0.88}
              onPress={() => setSelectedDrill(drill)}
            >
              <View style={styles.iconBox}>
                <Icon
                  name="document-text"
                  iconFamily="Ionicons"
                  size={24}
                  color={COLORS.primary}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  marginLeft: Sizer.hSize(16),
                  marginRight: Sizer.hSize(12),
                }}
              >
                <Typography
                  fFamily="barlowBold700"
                  size={15}
                  color={COLORS.textPrimary}
                  lineHeight={20}
                >
                  {drill.name}
                </Typography>
                <Typography size={13} color={COLORS.textMuted} mT={6}>
                  {drill.size}
                </Typography>
              </View>
              <Icon
                name="ellipsis-vertical"
                iconFamily="Ionicons"
                size={20}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Document Action Modal */}
      <Modal
        transparent={true}
        visible={!!selectedDrill}
        animationType="slide"
        onRequestClose={() => setSelectedDrill(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedDrill(null)}
        >
          <View style={styles.actionSheet}>
            <View style={styles.sheetHandle} />
            <Typography
              fFamily="barlowBold700"
              size={17}
              lineHeight={24}
              textAlign="center"
              color={COLORS.textPrimary}
              mB={24}
            >
              {selectedDrill?.name}
            </Typography>

            <Button
              label="Preview document"
              type="secondary"
              onPress={() => setSelectedDrill(null)}
              btnStyle={styles.sheetBtn}
              textStyle={{ textTransform: 'none' }}
              icon={
                <Icon
                  name="eye-outline"
                  iconFamily="Ionicons"
                  size={20}
                  color={COLORS.primary}
                />
              }
              iconGap={8}
            />
            <Button
              label="Download document"
              onPress={() => setSelectedDrill(null)}
              btnStyle={styles.sheetBtn}
              textStyle={{ textTransform: 'none' }}
              icon={
                <Icon
                  name="download-outline"
                  iconFamily="Ionicons"
                  size={20}
                  color={COLORS.white100}
                />
              }
              iconGap={8}
            />
            <Button
              label="Print document"
              type="secondary"
              onPress={() => setSelectedDrill(null)}
              btnStyle={styles.sheetBtn}
              textStyle={{ textTransform: 'none' }}
              icon={
                <Icon
                  name="print-outline"
                  iconFamily="Ionicons"
                  size={20}
                  color={COLORS.primary}
                />
              }
              iconGap={8}
            />

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSelectedDrill(null)}
              activeOpacity={0.88}
            >
              <Typography
                fFamily="barlowBold700"
                size={14}
                color={COLORS.textMuted}
              >
                CANCEL
              </Typography>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </Container>
  );
};

export default DrillsScreen;

const styles = StyleSheet.create({
  drillRow: {
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
    backgroundColor: 'rgba(232, 93, 4, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 35, 50, 0.6)',
    justifyContent: 'flex-end',
  },
  actionSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: Sizer.hSize(28),
    borderTopRightRadius: Sizer.hSize(28),
    padding: Sizer.hSize(24),
    paddingBottom: Sizer.vSize(48),
    ...SHADOWS.header, // Using header shadow for top elevation
  },
  sheetHandle: {
    width: Sizer.hSize(42),
    height: Sizer.vSize(5),
    backgroundColor: COLORS.borderMuted,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: Sizer.vSize(24),
  },
  sheetBtn: {
    width: '100%',
    marginBottom: Sizer.vSize(12),
  },
  closeBtn: {
    marginTop: Sizer.vSize(16),
    alignItems: 'center',
    paddingVertical: Sizer.vSize(16),
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: Sizer.hSize(12),
  },
});
