import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { stationsData } from '../../constants/dummydata';
import StationCard from './StationCard';

import Sizer from '../../helpers/Sizer';

const StationsList = ({
  data = [],
  contStyle = { paddingBottom: Sizer.hSize(70) },
}) => {
  const [expandedStations, setExpandedStations] = useState({});

  const toggleStation = stationId => {
    setExpandedStations(prev => ({
      ...prev,
      [stationId]: !prev[stationId],
    }));
  };

  const totalHits = stationsData.reduce(
    (sum, station) => sum + station.hits,
    0,
  );
  const totalMissed = stationsData.reduce(
    (sum, station) => sum + station.missed,
    0,
  );
  const totalShots = stationsData.reduce(
    (sum, station) => sum + station.totalShots,
    0,
  );

  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={contStyle}
      >
        {data.map(station => (
          <StationCard
            key={station.id}
            station={station}
            isExpanded={expandedStations[station.id]}
            onToggle={() => toggleStation(station.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default StationsList;
