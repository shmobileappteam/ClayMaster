import { StyleSheet } from 'react-native';
//-----
import { SafeAreaWrapper } from '../../../atomComponents';
import SuccessMessage from '../../../components/SuccessMessage/SuccessMessage';
import { CommonActions } from '@react-navigation/native';
import { COLORS } from '../../../globalStyle/Theme';

const SubscribtionSuccessScreen = ({ navigation }) => {
  return (
    <SafeAreaWrapper
      keyboardAvoiding
      backgroundColor={COLORS.mainBg}
      contentStyle={{ justifyContent: 'center', alignItem: 'center' }}
    >
      <SuccessMessage
        title="Subscription Activated!"
        message="Welcome to the premium experience! Your subscription is now active."
        buttonLabel="Continue"
        onPress={() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'BottomTabs' }],
            }),
          );
        }}
      />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({});

export default SubscribtionSuccessScreen;
