import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';

// import {
//   useIAP,
// requestPurchase,
// getStorefront,
// ErrorCode,
// type Purchase,
// type PurchaseError,
// } from 'react-native-iap';
import { Typography } from '../../../atomComponents';

const InAppSubscriptionScreen = () => {
  //   const { connected, products, fetchProducts, finishTransaction } = useIAP({
  // onPurchaseSuccess: async (purchase) => {
  //     console.log('✅ Purchase successful:', {
  //         productId: purchase.productId,
  //         transactionId: purchase.transactionId,
  //         purchaseState: purchase.purchaseState,
  //     });

  //     // setLastPurchase(purchase);
  //     // setPurchaseResult('Purchase successful! Verifying with server...');

  //     // try {

  //     //     const verificationResult = await verifyPurchaseWithServer(purchase);

  //     //     if (verificationResult.success) {

  //     //         setPurchaseResult('✅ Purchase verified and saved!');
  //     //         Alert.alert(
  //     //             'Success!',
  //     //             'Your purchase has been verified and activated.',
  //     //         );

  //     //     } else {

  //     //         setPurchaseResult(
  //     //             `⚠️ Verification failed: ${verificationResult.message}`,
  //     //         );
  //     //         Alert.alert(
  //     //             'Verification Failed',
  //     //             verificationResult.message ||
  //     //             'Could not verify purchase. Please contact support.',
  //     //         );
  //     //     }
  //     // } catch (error) {
  //     //     console.error('❌ Server verification error:', error);
  //     //     setPurchaseResult('❌ Could not verify with server');
  //     //     Alert.alert(
  //     //         'Error',
  //     //         'Failed to verify purchase. Your purchase is safe, please contact support if issue persists.',
  //     //     );
  //     // } finally {
  //     //     // ────────────────────────────────────────────────────────────────────
  //     //     // ALWAYS FINISH THE TRANSACTION
  //     //     // ────────────────────────────────────────────────────────────────────
  //     //     const isConsumable = CONSUMABLE_SET.has(purchase.productId ?? '');
  //     //     try {
  //     //         await finishTransaction({
  //     //             purchase,
  //     //             isConsumable,
  //     //         });
  //     //         console.log('✅ Transaction finished');
  //     //     } catch (finishError) {
  //     //         console.error('❌ Failed to finish transaction:', finishError);
  //     //     }

  //     //     setIsProcessing(false);
  //     // }
  // },

  //     onPurchaseError: error => {
  //       console.error('❌ Purchase error:', error);
  //       // setIsProcessing(false);

  //       // Don't show alert for user cancellation
  //       // if (error.code === ErrorCode.UserCancelled) {
  //       //     setPurchaseResult('Purchase cancelled');
  //       //     return;
  //       // }

  //       // setPurchaseResult(`Purchase failed: ${error.message}`);
  //       // Alert.alert('Purchase Failed', error.message);
  //     },
  //   });

  // useEffect(() => {

  //     try {
  //         if (connected) {

  //             fetchProducts({ skus: "claymaster_monthly", type: 'in-app' })
  //                 .then((products) => {
  //                     console.log('✅ Products fetched successfully', products);
  //                 })
  //                 .catch((error) => {
  //                     console.error('❌ Error fetching products:', error);
  //                 });
  //         }

  //     } catch (err) {
  //         console.log(err);

  //     }
  // }, [connected, fetchProducts]);
  return (
    <View>
      <Text>InAppSubscriptionScreen</Text>
    </View>
  );
};

export default InAppSubscriptionScreen;

const styles = StyleSheet.create({});
