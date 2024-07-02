import React from 'react';
import { Button } from '@mui/material';

const DrinkButton = ({ drink, onClick }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      fullWidth
      onClick={() => onClick(drink)}
      style={{ height: '100px' }}
    >
      {drink}
    </Button>
  );
};

export default DrinkButton;