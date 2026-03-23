import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  Alert,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Typography,
  Flex,
} from '../atomComponents';
import { COLORS, SHADOWS } from '../globalStyle/Theme';
import { ConfirmModal } from '../components';
import Icon from '../helpers/Icon';
import Sizer from '../helpers/Sizer';
import { useSelector, useDispatch } from 'react-redux';
import { handleLogout } from '../redux/slices/appSlice';
import { DRAWER_SECTIONS } from './drawerMenuData';
import { logout as logoutApi, deleteAccount as deleteAccountApi } from '../api/userService';
import { queryClient } from '../api/api';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useCustomQuery } from '../query/useCustomQuery';

const STACK_ROUTE = 'BottomTabs';
const TAB_CONTAINER = 'MainTabs';

export function navigateFromDrawer(drawerNav, item) {
  const stackNav = drawerNav.getParent();
  if (typeof drawerNav.closeDrawer === 'function') {
    drawerNav.closeDrawer();
  }
  const go = () => {
    if (item.action === 'tab') {
      stackNav?.navigate(STACK_ROUTE, {
        screen: TAB_CONTAINER,
        params: { screen: item.tab },
      });
      return;
    }
    if (item.screen) {
      stackNav?.navigate(item.screen);
    }
  };
  if (Platform.OS === 'ios') {
    requestAnimationFrame(go);
  } else {
    setTimeout(go, 50);
  }
}

const DarkGroup = ({
  title,
  icon,
  items,
  navigation,
  expanded,
  onToggle,
}) => (
  <View style={styles.groupBox}>
    <TouchableOpacity
      style={styles.groupHeader}
      activeOpacity={0.88}
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
    >
      <Flex direction="row" algItems="center" flexStyle={styles.groupHeaderInner}>
        <View style={styles.groupIconBox}>
          <Icon name={icon} iconFamily="Ionicons" size={21} color={COLORS.primary} />
        </View>
        <Typography
          color={COLORS.white100}
          size={15}
          lineHeight={22}
          fFamily="barlowBold700"
          mL={12}
          style={styles.groupTitle}
        >
          {title}
        </Typography>
      </Flex>
      <Icon
        name={expanded ? 'chevron-up' : 'chevron-down'}
        iconFamily="Ionicons"
        size={22}
        color="rgba(255,255,255,0.45)"
      />
    </TouchableOpacity>
    {expanded && (
      <View style={styles.itemsBlock}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={(item.label || '') + index}
            style={[styles.menuRow, index === items.length - 1 && styles.menuRowLast]}
            onPress={() => navigateFromDrawer(navigation, item)}
            activeOpacity={0.82}
          >
            <View style={styles.menuRowAccent} />
            <View style={styles.menuIconCircle}>
              <Icon
                name={item.icon}
                iconFamily="Ionicons"
                size={18}
                color="rgba(255,255,255,0.88)"
              />
            </View>
            <Typography
              color="rgba(255,255,255,0.94)"
              size={14}
              lineHeight={21}
              fFamily="barlowMedium500"
              style={styles.menuLabel}
            >
              {item.label}
            </Typography>
            <Icon name="chevron-forward" iconFamily="Ionicons" size={18} color="rgba(255,255,255,0.35)" />
          </TouchableOpacity>
        ))}
      </View>
    )}
  </View>
);

const CustomDrawerContent = props => {
  const { navigation } = props;
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.app);
  const [expandedGroups, setExpandedGroups] = useState({
    ANALYTICS: true,
    TRAINING: true,
    COACHING: false,
    COMMUNITY: false,
    TOURNAMENT: false,
    COMMERCE: false,
    PERFORMANCE: false,
    ACCOUNT: false,
  });

  const [logoutVisible, setLogoutVisible] = useState(false);

  const toggle = key => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const stackNavigation = props.navigation.getParent();

  function clearApp() {
    queryClient.clear();
    stackNavigation?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      }),
    );
  }

  //Custom Logout Query Hook
  const { refetch: triggerLogout } = useCustomQuery({
    queryKey: ['logout'],
    queryFn: logoutApi,
    enabled: false,
  });

  // Request Logout:
  const logoutHandler = () => {
    clearApp();
    triggerLogout().then(() => {
      dispatch(handleLogout());
    });
  };

  const onLogoutTap = () => {
    logoutHandler();
  };

  return (
    <View style={styles.shell}>
      <View style={[styles.drawerTopBar, { paddingTop: insets.top + Sizer.vSize(12) }]}>
        <View style={styles.topLogoRow}>
          <View style={styles.logoIndicator} />
          <View>
            <Typography
              color="rgba(255,255,255,0.45)"
              size={11}
              fFamily="barlowSemiBold600"
              style={{ letterSpacing: 1.5 }}
            >
              CLAYMASTER
            </Typography>
            <Typography color={COLORS.white100} size={24} lineHeight={30} fFamily="barlowBold700" mT={2}>
              Navigation
            </Typography>
          </View>
        </View>
        <TouchableOpacity
          style={styles.closeBtn}
          activeOpacity={0.88}
          onPress={() => navigation.closeDrawer()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Close menu"
        >
          <Icon name="close" iconFamily="Ionicons" size={26} color={COLORS.white100} />
        </TouchableOpacity>
      </View>

      <DrawerContentScrollView
        {...props}
        style={styles.drawerScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.profileCard}
          activeOpacity={0.88}
          onPress={() => navigateFromDrawer(navigation, { screen: 'ProfileDetailsScreen' })}
        >
          <View style={styles.profileTopAccent} />
          <View style={styles.profileContent}>
            <View style={styles.avatarPill}>
              <View style={styles.avatarInner}>
                <Typography color={COLORS.white100} fFamily="barlowBold700" size={18}>
                  {user?.first_name?.[0]}
                  {user?.last_name?.[0]}
                </Typography>
              </View>
            </View>
            <View style={styles.profileTextCol}>
              <View style={styles.proPill}>
                <Typography color={COLORS.white100} size={10} fFamily="barlowBold700" letterSpacing={0.5}>
                  PREMIUM
                </Typography>
              </View>
              <Typography color={COLORS.white100} size={18} lineHeight={24} fFamily="barlowBold700" mT={6}>
                {user?.first_name} {user?.last_name}
              </Typography>
              <Typography color="rgba(255,255,255,0.5)" size={12} mT={4} numberOfLines={1}>
                {user?.email || ' '}
              </Typography>
            </View>
            <View style={styles.profileArrowBox}>
              <Icon name="chevron-forward" iconFamily="Ionicons" size={18} color="rgba(255,255,255,0.4)" />
            </View>
          </View>
        </TouchableOpacity>

        <Typography
          color="rgba(255,255,255,0.4)"
          size={11}
          fFamily="barlowSemiBold600"
          mT={22}
          mB={12}
          mL={2}
          style={{ letterSpacing: 0.8 }}
        >
          BROWSE ALL
        </Typography>

        {DRAWER_SECTIONS.map(group => (
          <DarkGroup
            key={group.key}
            title={group.title}
            icon={group.icon}
            items={group.items}
            navigation={navigation}
            expanded={expandedGroups[group.key]}
            onToggle={() => toggle(group.key)}
          />
        ))}
      </DrawerContentScrollView>

      <View
        style={[
          styles.logoutWrap,
          { paddingBottom: Math.max(insets.bottom, Sizer.vSize(14)) },
        ]}
      >
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.88}
          onPress={onLogoutTap}
        >
          <Icon name="log-out-outline" iconFamily="Ionicons" size={22} color={COLORS.white100} />
          <Typography color={COLORS.white100} size={15} fFamily="barlowBold700" mL={10}>
            Log out
          </Typography>
        </TouchableOpacity>
      </View>
      <ConfirmModal
        visible={logoutVisible}
        setVisibility={setLogoutVisible}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        handleComplete={async () => {
          try {
            await logoutApi();
            dispatch(handleLogout());
          } catch (e) {
            dispatch(handleLogout());
          }
        }}
      />
    </View>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  drawerScroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  drawerTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Sizer.hSize(20),
    paddingBottom: Sizer.vSize(18),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  topLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIndicator: {
    width: Sizer.hSize(4),
    height: Sizer.vSize(28),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(2),
    marginRight: Sizer.hSize(12),
  },
  closeBtn: {
    width: Sizer.hSize(44),
    height: Sizer.hSize(44),
    borderRadius: Sizer.hSize(14),
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  scrollContent: {
    paddingHorizontal: Sizer.hSize(20),
    paddingTop: Sizer.vSize(20),
    paddingBottom: Sizer.vSize(32),
  },
  profileCard: {
    backgroundColor: 'rgba(255,255,255,0.015)',
    borderRadius: Sizer.hSize(20),
    padding: Sizer.hSize(20),
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  profileTopAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Sizer.vSize(3),
    backgroundColor: COLORS.primary,
    opacity: 0.8,
  },
  avatarPill: {
    width: Sizer.hSize(60),
    height: Sizer.hSize(60),
    borderRadius: Sizer.hSize(30),
    padding: 3,
    borderWidth: 1.5,
    borderColor: 'rgba(232, 93, 4, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: Sizer.hSize(27),
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  profileTextCol: {
    flex: 1,
    marginLeft: Sizer.hSize(16),
    minWidth: 0,
  },
  proPill: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(5),
    borderRadius: Sizer.hSize(8),
  },
  profileArrowBox: {
    width: Sizer.hSize(34),
    height: Sizer.hSize(34),
    borderRadius: Sizer.hSize(17),
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupBox: {
    marginBottom: Sizer.vSize(14),
    borderRadius: Sizer.hSize(18),
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Sizer.hSize(16),
    paddingVertical: Sizer.vSize(16),
  },
  groupHeaderInner: {
    flex: 1,
    paddingRight: Sizer.hSize(10),
  },
  groupTitle: {
    flex: 1,
    minWidth: 0,
    letterSpacing: 0.3,
  },
  groupIconBox: {
    width: Sizer.hSize(42),
    height: Sizer.hSize(42),
    borderRadius: Sizer.hSize(12),
    backgroundColor: 'rgba(232, 93, 4, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(232, 93, 4, 0.3)',
  },
  itemsBlock: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Sizer.vSize(14),
    paddingRight: Sizer.hSize(14),
    paddingLeft: Sizer.hSize(6),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  menuRowLast: {
    borderBottomWidth: 0,
  },
  menuRowAccent: {
    width: Sizer.hSize(3),
    height: Sizer.vSize(18),
    marginRight: Sizer.hSize(12),
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    opacity: 0.6,
  },
  menuIconCircle: {
    width: Sizer.hSize(36),
    height: Sizer.hSize(36),
    borderRadius: Sizer.hSize(11),
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Sizer.hSize(12),
  },
  menuLabel: {
    flex: 1,
    minWidth: 0,
  },
  logoutWrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: Sizer.hSize(20),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(32),
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: Sizer.vSize(15),
    borderRadius: Sizer.hSize(14),
    ...SHADOWS.card,
  },
});
