import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
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
import { LIBRARY_DOCUMENTS } from '../../../constants/libraryContent';

/** ClayMaster-App-UI `AdditionalDocuments.tsx` */
const AdditionalDocumentsScreen = ({ navigation }) => (
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
    >
      <Typography size={TYPE.body.size} color={COLORS.textSecondary} mB={SPACING.component}>
        Reference materials, guides & templates
      </Typography>
      {LIBRARY_DOCUMENTS.map(doc => (
        <View key={doc.title} style={[GLOBALSTYLE.screenCard, styles.docCard]}>
          <View style={styles.docHeader}>
            <View style={styles.docIcon}>
              <Icon name="document-text-outline" iconFamily="Ionicons" size={20} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Typography fFamily="barlowSemiBold600" size={TYPE.body.size} color={COLORS.textPrimary}>
                {doc.title}
              </Typography>
              <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mT={2}>
                {doc.type} · {doc.size} · {doc.category}
              </Typography>
            </View>
          </View>
          <View style={styles.docActions}>
            <TouchableOpacity style={styles.viewBtn} activeOpacity={0.88}>
              <Icon name="eye-outline" iconFamily="Ionicons" size={14} color={COLORS.white100} />
              <Typography fFamily="barlowSemiBold600" size={TYPE.caption.size} color={COLORS.white100} mL={6}>
                View
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.88}>
              <Icon name="download-outline" iconFamily="Ionicons" size={14} color={COLORS.textPrimary} />
              <Typography fFamily="barlowSemiBold600" size={TYPE.caption.size} color={COLORS.textPrimary} mL={6}>
                Download
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  </Container>
);

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
