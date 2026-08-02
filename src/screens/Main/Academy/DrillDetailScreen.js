import React, { useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Pdf from 'react-native-pdf';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import CourseLayout from '../../../components/course/CourseLayout';
import CourseHeader from '../../../components/course/CourseHeader';
import Icon from '../../../helpers/Icon';
import { COLORS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { openRemoteFile } from '../../../constants/academy';
import { showMessage } from '../../../utils';

/** In-app PDF viewer with system Download (same as Download File). */
const DrillDetailScreen = ({ navigation, route }) => {
  const fieldMode = route?.params?.fieldMode === true;
  const drill = route?.params?.drill;
  const uri = drill?.fileUrl || drill?.file_url || route?.params?.url || null;
  const title = drill?.title || route?.params?.title || 'Practice Drill';
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const onDownload = () => openRemoteFile(uri, Linking, showMessage);

  const downloadBar = uri ? (
    <View style={[styles.downloadBar, fieldMode && styles.downloadBarField]}>
      <TouchableOpacity
        style={[styles.downloadBtn, fieldMode && styles.downloadBtnField]}
        activeOpacity={0.88}
        onPress={onDownload}
      >
        <Icon
          name="download-outline"
          iconFamily="Ionicons"
          size={16}
          color={fieldMode ? COLORS.white100 : COLORS.textPrimary}
        />
        <Typography
          fFamily="barlowSemiBold600"
          size={13}
          color={fieldMode ? COLORS.white100 : COLORS.textPrimary}
          mL={6}
        >
          Download
        </Typography>
      </TouchableOpacity>
    </View>
  ) : null;

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
      {downloadBar}
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
  downloadBar: {
    paddingHorizontal: Sizer.hSize(16),
    paddingVertical: Sizer.vSize(10),
    backgroundColor: COLORS.mainBg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderMuted || '#E5E5E5',
  },
  downloadBarField: {
    backgroundColor: COLORS.courseBg,
    borderBottomColor: COLORS.courseBorder,
  },
  downloadBtn: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizer.hSize(14),
    height: Sizer.vSize(36),
    borderRadius: Sizer.hSize(10),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderMuted || '#DDD',
    backgroundColor: COLORS.surface || '#FFF',
  },
  downloadBtnField: {
    borderColor: COLORS.courseBorder,
    backgroundColor: COLORS.courseSurface,
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
