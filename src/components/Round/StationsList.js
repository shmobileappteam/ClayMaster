import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { formatApiStations, stationsData } from '../../constants/dummydata';
import StationCard from './StationCard';

import Sizer from '../../helpers/Sizer';

const StationsList = ({ data = [], contStyle = {} }) => {
  const [expandedStations, setExpandedStations] = useState({});

  const stations = formatApiStations(data || []);

  const toggleStation = stationId => {
    setExpandedStations(prev => ({
      ...prev,
      [stationId]: !prev[stationId],
    }));
  };

  return stations.map((station, index) => (
    <StationCard
      key={index}
      station={station}
      isExpanded={expandedStations[station?.station_number]}
      onToggle={() => toggleStation(station?.station_number)}
      isDisabled={true}
    />
  ));
};

export default StationsList;
