const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Message',
        default: [],
      },
    ],
    unreadBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = Conversation = mongoose.model(
  'Conversation',
  ConversationSchema
);
