import React, { useState } from 'react';
import { Container, Grid, Typography, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import DrinkButton from './DrinkButton';
import SalesData from './SalesData';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const drinks = [
  'Negroni', 'Gin Tonic', 'gin/vodka lemon', 'vodka red bull', 'long island',
  'mojito', 'aperol spritz', 'Campari spritz', 'sex on the Beach', 'Pina colada',
  'negroni sbagliato', 'vino bianco calice', 'vino rosso calice', 'Disaronno sour',
  'margarita', 'Martini', 'Manhattan', 'paloma', 'birra 1', 'birrra 2',
  'Old fashioned', 'Moscow Mule', 'Boulevardier', 'Americano'
];

function App() {
  const [viewSales, setViewSales] = useState(false);

  const handleButtonClick = async (drink) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/sales`, { drink });
    } catch (error) {
      console.error('Error saving sales data:', error);
    }
  };

  const toggleView = () => {
    setViewSales(!viewSales);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Grid container alignItems="center" justifyContent="center" spacing={2} style={{ marginTop: '20px' }}>
          <Grid item>
            <img src='/BIANCO.png' alt='logo' style={{ height: '80px' }} />
          </Grid>
          <Grid item>
            <Typography variant="h2" gutterBottom align="center">
              BULLISH BAR SALES TRACKER
            </Typography>
          </Grid>
        </Grid>
        <Button variant="contained" color="secondary" onClick={toggleView}>
          {viewSales ? 'Back to Sales Tracker' : 'View Sales Data'}
        </Button>
        {viewSales ? (
          <SalesData onBack={toggleView} />
        ) : (
          <Grid container spacing={3}>
            {drinks.map((drink) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={drink}>
                <DrinkButton drink={drink} onClick={handleButtonClick} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
