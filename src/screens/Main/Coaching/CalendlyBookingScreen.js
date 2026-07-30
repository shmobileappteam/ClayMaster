import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useQueryClient } from '@tanstack/react-query';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import { COLORS } from '../../../globalStyle/Theme';
import { showMessage } from '../../../utils';

/** Calendly confirmation after schedule, e.g. .../30min/invitees/<uuid> */
const isCalendlyInviteeConfirmation = uri => {
  if (!uri || typeof uri !== 'string') return false;
  try {
    const { pathname } = new URL(uri);
    return /\/invitees\/[0-9a-f-]{8,}/i.test(pathname);
  } catch {
    return /calendly\.com\/.+\/invitees\//i.test(uri);
  }
};

/** Lock pinch/double-tap zoom inside Calendly WebView */
const DISABLE_ZOOM_JS = `
(function() {
  var meta = document.querySelector('meta[name=viewport]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'viewport');
    document.head.appendChild(meta);
  }
  meta.setAttribute(
    'content',
    'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no'
  );
  document.addEventListener('gesturestart', function(e) { e.preventDefault(); }, { passive: false });
  true;
})();
`;

/**
 * In-app Calendly booking — route params: { url, title? }
 * Closes automatically when the invitees confirmation URL loads.
 */
const CalendlyBookingScreen = ({ navigation, route }) => {
  const url = route?.params?.url || null;
  const title = route?.params?.title || 'Book Session';
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const closedRef = useRef(false);

  const finishBooking = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;

    queryClient.invalidateQueries({ queryKey: ['sessions'] });
    showMessage({
      type: 'success',
      message: 'Session scheduled successfully.',
    });

    // Let the confirmation page paint briefly, then dismiss smoothly.
    setTimeout(() => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }, 600);
  }, [navigation, queryClient]);

  const handleNavChange = useCallback(
    navState => {
      if (isCalendlyInviteeConfirmation(navState?.url)) {
        finishBooking();
      }
    },
    [finishBooking],
  );

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title={title}
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
         showModeIndicator={false}
      />
      {!url ? ( 
        <View style={styles.centered}>
          <Typography color={COLORS.textSecondary} textAlign="center">
            No booking link available.
          </Typography>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Typography color={COLORS.textSecondary} textAlign="center">
            {error}
          </Typography>
        </View>
      ) : (
        <View style={styles.webWrap}>
          {loading && !closedRef.current ? (
            <View style={styles.loader}>
              <ActivityIndicator color={COLORS.primary} size="large" />
            </View>
          ) : null}
          <WebView
            source={{ uri: url }}
            style={styles.webview}
            onLoadStart={() => {
              setLoading(true);
              setError(null);
            }}
            onLoadEnd={() => setLoading(false)}
            onNavigationStateChange={handleNavChange}
            onError={() => {
              setLoading(false);
              setError('Could not load the booking page. Please try again.');
            }}
            onHttpError={() => {
              setLoading(false);
              setError('Could not load the booking page. Please try again.');
            }}
            injectedJavaScriptBeforeContentLoaded={DISABLE_ZOOM_JS}
            injectedJavaScript={DISABLE_ZOOM_JS}
            scalesPageToFit={false}
            setBuiltInZoomControls={false}
            setDisplayZoomControls={false}
            showsHorizontalScrollIndicator={false}
            startInLoadingState
            javaScriptEnabled
            domStorageEnabled
            sharedCookiesEnabled
            thirdPartyCookiesEnabled
            allowsBackForwardNavigationGestures
            setSupportMultipleWindows={false}
          />
        </View>
      )}
    </Container>
  );
};

export default CalendlyBookingScreen;

const styles = StyleSheet.create({
  webWrap: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: COLORS.mainBg,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    backgroundColor: COLORS.mainBg,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
