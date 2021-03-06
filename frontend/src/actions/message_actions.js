import * as MessageAPI from '../util/message_api_util';

export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';
export const RECEIVE_MESSAGES = 'RECEIVE_MESSAGES';
export const REMOVE_MESSAGE = 'REMOVE_MESSAGE';
export const RECEIVE_MESSAGE_ERRORS = 'RECEIVE_MESSAGE_ERRORS';
export const CLEAR_MESSAGE_ERRORS = 'CLEAR_MESSAGE_ERRORS';

export const clearMessageErrors = () => ({
  type: CLEAR_MESSAGE_ERRORS,
});

export const receiveMessageErrors = (errors) => ({
  type: RECEIVE_MESSAGE_ERRORS,
  errors,
});

// export const removeMessage = (messageId) => ({
//   type: REMOVE_MESSAGE,
//   messageId,
// });

export const receiveMessages = (messages) => ({
  type: RECEIVE_MESSAGES,
  messages,
});

export const receiveMessage = (payload) => ({
  type: RECEIVE_MESSAGE,
  payload,
});

// Fetches all messages (sent and received) for current user
export const fetchMessages = (filter) => (dispatch) => {
  return MessageAPI.fetchMessages(filter)
    .then((messages) => {
      // dispatch(clearMessageErrors());
      dispatch(receiveMessages(messages.data));
    })
    .catch((errors) => receiveMessageErrors(errors));
};

// Send a message from the current user
// data must include { to: receiver_id, body: String }
export const sendMessage = (data) => (dispatch) => {
  return MessageAPI.createMessage(data)
    .then((message) => dispatch(receiveMessage(message.data)))
    .catch((errors) => receiveMessageErrors(errors.response.data));
};

// export const deleteMessage = (messageId) => (dispatch) => {
//   return MessageAPI.deleteMessage(messageId).then((message) =>
//     dispatch(removeMessage(message.data))
//   );
// };

export const updateMessage = (message) => (dispatch) => {
  return MessageAPI.updateMessage(message)
    .then((res) => dispatch(receiveMessage(res.data)))
    .catch((errors) => dispatch(receiveMessageErrors(errors.response.data)));
};

// XXX: remove toggles, toggle conversation instead?
export const toggleMessageRead = (messageId) => (dispatch) => {
  return dispatch(
    updateMessage({
      _id: messageId,
      toggleRead: true,
    })
  );
};

// Toggles all messages in thread between current user and
// other user (either receiver or sender of messageId) as un/read
export const toggleThreadRead = (messageId, read = true) => (dispatch) => {
  return MessageAPI.toggleThread(messageId, { read })
    .then((res) => dispatch(receiveMessages(res.data)))
    .catch((errors) => dispatch(receiveMessageErrors(errors.response.data)));
};
