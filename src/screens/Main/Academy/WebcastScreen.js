import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import Icon from '../../../helpers/Icon';
import {
  COLORS,
  GLOBALSTYLE,
  SHADOWS,
  SPACING,
  TYPE,
} from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { WEBCAST_PAST, WEBCAST_UPCOMING } from '../../../constants/libraryContent';

/** ClayMaster-App-UI `MonthlyWebcasts.tsx` */
const WebcastScreen = ({ navigation }) => (
  <Container isPadding={false} backgroundColor={COLORS.mainBg}>
    <LibraryHeader
      title="Monthly Webcasts"
      showBack
      showNotification={false}
      onBack={() => navigation.goBack()}
    />
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <Typography
        fFamily={TYPE.h2.fFamily}
        size={TYPE.h2.size}
        color={COLORS.textPrimary}
        mB={SPACING.component}
      >
        Upcoming
      </Typography>
      <View style={styles.list}>
        {WEBCAST_UPCOMING.map(wc => (
          <View key={wc.title} style={[GLOBALSTYLE.screenCard, styles.upcomingCard]}>
            <View style={styles.cardTop}>
              <View style={styles.iconCircle}>
                <Icon name="radio-outline" iconFamily="Ionicons" size={20} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.titleRow}>
                  <Typography
                    fFamily="barlowSemiBold600"
                    size={TYPE.body.size}
                    color={COLORS.textPrimary}
                    style={{ flex: 1 }}
                  >
                    {wc.title}
                  </Typography>
                  {wc.live ? (
                    <View style={styles.liveBadge}>
                      <Typography size={10} color={COLORS.white100} fFamily="barlowBold700">
                        LIVE
                      </Typography>
                    </View>
                  ) : null}
                </View>
                <View style={styles.metaRow}>
                  <Icon name="calendar-outline" iconFamily="Ionicons" size={12} color={COLORS.textSecondary} />
                  <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mL={4}>
                    {wc.date}
                  </Typography>
                  <Icon
                    name="time-outline"
                    iconFamily="Ionicons"
                    size={12}
                    color={COLORS.textSecondary}
                    style={{ marginLeft: 12 }}
                  />
                  <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mL={4}>
                    {wc.time}
                  </Typography>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.reminderBtn} activeOpacity={0.88}>
              <Typography fFamily="barlowSemiBold600" size={TYPE.body.size} color={COLORS.white100}>
                {wc.live ? 'Set Reminder' : 'Add to Calendar'}
              </Typography>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Typography
        fFamily={TYPE.h2.fFamily}
        size={TYPE.h2.size}
        color={COLORS.textPrimary}
        mT={SPACING.section}
        mB={SPACING.component}
      >
        Past Recordings
      </Typography>
      <View style={styles.list}>
        {WEBCAST_PAST.map(wc => (
          <View key={wc.title} style={[GLOBALSTYLE.screenCard, styles.pastCard]}>
            {wc.locked ? (
              <View style={styles.lockOverlay}>
                <Icon name="lock-closed-outline" iconFamily="Ionicons" size={22} color={COLORS.textSecondary} />
                <Typography size={TYPE.caption.size} color={COLORS.textSecondary} fFamily="barlowMedium500" mT={4}>
                  Pro Only
                </Typography>
              </View>
            ) : null}
            <View style={styles.iconCircle}>
              <Icon name="play-outline" iconFamily="Ionicons" size={18} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Typography fFamily="barlowSemiBold600" size={TYPE.body.size} color={COLORS.textPrimary}>
                {wc.title}
              </Typography>
              <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mT={2}>
                {wc.date} · {wc.duration}
              </Typography>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  </Container>
);

export default WebcastScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(100),
  },
  list: {
    gap: Sizer.vSize(SPACING.component),
  },
  upcomingCard: {
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  cardTop: {
    flexDirection: 'row',
    gap: Sizer.hSize(12),
  },
  iconCircle: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: Sizer.hSize(20),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizer.hSize(8),
  },
  liveBadge: {
    backgroundColor: COLORS.destructive,
    paddingHorizontal: Sizer.hSize(6),
    paddingVertical: 2,
    borderRadius: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Sizer.vSize(6),
    flexWrap: 'wrap',
  },
  reminderBtn: {
    height: Sizer.vSize(40),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizer.vSize(12),
  },
  pastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
    padding: Sizer.hSize(SPACING.cardP),
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.card,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.85)',
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
