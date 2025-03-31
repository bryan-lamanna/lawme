import React from 'react';
import { CircularProgress, Box } from '@mui/material'; // Se estiver usando Material-UI

const LoadingScreen = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingScreen;