import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

const SalesData = ({ onBack }) => {
  const [groupedSales, setGroupedSales] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/sales`);
        const salesData = response.data;
        groupSalesByDrink(salesData);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSales();
  }, []);

  const groupSalesByDrink = (salesData) => {
    const grouped = salesData.reduce((acc, sale) => {
      const drink = sale.drink;
      const time = new Date(sale.time);
      const timeKey = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}`;

      if (!acc[drink]) {
        acc[drink] = {};
      }

      if (!acc[drink][timeKey]) {
        acc[drink][timeKey] = 0;
      }

      acc[drink][timeKey] += 1;

      return acc;
    }, {});

    setGroupedSales(grouped);
  };

  const handleExportData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/export`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sales_data.sqlite');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting sales data:', error);
    }
  };

  const handleClearDatabase = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/clear`);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error clearing database:', error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Sales Data
      </Typography>
      <Button variant="contained" color="secondary" onClick={onBack}>
        Back to Sales Tracker
      </Button>
      <Button variant="contained" color="primary" onClick={handleExportData} style={{ marginLeft: '10px' }}>
        Export Data
      </Button>
      <Button variant="contained" color="warning" onClick={handleOpenDialog} style={{ marginLeft: '10px' }}>
        Pulisci Database
      </Button>
      {Object.keys(groupedSales).map((drink) => (
        <Accordion key={drink}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${drink}-content`}
            id={`${drink}-header`}
          >
            <Typography>{drink} - Total: {Object.values(groupedSales[drink]).reduce((a, b) => a + b, 0)}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {Object.keys(groupedSales[drink]).map((time) => (
                <ListItem key={time}>
                  <ListItemText
                    primary={`Sold at: ${time}`}
                    secondary={`Quantity: ${groupedSales[drink][time]}`}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Sei sicuro di voler eliminare i dati dal database?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Ricorda di esportare i dati prima di pulire il database. Sei sicuro di voler procedere?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Annulla
          </Button>
          <Button onClick={handleClearDatabase} color="secondary" autoFocus>
            Pulisci DB
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SalesData;
