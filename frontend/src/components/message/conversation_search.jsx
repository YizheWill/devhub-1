import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { makeStyles, fade } from '@material-ui/core/styles';
import { InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import * as COLORS from '../../colors';
import { fetchConversations } from '../../actions/conversation_actions';

const useStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    borderRadius: '15px',
    backgroundColor: fade(COLORS.NAVBARBLACK, 0.05),
    '&:hover': {
      backgroundColor: fade(COLORS.NAVBARBLACK, 0.03),
    },
    width: '100%',
    marginRight: theme.spacing(2),
    marginBottom: 5,
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const mapDispatchToProps = (dispatch) => ({
  fetchConversations: (filter) => dispatch(fetchConversations(filter)),
});

const ConversationSearch = ({ fetchConversations }) => {
  const classes = useStyles();
  const [search, setSearch] = React.useState('');

  // debouncing .3 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchConversations({ search });
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
        />
      </div>
    </>
  );
};

export default connect(null, mapDispatchToProps)(ConversationSearch);
