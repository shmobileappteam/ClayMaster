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

/** ClayMaster-App-UI `Videos.tsx` — category list, not academy tabs */
const CATEGORIES = [
  { name: 'Chandelle', count: 8 },
  { name: 'Crosser', count: 12 },
  { name: 'Tower', count: 6 },
  { name: 'Battue', count: 5 },
  { name: 'Rabbit', count: 4 },
  { name: 'Teal', count: 7 },
];

const InstructionalVideosScreen = ({ navigation }) => {
  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Training Videos"
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Typography
          size={TYPE.body.size}
          color={COLORS.textSecondary}
          lineHeight={TYPE.body.lineHeight}
          mB={16}
        >
          Select a category to browse videos
        </Typography>
        <View style={styles.list}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.name}
              style={[GLOBALSTYLE.screenCard, styles.categoryCard]}
              onPress={() => navigation.navigate('VideoDetailScreen')}
              activeOpacity={0.88}
            >
              <View>
                <Typography
                  fFamily="barlowSemiBold600"
                  size={TYPE.body.size}
                  color={COLORS.textPrimary}
                >
                  {cat.name}
                </Typography>
                <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mT={2}>
                  {cat.count} videos
                </Typography>
              </View>
              <Icon
                name="chevron-forward"
                iconFamily="Ionicons"
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Container>
  );
};

export default InstructionalVideosScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(100),
  },
  list: {
    gap: Sizer.vSize(SPACING.component),
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
});
