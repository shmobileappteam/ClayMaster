import React, { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
// import CustomModal from '../../Components/Modal/PopupModal';
import ConfirmModal from '../components/modal/confirmModal';
import { queryClient } from '../api/api';

const NetworkStateMonitor = () => {
  const [networkState, setNetworkState] = useState({
    isWifiEnabled: false,
    isConnected: false,
    isInternetReachable: false,
    connectionType: null,
    details: null,
  });

  const [showModal, setShowModal] = useState(false);

  const checkNetworkState = async () => {
    try {
      const state = await NetInfo.fetch();

      const newState = {
        isWifiEnabled: state.type === 'wifi',
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        connectionType: state.type,
        details: state.details,
      };

      setNetworkState(newState);

      // Show modal if there are connectivity issues
      const shouldShowModal =
        !newState.isConnected || newState.isInternetReachable === false;
      setShowModal(shouldShowModal);

      // Log detailed network state
      // console.log('Network State:', {
      //   isWifiEnabled: newState.isWifiEnabled,
      //   connectionType: newState.connectionType,
      //   isConnected: newState.isConnected,
      //   isInternetReachable: newState.isInternetReachable,
      //   wifiStrength: state.details?.strength,
      //   ssid: state.details?.ssid,
      //   ipAddress: state.details?.ipAddress
      // });
    } catch (error) {
      console.error('Error checking network state:', error);
    }
  };

  useEffect(() => {
    checkNetworkState();

    const unsubscribe = NetInfo.addEventListener(state => {
      const newState = {
        isWifiEnabled: state.type === 'wifi',
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        connectionType: state.type,
        details: state.details,
      };

      setNetworkState(newState);

      const shouldShowModal =
        !newState.isConnected || newState.isInternetReachable === false;

      if (shouldShowModal) {
        setShowModal(true);
      }
    });

    const intervalId = setInterval(checkNetworkState, 100000);
    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, []);

  const getNetworkMessage = () => {
    if (!networkState.isConnected) {
      return 'No network connection available.';
    }
    if (!networkState.isInternetReachable) {
      return `Connected to ${networkState.connectionType}, but internet is not reachable.`;
    }
    if (
      networkState.connectionType === 'wifi' &&
      networkState.details?.strength
    ) {
      return `WiFi connected (Signal strength: ${networkState.details.strength})`;
    }
    if (networkState.connectionType === 'cellular') {
      return 'Connected via cellular network.';
    }
    return 'Network connectivity issue detected.';
  };

  return (
    <ConfirmModal
      visible={showModal}
      title={`Network Status: ${networkState.connectionType || 'Unknown'}`}
      message={getNetworkMessage()}
      confirmText={networkState.isConnected ? 'Refresh' : ''}
      cancelText={networkState.isConnected ? 'OK' : 'Close'}
      handleCancel={() => setShowModal(false)}
      handleComplete={async () => {
        await queryClient.refetchQueries();
        setShowModal(false);
      }}
    />
    // <CustomModal
    //   visible={showModal}
    //   onClose={() => setShowModal(false)}
    //   type="internet"
    //   title={`Network Status: ${networkState.connectionType || 'Unknown'}`}
    //   message={getNetworkMessage()}
    //   btnTitle="OK"
    // />
  );
};

export default NetworkStateMonitor;
