import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import Pdf from 'react-native-pdf';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import CourseLayout from '../../../components/course/CourseLayout';
import CourseHeader from '../../../components/course/CourseHeader';
import { COLORS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';

/** In-app PDF viewer for practice drills (and reusable for other docs). */
const DrillDetailScreen = ({ navigation, route }) => {
  const fieldMode = route?.params?.fieldMode === true;
  const drill = route?.params?.drill;
  const uri = drill?.fileUrl || drill?.file_url || route?.params?.url || null;
  const title = drill?.title || route?.params?.title || 'Practice Drill';
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const header = fieldMode ? (
    <CourseHeader title={title} showBack onBack={() => navigation.goBack()} />
  ) : (
    <LibraryHeader
      title={title}
      showBack
      showNotification={false}
      onBack={() => navigation.goBack()}
    />
  );

  const body = !uri ? (
    <View style={styles.centered}>
      <Typography color={COLORS.textSecondary} textAlign="center">
        No PDF available for this drill.
      </Typography>
    </View>
  ) : (
    <View style={styles.viewer}>
      {loading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      ) : null}
      {error ? (
        <View style={styles.centered}>
          <Typography color={COLORS.textSecondary} textAlign="center">
            {error}
          </Typography>
        </View>
      ) : (
        <Pdf
          source={{ uri, cache: true }}
          style={styles.pdf}
          trustAllCerts={false}
          onLoadComplete={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError('Unable to open this PDF. Check your connection and try again.');
          }}
        />
      )}
    </View>
  );

  if (fieldMode) {
    return (
      <CourseLayout showTabs={false}>
        {header}
        {body}
      </CourseLayout>
    );
  }

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      {header}
      {body}
    </Container>
  );
};

export default DrillDetailScreen;

const styles = StyleSheet.create({
  viewer: {
    flex: 1,
    backgroundColor: COLORS.surfaceMuted || '#F0EDE8',
  },
  pdf: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.mainBg,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Sizer.hSize(24),
  },
});
