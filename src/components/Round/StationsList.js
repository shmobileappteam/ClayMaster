import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { stationsData } from '../../constants/dummydata';
import StationCard from './StationCard';

import Sizer from '../../helpers/Sizer';

const StationsList = ({ data = [], contStyle = {} }) => {
  const [expandedStations, setExpandedStations] = useState({});

  const toggleStation = stationId => {
    setExpandedStations(prev => ({
      ...prev,
      [stationId]: !prev[stationId],
    }));
  };


  return data.map(station => (
    <StationCard
      key={station.id}
      station={station}
      isExpanded={expandedStations[station.id]}
      onToggle={() => toggleStation(station.id)}
    />
  ));
};

export default StationsList;
