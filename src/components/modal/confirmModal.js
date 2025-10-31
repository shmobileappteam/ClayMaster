import React from 'react';
import { Modal, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { COLORS, FONTS } from '../../globalStyle/Theme';
// import { LogoutSvg } from '../assets/svgs';

const ConfirmModal = ({
  visible,
  setVisibility = () => {},
  handleComplete = () => {},
  title = 'Are you sure you want to complete?',
  message = '',
  confirmText = 'Yes',
  cancelText = 'Cancel',
}) => {
  const handleClose = () => setVisibility(false);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          {/* <LogoutSvg /> */}
          <Text style={styles.heading}>{title}</Text>
          {!!message && <Text style={styles.message}>{message}</Text>}
          <View style={styles.btnView}>
            <Button text={cancelText} onPress={handleClose} />
            <Button
              text={confirmText}
              primary
              onPress={() => {
                handleComplete();
                setVisibility(false);
              }}
            />
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
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: primary ? COLORS.primary : COLORS.white100 },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text
          style={[
            styles.buttonText,
            { color: primary ? COLORS.white100 : '#C50E0E' },
          ]}
        >
          {text}
        </Text>
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
  modalView: {
    width: '100%',
    backgroundColor: COLORS.white100,
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    gap: 15,
  },
  heading: {
    fontSize: 17,
    color: '#0E0E0E',
    fontFamily: FONTS.barlowBold700,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#0E0E0E',
    fontFamily: FONTS.barlowMedium500,
    textAlign: 'center',
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
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.barlowMedium500,
    fontSize: 13,
  },
});

export default ConfirmModal;
