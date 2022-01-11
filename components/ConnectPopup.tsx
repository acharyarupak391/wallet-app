import { forwardRef, Fragment, useEffect, useRef, useState } from 'react';

import { formatEther } from '@ethersproject/units';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from '@web3-react/frame-connector';
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Slide,
  Typography,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { Injected } from '@utils/connectors';
import {
  AccountBalanceWalletRounded,
  AddLinkRounded,
  LinkOffRounded,
} from '@mui/icons-material';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface PopupModalProps {
  open: boolean;
  handleClose: () => any;
}

export default function ConnectPopup({ open, handleClose }: PopupModalProps) {
  const [balance, setBalance] = useState('N/A');

  const { active, account, library, activate, deactivate, chainId, error } =
    useWeb3React();

  const [isLoading, setIsLoading] = useState(false);

  async function connect() {
    setIsLoading(true);
    try {
      await activate(Injected);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  async function disconnect() {
    deactivate();
  }

  useEffect(() => {
    console.log({
      active,
      account,
      library,
      activate,
      deactivate,
      chainId,
      error,
    });
    if (library) {
      library.eth
        .getBalance(account)
        .then((data: string) => setBalance(data))
        .catch((err: any) => console.log(err));
    }
  }, [active, account, library, activate, deactivate, chainId, error]);

  const handleWalletConnect = async () => {
    setIsLoading(true);
    await connect();
  };

  const handleWalletDisconnect = async () => {
    await disconnect();
  };

  const handleClosePopup = () => {
    setIsLoading(false);
    handleClose();
  };

  const DetailsList = () => (
    <Box display="flex" flexDirection="column" gap={1}>
      <Grid container>
        <Grid xs={6} item>
          <Typography fontSize={16} fontFamily="monospace">
            <b>Key</b>
          </Typography>
        </Grid>
        <Grid xs={6} item>
          <Typography fontSize={16} fontFamily="monospace">
            <b>Value</b>
          </Typography>
        </Grid>
      </Grid>
      <Divider />
      <Grid container rowGap={2}>
        <Grid xs={6} item>
          Account
        </Grid>
        <Grid xs={6} item>
          <b>
            {account?.slice(0, 6)}...
            {account?.slice(account.length - 4)}
          </b>
        </Grid>
        <Divider variant="fullWidth" />
        <Grid xs={6} item>
          Chain ID
        </Grid>
        <Grid xs={6} item>
          <b>{chainId}</b>
        </Grid>

        <Grid xs={6} item>
          Balance
        </Grid>
        <Grid xs={6} item>
          <b>{balance}</b>
        </Grid>
      </Grid>
    </Box>
  );

  const Buttons = () => (
    <>
      {active ? (
        <Button
          style={{
            borderRadius: '40px',
            height: 40,
          }}
          variant="contained"
          color="error"
          fullWidth
          onClick={() => handleWalletDisconnect()}
          endIcon={<LinkOffRounded />}
        >
          DisConnect
        </Button>
      ) : (
        <>
          <Button
            style={{
              borderRadius: '40px',
              height: 40,
              padding: 20,
            }}
            variant="contained"
            onClick={() => handleWalletConnect()}
            endIcon={
              !isLoading && <AccountBalanceWalletRounded fontSize="medium" />
            }
            disabled={isLoading}
          >
            {isLoading ? (
              <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                Connecting{' '}
                <CircularProgress color="inherit" size={20} thickness={4} />
              </p>
            ) : (
              'Connect to wallet'
            )}
          </Button>
          <Button
            style={{
              borderRadius: '40px',
              height: 40,
            }}
            onClick={handleClosePopup}
          >
            Cancel
          </Button>
        </>
      )}
    </>
  );

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClosePopup}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>
        <Typography variant="h5" fontSize={22}>
          Wallet Details
        </Typography>
      </DialogTitle>
      <DialogContent style={{ minWidth: 400 }}>
        <DialogContentText id="alert-dialog-slide-description">
          {active ? (
            <DetailsList />
          ) : (
            <>
              {!error ? (
                <Typography variant="caption" fontSize={16}>
                  <p>You are not connected to any wallet.</p>
                  <p>Connect to see details.</p>
                </Typography>
              ) : (
                <Typography variant="subtitle1" color="error">
                  <p>
                    <b>Oops! Error occured</b>
                  </p>
                  <p>{error?.message}</p>
                </Typography>
              )}
            </>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ paddingBottom: 18, marginTop: 10 }}>
        <Buttons />
      </DialogActions>
    </Dialog>
  );
}
