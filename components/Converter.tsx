import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { useState } from 'react';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import {
  AccountBalanceWalletRounded,
  ListAltRounded,
} from '@mui/icons-material';
import ConnectPopup from './ConnectPopup';
import { AnyAaaaRecord } from 'dns';

const CONVERSION_RATE = 3;

export default function Converter() {
  const [nepCurrency, setNepCurrency] = useState<string>('1');
  const [BUSDCurrency, setBUSDCurrency] = useState<string>(
    (1 * CONVERSION_RATE).toString()
  );

  const [popupOpen, setPopupOpen] = useState(false);

  const handleInputChange = (currency: string, value: string) => {
    if (!value.match(/^[0-9]*\.?[0-9]*$/gm)) return;
    if (value === '') {
      setNepCurrency(value);
      setBUSDCurrency(value);
      return;
    }
    const floatVal = parseFloat(value);
    switch (currency) {
      case 'NEP':
        setNepCurrency(value);
        if (floatVal === 0 || floatVal) {
          let val: any = floatVal * CONVERSION_RATE;
          if (val > parseInt(val)) val = val.toFixed(2);
          else val = val.toString();
          setBUSDCurrency(val);
        }
        return;

      case 'BUSD':
        setBUSDCurrency(value);
        if (floatVal === 0 || floatVal) {
          let val: any = floatVal / CONVERSION_RATE;
          if (val > parseInt(val)) val = val.toFixed(2);
          else val = val.toString();
          setNepCurrency(val);
        }
        return;

      default:
        return null;
    }
  };

  return (
    <Box
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      height={'100vh'}
      bgcolor={'darkcyan'}
    >
      <Card>
        <CardHeader
          title={<Typography variant="body1">Currency Convert</Typography>}
        />
        <CardContent style={{ padding: 20 }}>
          <Box
            display="flex"
            flexDirection={'column'}
            alignItems={'center'}
            gap={4}
            component="form"
          >
            <TextField
              className="rounded"
              color="secondary"
              label="NEP"
              value={nepCurrency}
              onChange={(e) => handleInputChange('NEP', e?.target?.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MonetizationOnIcon color="secondary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              className="rounded"
              label="BUSD"
              color="info"
              value={BUSDCurrency}
              onChange={(e) => handleInputChange('BUSD', e?.target?.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MonetizationOnIcon color="info" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </CardContent>
        <CardActions style={{ padding: 20, paddingBottom: 20 }}>
          <Button
            endIcon={<ListAltRounded />}
            variant="outlined"
            fullWidth
            style={{
              borderRadius: '40px',
              height: 40,
            }}
            onClick={() => setPopupOpen(true)}
          >
            View Wallet Details
          </Button>
        </CardActions>
      </Card>
      <ConnectPopup open={popupOpen} handleClose={() => setPopupOpen(false)} />
    </Box>
  );
}
