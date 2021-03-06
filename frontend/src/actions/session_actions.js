import * as APIUtil from '../util/session_api_util';
import jwt_decode from 'jwt-decode';

export const RECEIVE_USER_LOGOUT = 'RECEIVE_USER_LOGOUT';
export const RECEIVE_SESSION_ERRORS = 'RECEIVE_SESSION_ERRORS';
export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';
export const RECEIVE_USER_SIGN_IN = 'RECEIVE_USER_SIGN_IN';
export const CLEAR_USER_ERRORS = 'CLEAR_USER_ERRORS';
export const clearErrors = () => ({
  type: CLEAR_USER_ERRORS,
});

export const receiveUserSignIn = () => ({
  type: RECEIVE_USER_SIGN_IN,
});

export const receiveCurrentUser = (currentUser) => ({
  type: RECEIVE_CURRENT_USER,
  currentUser,
});

export const receiveErrors = (errors) => ({
  type: RECEIVE_SESSION_ERRORS,
  errors,
});

export const logoutUser = () => ({
  type: RECEIVE_USER_LOGOUT,
});

export const logout = () => (dispatch) => {
  localStorage.removeItem('jwtToken');
  APIUtil.setAuthToken(false);
  dispatch(logoutUser());
};

export const login = (user) => (dispatch) => {
  console.log('signing in');
  APIUtil.login(user)
    .then((res) => {
      console.log(`signin responded`);
      const { token } = res.data;
      localStorage.setItem('jwtToken', token);
      APIUtil.setAuthToken(token);
      const decoded = jwt_decode(token);
      dispatch(receiveUserSignIn());
      dispatch(receiveCurrentUser(decoded));
    })
    .catch((err) => dispatch(receiveErrors(err.response.data)));
};

export const signup = (user) => (dispatch) => {
  APIUtil.signup(user).then(
    (res) => {
      console.log('user signed up.');
      dispatch(login(user));
    },
    (err) => dispatch(receiveErrors(err.response.data))
  );
};

export const demoLogin = () => {
  return login({
    email: 'dev@dev.com',
    password: 'password',
  });
};
export const clearSessionErrors = () => (dispatch) => {
  dispatch(clearErrors());
};
