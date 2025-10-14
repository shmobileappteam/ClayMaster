import { View } from 'react-native';
import { Flex, Typography } from '../../../atomComponents';
import Sizer from '../../../helpers/Sizer';
import { COLORS } from '../../../globalStyle/Theme';

const TableRow = ({ label, value, isLast = false }) => {
  return (
    <View>
      <Flex
        direction="row"
        jusContent="space-between"
        algItems="center"
        extraStyle={{
          paddingVertical: Sizer.vSize(10),
          paddingHorizontal: Sizer.hSize(20),
        }}
      >
        <Typography size={16} fFamily="barlowSemiBold600">
          {label}
        </Typography>

        <Typography size={16} fFamily="barlowSemiBold600">
          {value}
        </Typography>
      </Flex>

      {!isLast && (
        <View
          style={{
            height: Sizer.vSize(1),
            backgroundColor: COLORS.primary,
            marginHorizontal: Sizer.hSize(1),
          }}
        />
      )}
    </View>
  );
};

export default TableRow;
