import React from 'react';
import { Modal, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { COLORS, FONTS } from '../../globalStyle/Theme';

const ConfirmModal = ({
  visible,
  setVisibility = () => {},
  handleComplete = () => {},
  handleCancel = () => {},
  title = 'Are you sure you want to complete?',
  message = '',
  confirmText = 'Yes',
  cancelText = 'Cancel',
  /** `field` = dark Field Mode theme */
  variant = 'default',
  /** Show spinner on confirm; blocks dismiss while true */
  confirmLoading = false,
  /** Set false to keep modal open after confirm (e.g. async submit with confirmLoading) */
  dismissOnConfirm = true,
}) => {
  const isField = variant === 'field';

  const handleClose = () => {
    if (confirmLoading) return;
    handleCancel?.();
    setVisibility(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={[styles.modalOverlay, isField && styles.modalOverlayField]}>
        <View style={[styles.modalView, isField && styles.modalViewField]}>
          <Text style={[styles.heading, isField && styles.headingField]}>
            {title}
          </Text>
          {!!message && (
            <Text style={[styles.message, isField && styles.messageField]}>
              {message}
            </Text>
          )}
          <View style={styles.btnView}>
            {!!cancelText && (
              <Button
                text={cancelText}
                onPress={handleClose}
                field={isField}
                disabled={confirmLoading}
              />
            )}
            {!!confirmText && (
              <Button
                text={confirmText}
                primary
                field={isField}
                loading={confirmLoading}
                disabled={confirmLoading}
                onPress={() => {
                  if (confirmLoading) return;
                  handleComplete();
                  if (dismissOnConfirm) setVisibility(false);
                }}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const Button = ({
  text = '',
  primary = false,
  onPress = () => {},
  loading = false,
  disabled = false,
  field = false,
}) => {
  const bg = primary
    ? COLORS.primary
    : field
      ? COLORS.courseSurface
      : COLORS.white100;
  const color = primary
    ? COLORS.white100
    : field
      ? COLORS.courseTextMuted
      : '#C50E0E';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: bg },
        field && !primary && styles.buttonFieldSecondary,
        (loading || disabled) && styles.buttonDisabled,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={[styles.buttonText, { color }]}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
  },
  modalOverlayField: {
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  modalView: {
    width: '100%',
    backgroundColor: COLORS.white100,
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    gap: 15,
  },
  modalViewField: {
    backgroundColor: COLORS.courseSurface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.courseBorder,
  },
  heading: {
    fontSize: 17,
    color: '#0E0E0E',
    fontFamily: FONTS.barlowBold700,
    textAlign: 'center',
  },
  headingField: {
    color: COLORS.white100,
  },
  message: {
    fontSize: 14,
    color: '#0E0E0E',
    fontFamily: FONTS.barlowMedium500,
    textAlign: 'center',
  },
  messageField: {
    color: COLORS.courseTextMuted,
  },
  btnView: {
    width: '100%',
    flexDirection: 'row',
    gap: 15,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 11,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonFieldSecondary: {
    borderWidth: 1,
    borderColor: COLORS.courseBorder,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.barlowMedium500,
    fontSize: 13,
  },
});

export default ConfirmModal;
