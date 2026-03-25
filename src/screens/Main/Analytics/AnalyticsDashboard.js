import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList, TextInput, Switch } from 'react-native';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header, ScreenBanner, Button } from '../../../components';
import { BASEOPACITY, COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';

const TABS = [
  'VIDEO TUTORIAL',
  'WORKBOOK',
  'MANAGED SERVICE - ANALYTICS',
  'TOURNAMENT ANALYTICS'
];

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('VIDEO TUTORIAL');

  const renderContent = () => {
    switch (activeTab) {
      case 'VIDEO TUTORIAL': return <VideoTutorialTab />;
      case 'WORKBOOK': return <WorkbookTab />;
      case 'MANAGED SERVICE - ANALYTICS': return <ManagedServiceTab />;
      case 'TOURNAMENT ANALYTICS': return <TournamentAnalyticsTab />;
      default: return null;
    }
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <Header type="app" title="Analytics" isBackVisible={true} />
      
      <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        <ScreenBanner 
          title={activeTab}
          subtitle={getSubtitle(activeTab)}
        />

        <View style={styles.tabBarWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
            {TABS.map(tab => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
                onPress={() => setActiveTab(tab)}
              >
                <Typography 
                  size={12} 
                  fFamily="barlowBold700" 
                  color={activeTab === tab ? COLORS.primary : COLORS.black300}
                >
                  {tab}
                </Typography>
                {activeTab === tab && <View style={styles.activeUnderline} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={[GLOBALSTYLE.paddingHor, { marginTop: Sizer.vSize(16) }]}>
          <DigitalScorecardNotice />
          {renderContent()}
        </View>
      </ScrollView>
    </Container>
  );
};

const getSubtitle = (tab) => {
  if (tab === 'VIDEO TUTORIAL') return "Our Detailed Analytics Tool, Self Assessment and Pattern Analysis are all video-based learning tools.";
  if (tab === 'WORKBOOK') return "This is our Detailed Analytics Tool, which is our base, one-of-a-kind workbook based in MS Excel but customized with advanced VBA programming.";
  if (tab === 'MANAGED SERVICE - ANALYTICS') return "ClayMaster staff will do the analytics work—formatted 14-page report delivered to your folder in 2–4 days.";
  return "Instructional guide for NSCA class performance visualization using Benchmark Dot Plot with Stacks.";
};

const DigitalScorecardNotice = () => (
  <View style={styles.noticeCard}>
    <View style={styles.orangeBar} />
    <Flex direction="row" algItems="center">
      <Icon name="play-circle" iconFamily="Ionicons" size={28} color={COLORS.primary} />
      <View style={{ flex: 1, marginLeft: Sizer.hSize(16) }}>
        <Typography fFamily="barlowBold700" size={14} color={COLORS.black300}>DIGITAL SCORECARD – MOBILE APP</Typography>
        <Typography size={12} color={COLORS.black500} mT={4} lineHeight={18}>
          To use our Digital Scorecard, please use the ClayMaster Mobile App features.
        </Typography>
      </View>
    </Flex>
  </View>
);

const VideoTutorialTab = () => (
  <View style={{ marginTop: Sizer.vSize(24) }}>
    <Typography fFamily="barlowBold700" size={16} color={COLORS.black300} mB={16}>VIDEOS</Typography>
    <VideoRow title="SELF ASSESSMENT" size="123002.49 KB" progress={100} />
    <VideoRow title="DETAILED ANALYTICS TOOL – WORKBOOK" size="218821.51 KB" progress={45} />
    <VideoRow title="PATTERN ANALYSIS" size="51773.32 KB" progress={0} />
  </View>
);

const WorkbookTab = () => (
    <View style={{ marginTop: Sizer.vSize(24) }}>
      <Typography fFamily="barlowBold700" size={16} color={COLORS.black300} mB={16}>DOCUMENT</Typography>
      <DocRow title="DETAIL ANALYTICS TOOL – CLASSIC" size="2359.68 KB" type="excel" />
      <DocRow title="DETAIL ANALYTICS TOOL – PRO" size="2359.92 KB" type="excel" isLocked />
    </View>
);

const ManagedServiceTab = () => {
    const [isEuropean, setIsEuropean] = useState(false);
    return (
        <View style={{ marginTop: Sizer.vSize(24) }}>
          <View style={styles.whiteCard}>
              <Typography fFamily="barlowBold700" size={16} color={COLORS.black300} mB={16}>SUBMIT REQUEST</Typography>
              <InputField label="Squad Sequence *" placeholder="1" keyboardType="numeric" />
              <InputField label="Course Name *" placeholder="Course Name" />
              <InputField label="Class" placeholder="Select Class" isDropdown />
              <InputField label="People in Squad" placeholder="1" keyboardType="numeric" />
              
              <Flex direction="row" algItems="center" jusContent="space-between" mT={24}>
                  <Typography size={14} color={COLORS.black300} fFamily="barlowSemiBold600">European Rotation</Typography>
                  <Switch value={isEuropean} onValueChange={setIsEuropean} thumbColor={COLORS.white100} trackColor={{ true: COLORS.primary, false: COLORS.grey600 }} />
              </Flex>

              <TouchableOpacity style={styles.filePicker} activeOpacity={0.8}>
                  <Typography size={14} color={COLORS.grey200}>Choose File (No file chosen)</Typography>
                  <Icon name="cloud-upload-outline" iconFamily="Ionicons" size={24} color={COLORS.primary} />
              </TouchableOpacity>

              <Button label="SUBMIT REQUEST" mt={32} btnStyle={{ width: '100%' }} />
          </View>

          <View style={[styles.usageCard, { marginTop: Sizer.vSize(24) }]}>
            <Typography color={COLORS.white100} fFamily="barlowBold700" size={15} mB={24} textAlign="center">
              MANAGED SERVICE SESSIONS
            </Typography>
            
            {/* Visual Progress Indicator */}
            <View style={styles.usageProgressBarBg}>
                <View style={[styles.usageProgressBarFill, { width: '0%' }]} /> 
            </View>

            <Flex direction="row" jusContent="space-between" mT={20}>
              <StatCircle label="TOTAL" value="2" />
              <StatCircle label="USED" value="0" />
              <StatCircle label="REMAINING" value="2" />
            </Flex>
            <Typography color={'rgba(255,255,255,0.8)'} size={11} textAlign="center" mT={24} lineHeight={16}>
                ADDITIONAL ANALYTICS SESSIONS CAN BE PURCHASED FOR $75/SESSION.
            </Typography>
          </View>
        </View>
    );
}

const TournamentAnalyticsTab = () => (
    <View style={{ marginTop: Sizer.vSize(24) }}>
      <View style={styles.whiteCard}>
          <Typography fFamily="barlowBold700" size={16} color={COLORS.black300}>WORKBOOK DOCUMENTS</Typography>
          <Typography color={COLORS.black500} size={13} mT={4} mB={24}>Choose a document from the list to view its details.</Typography>
          <DocRow title="INSTRUCTION GUIDE 031526" size="250 KB" type="pdf" />
          <DocRow title="TOURNAMENT ANALYTICS 031526" size="180 KB" type="excel" />
      </View>
    </View>
);

/* ─── Shared UI Elements ───────────────────────────── */

const VideoRow = ({ title, size, progress = 0 }) => (
    <TouchableOpacity style={styles.cardRow} activeOpacity={0.88}>
        <View style={styles.iconBox}>
            <Icon name="play" iconFamily="Ionicons" size={24} color={COLORS.primary} style={{ marginLeft: 2 }} />
        </View>
        <View style={{ flex: 1, marginLeft: Sizer.hSize(16), marginRight: Sizer.hSize(12) }}>
            <Typography fFamily="barlowBold700" size={14} color={COLORS.black300} lineHeight={20}>{title}</Typography>
            <Typography size={12} color={COLORS.textMuted} mT={6}>
              {progress > 0 ? `${progress}% completed` : size}
            </Typography>
            <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.min(100, progress)}%`,
                      backgroundColor:
                        progress === 100 ? '#2E7D32' : progress === 0 ? 'transparent' : COLORS.primary,
                    },
                  ]}
                />
            </View>
        </View>
        <Icon name="chevron-forward" iconFamily="Ionicons" size={20} color={COLORS.grey200} />
    </TouchableOpacity>
);

const DocRow = ({ title, size, type, isLocked }) => (
    <TouchableOpacity style={styles.cardRow} activeOpacity={0.8}>
        <View style={[styles.iconBox, { backgroundColor: type === 'excel' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(204, 34, 0, 0.1)' }]}>
            <Icon 
                name={type === 'excel' ? "stats-chart" : "document-text"} 
                iconFamily="Ionicons" 
                size={24} 
                color={type === 'excel' ? "#2E7D32" : "#CC2200"} 
            />
        </View>
        <View style={{ flex: 1, marginLeft: Sizer.hSize(16), marginRight: Sizer.hSize(12) }}>
            <Typography fFamily="barlowBold700" size={14} color={COLORS.black300} lineHeight={18}>{title}</Typography>
            <Typography size={12} color={COLORS.black500} mT={6}>SIZE: {size}</Typography>
        </View>
        {isLocked ? (
            <Icon name="lock-closed" iconFamily="Ionicons" size={20} color={COLORS.grey200} />
        ) : (
            <Icon name="download-outline" iconFamily="Ionicons" size={24} color={COLORS.primary} />
        )}
    </TouchableOpacity>
);

const InputField = ({ label, placeholder, isDropdown, ...props }) => (
    <View style={{ marginTop: Sizer.vSize(20) }}>
        <Typography size={13} color={COLORS.black300} fFamily="barlowSemiBold600" mB={8}>{label}</Typography>
        <View style={styles.inputBox}>
            <Typography color={COLORS.black400} size={14}>{placeholder}</Typography>
            {isDropdown && <Icon name="chevron-down" iconFamily="Ionicons" size={20} color={COLORS.black400} />}
        </View>
    </View>
);

const StatCircle = ({ label, value }) => (
    <View style={{ alignItems: 'center' }}>
        <View style={styles.statCircleBadge}>
            <Typography color={COLORS.primary} fFamily="barlowBold700" size={18}>{value}</Typography>
        </View>
        <Typography color={'rgba(255,255,255,0.9)'} size={11} fFamily="barlowBold700" mT={10}>{label}</Typography>
    </View>
);

export default AnalyticsDashboard;

const styles = StyleSheet.create({
  tabBarWrapper: {
    backgroundColor: COLORS.white100,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabScroll: {
    paddingHorizontal: Sizer.hSize(18),
  },
  tabItem: {
    paddingHorizontal: Sizer.hSize(16),
    paddingVertical: Sizer.vSize(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabItem: {
  },
  activeUnderline: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 3,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  noticeCard: {
    backgroundColor: COLORS.white100,
    borderRadius: Sizer.hSize(12),
    padding: Sizer.hSize(20),
    marginTop: Sizer.vSize(8),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  orangeBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: COLORS.primary,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Sizer.hSize(16),
    marginBottom: Sizer.vSize(16),
    backgroundColor: COLORS.white100,
    borderRadius: Sizer.hSize(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  iconBox: {
    width: Sizer.hSize(48),
    height: Sizer.hSize(48),
    borderRadius: Sizer.hSize(10),
    backgroundColor: 'rgba(235, 108, 15, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#EFEFEF',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  usageProgressBarBg: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  usageProgressBarFill: {
    height: '100%',
    backgroundColor: COLORS.white100,
  },
  whiteCard: {
      backgroundColor: COLORS.white100,
      borderRadius: Sizer.hSize(12),
      padding: Sizer.hSize(24),
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      borderWidth: 1,
      borderColor: '#F0F0F0',
  },
  inputBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: Sizer.vSize(50),
      borderWidth: 1,
      borderColor: '#D4D4D4',
      borderRadius: Sizer.hSize(10),
      paddingHorizontal: Sizer.hSize(16),
      backgroundColor: '#FAFAFA',
  },
  filePicker: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: Sizer.vSize(24),
      padding: Sizer.hSize(16),
      borderWidth: 1,
      borderColor: '#EFEFEF',
      borderStyle: 'dashed',
      borderRadius: Sizer.hSize(10),
      backgroundColor: '#FAFAFA',
      height: Sizer.vSize(56),
  },
  usageCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: Sizer.hSize(16),
    padding: Sizer.hSize(24),
    elevation: 4,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  statCircleBadge: {
    width: Sizer.hSize(48),
    height: Sizer.hSize(48),
    borderRadius: Sizer.hSize(24),
    backgroundColor: COLORS.white100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  }
});
