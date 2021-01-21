import {
  RECEIVE_SESSION_ERRORS,
  RECEIVE_CURRENT_USER,
  CLEAR_USER_ERRORS,
} from '../../actions/session_actions';

const _nullErrors = [];

export default (state = _nullErrors, action) => {
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_SESSION_ERRORS:
      return action.errors;
    case CLEAR_USER_ERRORS:
    case RECEIVE_CURRENT_USER:
      return _nullErrors;

    default:
      return state;
  }
};
