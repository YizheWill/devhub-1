import React from 'react';
import { connect } from 'react-redux';
import {
  InputBase,
  makeStyles,
  fade,
  Button,
  Typography,
} from '@material-ui/core';

import { sendMessage } from '../../actions/message_actions';
import * as COLORS from '../../colors';

const useStyles = makeStyles((theme) => ({
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    verticalAlign: 'center',
  },
  baseInput: {
    width: '100%',
    verticalAlign: 'center',
    fontSize: 16,
    'label + &': {
      marginTop: theme.spacing(3),
    },
    '& > input': {
      borderRadius: 4,
      backgroundColor: '#f1f1f1',
      border: '1px solid #ced4da',
      fontSize: 16,
      fontWeight: 100,
      height: '2rempx',
      padding: '10px 12px',
      marginTop: 20,
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      '&:focus': {
        boxShadow: `${fade(COLORS.DEVBLUE, 0.25)} 0 0 0 0.2rem`,
        borderColor: COLORS.DEVBLUE,
      },
    },
  },
}));

const mapStateToProps = (state, _ownProps) => ({
  user: state.session.user,
});

const mapDispatchToProps = (dispatch) => ({
  sendMessage: (data) => dispatch(sendMessage(data)),
});

const MessageInput = ({ receiver, sendMessage }) => {
  const classes = useStyles();
  const [message, setMessage] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log('Body: ', e.currentTarget.value);
    sendMessage({ body: message, to: receiver._id });
    setMessage('');
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className={classes.inputContainer}>
      <InputBase
        /* multiline={true} */
        placeholder="Aa…"
        rows={2}
        style={{ padding: '0' }}
        className={classes.baseInput}
        value={message}
        onChange={(e) => setMessage(e.currentTarget.value)}
      />
      <Button
        /* onClick={(e) => handleSubmit(e)} */
        variant="contained"
        type="submit"
        style={{
          /* marginTop: '', */
          padding: '10px',
          marginTop: '15px',
          backgroundColor: COLORS.DEVBLUE,
          color: 'white',
        }}
      >
        <Typography>Send</Typography>
      </Button>
    </form>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageInput);
