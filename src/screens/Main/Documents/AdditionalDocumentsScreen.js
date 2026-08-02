import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import Icon from '../../../helpers/Icon';
import {
  COLORS,
  GLOBALSTYLE,
  SHADOWS,
  SPACING,
  TYPE,
} from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { getManualDeliveries } from '../../../api/academyService';
import {
  isPdfFile,
  mapManualDocument,
  openRemoteFile,
} from '../../../constants/academy';
import { showMessage } from '../../../utils';

/** ClayMaster-App-UI `AdditionalDocuments.tsx` → manual deliveries API */
const AdditionalDocumentsScreen = ({ navigation }) => {
  const { data, isLoading, isError, isFetching, refetch } = useCustomQuery({
    queryKey: ['manualDeliveries'],
    queryFn: getManualDeliveries,
  });

  const documents = useMemo(
    () => (data?.items || []).map(mapManualDocument).filter(Boolean),
    [data?.items],
  );

  const viewDoc = doc => {
    if (!doc.fileUrl) {
      showMessage({
        type: 'danger',
        title: 'Unavailable',
        message: 'No file is available for this item.',
      });
      return;
    }
    if (!isPdfFile(doc.type) && !isPdfFile(doc.fileUrl)) {
      showMessage({
        type: 'danger',
        title: 'PDF only',
        message: 'Only PDF files can be viewed in the app.',
      });
      return;
    }
    navigation.navigate('DrillDetailScreen', {
      drill: {
        id: doc.id,
        title: doc.title,
        fileUrl: doc.fileUrl,
        fileType: doc.type || 'pdf',
      },
    });
  };

  const downloadDoc = doc => {
    if (!isPdfFile(doc.type) && !isPdfFile(doc.fileUrl)) {
      showMessage({
        type: 'danger',
        title: 'PDF only',
        message: 'Only PDF files can be downloaded.',
      });
      return;
    }
    openRemoteFile(doc.fileUrl, Linking, showMessage);
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Documents"
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor={COLORS.primary}
          />
        }
      >
        <Typography
          size={TYPE.body.size}
          color={COLORS.textSecondary}
          mB={SPACING.component}
        >
          Reference materials, guides & templates
        </Typography>

        {isLoading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : isError ? (
          <TouchableOpacity onPress={refetch}>
            <Typography color={COLORS.primary} fFamily="barlowSemiBold600">
              Could not load documents. Tap to retry.
            </Typography>
          </TouchableOpacity>
        ) : documents.length === 0 ? (
          <Typography color={COLORS.textSecondary}>No documents yet.</Typography>
        ) : (
          documents.map(doc => (
            <View key={doc.id} style={[GLOBALSTYLE.screenCard, styles.docCard]}>
              <View style={styles.docHeader}>
                <View style={styles.docIcon}>
                  <Icon
                    name="document-text-outline"
                    iconFamily="Ionicons"
                    size={20}
                    color={COLORS.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Typography
                    fFamily="barlowSemiBold600"
                    size={TYPE.body.size}
                    color={COLORS.textPrimary}
                  >
                    {doc.title}
                  </Typography>
                  <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mT={2}>
                    {[doc.type, doc.category].filter(Boolean).join(' · ')}
                  </Typography>
                </View>
              </View>
              <View style={styles.docActions}>
                <TouchableOpacity
                  style={styles.viewBtn}
                  activeOpacity={0.88}
                  onPress={() => viewDoc(doc)}
                >
                  <Icon
                    name="eye-outline"
                    iconFamily="Ionicons"
                    size={14}
                    color={COLORS.white100}
                  />
                  <Typography
                    fFamily="barlowSemiBold600"
                    size={TYPE.caption.size}
                    color={COLORS.white100}
                    mL={6}
                  >
                    View
                  </Typography>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.downloadBtn}
                  activeOpacity={0.88}
                  onPress={() => downloadDoc(doc)}
                >
                  <Icon
                    name="download-outline"
                    iconFamily="Ionicons"
                    size={14}
                    color={COLORS.textPrimary}
                  />
                  <Typography
                    fFamily="barlowSemiBold600"
                    size={TYPE.caption.size}
                    color={COLORS.textPrimary}
                    mL={6}
                  >
                    Download
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </Container>
  );
};

export default AdditionalDocumentsScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(100),
    gap: Sizer.vSize(SPACING.component),
  },
  docCard: {
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizer.hSize(12),
  },
  docIcon: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: Sizer.hSize(20),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docActions: {
    flexDirection: 'row',
    gap: Sizer.hSize(12),
    marginTop: Sizer.vSize(12),
  },
  viewBtn: {
    flex: 1,
    height: Sizer.vSize(36),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadBtn: {
    flex: 1,
    height: Sizer.vSize(36),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderMuted,
    borderRadius: Sizer.hSize(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
});
