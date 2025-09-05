import React from 'react';
import { Typography } from '../../atomComponents';
import { COLORS } from '../../globalStyle/Theme';

const Label = ({ title = '', ...props }) => {
  return (
    <Typography
      mT={20}
      mB={10}
      size={16}
      fFamily="barlowMedium500"
      color={COLORS.black100}
      {...props}
    >
      {title}
    </Typography>
  );
};

export default Label;
