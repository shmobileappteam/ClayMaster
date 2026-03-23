import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header, ScreenBanner } from '../../../components';
import { COLORS, GLOBALSTYLE, SHADOWS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';
import { BASE_URL } from '../../../api/endpoints';
import { openDrawerFromTabNavigation } from '../../../navigation/navigationHelpers';

const DashboardScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.app);
  const [isProVisible, setIsProVisible] = useState(true);
  const displayName =
    user?.first_name || user?.last_name
      ? `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim()
      : 'Member';

  return (
    <Container isPadding={false}>
      <Header
        type="home"
        onMenuPress={() => openDrawerFromTabNavigation(navigation)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Sizer.vSize(110) }}
      >
        {/* ── User Profile Card ─────────────────────────────────── */}
        <View style={styles.profileWrapper}>
          <TouchableOpacity 
            style={styles.profileCard}
            activeOpacity={0.88}
            onPress={() => navigation.navigate('ProfileDetailsScreen')}
          >
            <View style={styles.orangeAccent} />
            <Flex direction="row" algItems="center">
              <View style={styles.avatarRing}>
                <Image 
                  source={{
                    uri: user?.profile_image
                      ? `${BASE_URL}${user.profile_image}`
                      : 'https://i.pravatar.cc/150?u=claymaster',
                  }}
                  style={styles.avatar}
                />
              </View>
              <View style={styles.profileText}>
                <Typography fFamily="barlowBold700" size={17} color={COLORS.textPrimary}>
                  {displayName.toUpperCase()}
                </Typography>
                <Typography color={COLORS.primary} size={12} fFamily="barlowSemiBold600" mT={4} lineHeight={16}>
                  Pro membership
                </Typography>
              </View>
            </Flex>
          </TouchableOpacity>
        </View>

        {/* ── Welcome Banner ────────────────────────────────────── */}
        <ScreenBanner 
          title="Welcome to ClayMaster"
          subtitle="The first instructional sporting clays program in the United States—trusted for over thirty years."
          image="https://images.unsplash.com/photo-1595152230535-000000000000?auto=format&fit=crop&w=400&q=80"
          buttonLabel="Learn more"
          onButtonPress={() => navigation.navigate('Academy')}
        />

        {/* ── Recently Added ────────────────────────────────────── */}
        <View style={GLOBALSTYLE.paddingHor}>
          <Typography fFamily="barlowBold700" size={16} lineHeight={22} mT={24} color={COLORS.textPrimary}>
            Recently added
          </Typography>
          <View style={styles.emptyState}>
            <Icon name="albums-outline" iconFamily="Ionicons" size={40} color={COLORS.grey500} />
            <Typography color={COLORS.textMuted} size={14} lineHeight={20} textAlign="center" fFamily="barlowRegular400" mT={12}>
              Nothing new yet. Check back after your next session.
            </Typography>
          </View>
        </View>

        {/* ── PRO Plan Features Panel ──────────────────────────── */}
        <View style={GLOBALSTYLE.paddingHor}>
          <TouchableOpacity 
            style={styles.proHeader}
            activeOpacity={0.88}
            onPress={() => setIsProVisible(!isProVisible)}
          >
            <Flex direction="row" algItems="center">
              <Image 
                source={{ uri: 'https://i.pravatar.cc/100?u=pro' }} 
                style={styles.smallAvatar} 
              />
              <Typography color={COLORS.textPrimary} fFamily="barlowBold700" size={16} mL={12}>
                Pro plan · $550/year
              </Typography>
            </Flex>
            <Icon 
              name={isProVisible ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={COLORS.black400} 
              iconFamily="Ionicons" 
            />
          </TouchableOpacity>

          {isProVisible && (
            <View style={styles.proContent}>
              <ProFeatureGroup label="Analytics" items={['Self assessment', 'Pattern analysis', 'Managed service']} />
              <ProFeatureGroup label="Content" items={['12 target presentations', 'Instructional videos', 'Practice drills']} />
              <ProFeatureGroup label="Coaching & community" items={['Online coaching', 'Forum access', 'Monthly webcasts']} />
            </View>
          )}
        </View>
      </ScrollView>
    </Container>
  );
};

const ProFeatureGroup = ({ label, items }) => (
  <View style={styles.featureGroup}>
    <Typography color={COLORS.textMuted} size={12} fFamily="barlowSemiBold600" mB={10} lineHeight={16}>
      {label}
    </Typography>
    {items.map((item, idx) => (
      <Flex key={idx} direction="row" algItems="center" style={{ marginBottom: Sizer.vSize(8) }}>
        <View style={styles.bullet} />
        <Typography size={14} lineHeight={20} color={COLORS.textSecondary}>{item}</Typography>
      </Flex>
    ))}
  </View>
);

export default DashboardScreen;

const styles = StyleSheet.create({
  profileWrapper: {
    padding: Sizer.hSize(24),
    marginTop: Sizer.vSize(20),
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: Sizer.hSize(14),
    padding: Sizer.hSize(16),
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderSubtle,
    overflow: 'hidden',
  },
  avatarRing: {
    marginLeft: Sizer.hSize(8),
    borderWidth: 2,
    borderColor: 'rgba(232, 93, 4, 0.45)',
    borderRadius: Sizer.hSize(28),
    padding: Sizer.hSize(2),
  },
  orangeAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: Sizer.hSize(4),
    backgroundColor: COLORS.primary,
  },
  avatar: {
    width: Sizer.hSize(50),
    height: Sizer.hSize(50),
    borderRadius: Sizer.hSize(25),
    backgroundColor: COLORS.surfaceMuted,
  },
  profileText: {
    marginLeft: Sizer.hSize(12),
  },
  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(28),
    paddingHorizontal: Sizer.hSize(20),
    marginTop: Sizer.vSize(16),
    alignItems: 'center',
    ...SHADOWS.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderSubtle,
  },
  proHeader: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: Sizer.hSize(12),
    borderTopRightRadius: Sizer.hSize(12),
    padding: Sizer.hSize(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Sizer.vSize(32),
    ...SHADOWS.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderSubtle,
  },
  smallAvatar: {
    width: Sizer.hSize(34),
    height: Sizer.hSize(34),
    borderRadius: Sizer.hSize(17),
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  proContent: {
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: Sizer.hSize(12),
    borderBottomRightRadius: Sizer.hSize(12),
    padding: Sizer.hSize(20),
    ...SHADOWS.card,
  },
  featureGroup: {
    marginBottom: Sizer.vSize(20),
  },
  bullet: {
    width: Sizer.hSize(8),
    height: Sizer.hSize(8),
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: Sizer.hSize(12),
  }
});
