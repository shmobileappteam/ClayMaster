import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { COLORS } from '../globalStyle/Theme';
import AppLoader from '../atomComponents/AppLoader';

/**
 * Full-screen dim overlay with a centered spinner card.
 * Content behind stays visible; touches are blocked while `visible`.
 * Uses the shared AppLoader (react-native ActivityIndicator).
 *
 * @param {'default'|'field'} [variant] — `field` for On-the-Course dark theme
 */
const ScreenOverlayLoader = ({
  visible = false,
  variant = 'default',
  color,
}) => {
  const isField = variant === 'field';
  const spinnerColor = color || COLORS.primary;

  return (
    <Modal
      visible={Boolean(visible)}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {}}
    >
      <View
        style={[styles.overlay, isField && styles.overlayField]}
        pointerEvents="auto"
      >
        <View style={[styles.spinnerCard, isField && styles.spinnerCardField]}>
          <AppLoader compact size="large" color={spinnerColor} />
        </View>
      </View>
    </Modal>
  );
};

export default ScreenOverlayLoader;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayField: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  spinnerCard: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  spinnerCardField: {
    backgroundColor: COLORS.courseSurface,
    borderWidth: 1,
    borderColor: COLORS.courseBorder,
    shadowOpacity: 0.35,
  },
});
