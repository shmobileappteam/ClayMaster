import React from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import Icon from '../../../helpers/Icon';
import { COLORS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';

const FieldLabel = ({ children }) => (
  <Typography fFamily="barlowMedium500" size={14} color={COLORS.textPrimary} mB={6}>
    {children}
  </Typography>
);

const FieldBox = ({ children, style }) => (
  <View style={[styles.fieldBox, style]}>{children}</View>
);

const TournamentEntryScreen = ({ navigation }) => (
  <Container isPadding={false} backgroundColor={COLORS.mainBg}>
    <LibraryHeader
      title="Submit Entry"
      showBack
      showNotification={false}
      onBack={() => navigation.goBack()}
    />
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.formGroup}>
        <FieldLabel>Tournament</FieldLabel>
        <FieldBox>
          <Typography size={14} color={COLORS.textPrimary}>
            Virtual Tournament 2026
          </Typography>
        </FieldBox>

        <FieldLabel>Round</FieldLabel>
        <FieldBox>
          <Typography size={14} color={COLORS.textPrimary}>
            Round 1
          </Typography>
          <Icon name="chevron-down" iconFamily="Ionicons" size={20} color={COLORS.textSecondary} />
        </FieldBox>

        <FieldLabel>Score</FieldLabel>
        <TextInput
          style={styles.input}
          placeholder="Enter your score (0-25)"
          placeholderTextColor={COLORS.textSecondary}
          keyboardType="number-pad"
        />

        <FieldLabel>Location</FieldLabel>
        <TextInput
          style={styles.input}
          placeholder="Shooting range name"
          placeholderTextColor={COLORS.textSecondary}
        />

        <FieldLabel>Date</FieldLabel>
        <FieldBox>
          <Typography size={14} color={COLORS.textSecondary}>
            Select date
          </Typography>
          <Icon name="calendar-outline" iconFamily="Ionicons" size={20} color={COLORS.textSecondary} />
        </FieldBox>
      </View>

      <Typography fFamily="barlowSemiBold600" size={20} color={COLORS.textPrimary} mB={12}>
        Proof of Score
      </Typography>
      <View style={styles.uploadGrid}>
        <TouchableOpacity style={styles.uploadCard} activeOpacity={0.88}>
          <View style={styles.uploadIcon}>
            <Icon name="camera-outline" iconFamily="Ionicons" size={22} color={COLORS.primary} />
          </View>
          <Typography size={12} color={COLORS.textSecondary} fFamily="barlowMedium500">
            Take Photo
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity style={styles.uploadCard} activeOpacity={0.88}>
          <View style={styles.uploadIcon}>
            <Icon name="cloud-upload-outline" iconFamily="Ionicons" size={22} color={COLORS.primary} />
          </View>
          <Typography size={12} color={COLORS.textSecondary} fFamily="barlowMedium500">
            Upload File
          </Typography>
        </TouchableOpacity>
      </View>

      <Typography fFamily="barlowSemiBold600" size={20} color={COLORS.textPrimary} mB={12}>
        Signed Scorecard
      </Typography>
      <TouchableOpacity style={styles.scorecardUpload} activeOpacity={0.88}>
        <Icon name="document-text-outline" iconFamily="Ionicons" size={24} color={COLORS.textSecondary} />
        <Typography size={14} color={COLORS.textSecondary} mL={12}>
          Upload signed scorecard
        </Typography>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitBtn} activeOpacity={0.88}>
        <Typography fFamily="barlowSemiBold600" size={16} color={COLORS.white100}>
          Submit Entry
        </Typography>
      </TouchableOpacity>
    </ScrollView>
  </Container>
);

export default TournamentEntryScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(SPACING.section),
  },
  formGroup: { gap: Sizer.vSize(SPACING.component) },
  fieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Sizer.vSize(48),
    paddingHorizontal: Sizer.hSize(16),
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    borderRadius: Sizer.hSize(12),
  },
  input: {
    height: Sizer.vSize(48),
    paddingHorizontal: Sizer.hSize(16),
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    borderRadius: Sizer.hSize(12),
    fontFamily: 'Barlow-Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  uploadGrid: {
    flexDirection: 'row',
    gap: Sizer.hSize(SPACING.component),
  },
  uploadCard: {
    flex: 1,
    alignItems: 'center',
    padding: Sizer.hSize(SPACING.cardP),
    backgroundColor: COLORS.surface,
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    borderStyle: 'dashed',
    gap: Sizer.vSize(8),
  },
  uploadIcon: {
    width: Sizer.hSize(44),
    height: Sizer.hSize(44),
    borderRadius: Sizer.hSize(22),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scorecardUpload: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizer.vSize(32),
    backgroundColor: COLORS.surface,
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    borderStyle: 'dashed',
  },
  submitBtn: {
    height: Sizer.vSize(48),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
