import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Typography } from '../../atomComponents';
import Icon from '../../helpers/Icon';
import { MISS_CATEGORIES } from '../../constants/missCategories';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';

const MissOverlay = ({ visible, onClose, onSelect }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Typography
            fFamily="barlowBold700"
            size={20}
            color={COLORS.white100}
            textAlign="center"
            mB={8}
          >
            Tag your miss
          </Typography>
          <Typography
            size={14}
            color={COLORS.courseTextMuted}
            textAlign="center"
            mB={20}
          >
            How did you miss this shot?
          </Typography>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.grid}>
              {MISS_CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor: cat.colorBg,
                      borderColor: cat.colorBorder,
                    },
                  ]}
                  onPress={() => onSelect(cat.id)}
                  activeOpacity={0.9}
                >
                  <Icon
                    name={cat.icon}
                    iconFamily="Ionicons"
                    size={24}
                    color={cat.accent}
                  />
                  <Typography
                    fFamily="barlowBold700"
                    size={16}
                    color={cat.accent}
                    mT={8}
                  >
                    {cat.short}
                  </Typography>
                  <Typography size={12} color="rgba(255,255,255,0.6)" mT={4}>
                    {cat.desc}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={styles.skipBtn}>
            <Typography size={14} color={COLORS.courseTextMuted}>
              Skip tagging
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default MissOverlay;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.courseBg,
    borderTopLeftRadius: Sizer.hSize(20),
    borderTopRightRadius: Sizer.hSize(20),
    paddingHorizontal: Sizer.hSize(20),
    paddingTop: Sizer.vSize(12),
    paddingBottom: Sizer.vSize(32),
    maxHeight: '85%',
  },
  handle: {
    width: Sizer.hSize(40),
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.courseBorder,
    alignSelf: 'center',
    marginBottom: Sizer.vSize(16),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizer.hSize(12),
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    borderRadius: Sizer.hSize(12),
    borderWidth: 2,
    padding: Sizer.hSize(16),
  },
  skipBtn: {
    alignItems: 'center',
    marginTop: Sizer.vSize(16),
    paddingVertical: Sizer.vSize(12),
  },
});
