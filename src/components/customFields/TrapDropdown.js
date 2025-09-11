import React, { useState, useRef } from 'react';
import { TouchableOpacity, View, Modal, FlatList } from 'react-native';
//----
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import { Flex, Typography } from '../../atomComponents';

const TrapDropdown = ({
  options = [
    { id: 1, label: 'Trap 1', value: 'trap1' },
    { id: 2, label: 'Trap 2', value: 'trap2' },
    { id: 3, label: 'Trap 3', value: 'trap3' },
  ],
  selectedValue = null,
  onSelect,
  placeholder = 'Select Trap',
  containerStyle = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const buttonRef = useRef(null);

  const selectedOption = options.find(option => option.value === selectedValue);

  const handleToggle = () => {
    if (!isOpen) {
      buttonRef.current?.measure((x, y, width, height, pageX, pageY) => {
        setDropdownPosition({
          top: pageY + height + 5,
          left: pageX,
          width: width,
        });
      });
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = option => {
    setIsOpen(false);
    onSelect?.(option);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleSelect(item)}
      style={{
        paddingVertical: Sizer.vSize(12),
        paddingHorizontal: Sizer.hSize(16),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.grey100,
      }}
    >
      <Typography
        size={14}
        color={selectedValue === item.value ? COLORS.primary : COLORS.black100}
        fFamily={
          selectedValue === item.value
            ? 'barlowSemiBold600'
            : 'barlowRegular400'
        }
      >
        {item.label}
      </Typography>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        ref={buttonRef}
        onPress={handleToggle}
        style={{
          backgroundColor: COLORS.white100,
          borderWidth: 1,
          borderColor: isOpen ? COLORS.primary : COLORS.grey100,
          borderRadius: Sizer.hSize(8),
          paddingVertical: Sizer.vSize(12),
          paddingHorizontal: Sizer.hSize(16),
          minWidth: Sizer.hSize(120),
          ...containerStyle,
        }}
      >
        <Flex direction="row" jusContent="space-between" algItems="center">
          <Typography
            size={14}
            color={selectedOption ? COLORS.black100 : COLORS.grey200}
            fFamily={selectedOption ? 'barlowMedium500' : 'barlowRegular400'}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </Typography>
          {/* <AntDesign
            name={isOpen ? 'up' : 'down'}
            size={Sizer.hSize(12)}
            color={COLORS.grey200}
            style={{ marginLeft: Sizer.hSize(8) }}
          /> */}
        </Flex>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
          onPress={() => setIsOpen(false)}
        >
          <View
            style={{
              position: 'absolute',
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              backgroundColor: COLORS.white100,
              borderRadius: Sizer.hSize(8),
              borderWidth: 1,
              borderColor: COLORS.primary,
              maxHeight: 200,
              shadowColor: COLORS.black100,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <FlatList
              data={options}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              showsVerticalScrollIndicator={false}
              bounces={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default TrapDropdown;
