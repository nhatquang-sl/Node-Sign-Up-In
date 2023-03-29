import React from 'react';
import { useSelector } from 'react-redux';
import { selectSessionById } from 'store/sessions-slice';
import jwtDecode from 'jwt-decode';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Icon,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Slide,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { RootState } from 'store';
import { TokenData } from 'shared/user';
import { TIMESTAMP } from 'shared/constant';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type SessionDetailProps = {
  sessionId: number;
  onClose(): void;
};

const DetailItem = (props: {
  icon: string;
  primary: string | null | undefined;
  secondary?: string;
}) => {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          <Icon>{props.icon}</Icon>
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        sx={{ overflowWrap: 'anywhere' }}
        primary={props.primary}
        secondary={props.secondary}
      />
    </ListItem>
  );
};

const SessionDetail = (props: SessionDetailProps) => {
  let atDecoded: TokenData = new TokenData();
  let rtDecoded: TokenData = new TokenData();
  const session = useSelector((state: RootState) => selectSessionById(state, props.sessionId));
  if (session) {
    atDecoded = jwtDecode<TokenData>(session?.accessToken ?? '');
    rtDecoded = jwtDecode<TokenData>(session?.refreshToken ?? '');
    console.log({ decoded: atDecoded });
  }

  return (
    <Dialog
      open={props.sessionId > 0}
      maxWidth="md"
      TransitionComponent={Transition}
      keepMounted
      onClose={props.onClose}
    >
      <DialogContent>
        <List>
          <DetailItem
            icon="account_circle"
            primary={`${atDecoded.firstName} ${atDecoded.lastName}`}
          />
          <DetailItem icon="alternate_email" primary={atDecoded.emailAddress} />
          <DetailItem
            icon="accessibility"
            primary={session?.accessToken}
            secondary={`${new Date(
              atDecoded.iat * TIMESTAMP.SECOND
            ).toLocaleString()} -> ${new Date(atDecoded.exp * TIMESTAMP.SECOND).toLocaleString()}`}
          />
          <DetailItem
            icon="refresh"
            primary={session?.refreshToken}
            secondary={`${new Date(
              rtDecoded.iat * TIMESTAMP.SECOND
            ).toLocaleString()} -> ${new Date(rtDecoded.exp * TIMESTAMP.SECOND).toLocaleString()}`}
          />
          <DetailItem icon="laptop_mac" primary={session?.userAgent} />
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionDetail;
