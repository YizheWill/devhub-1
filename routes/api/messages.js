const express = require('express');
const router = express.Router();
const passport = require('passport');

const Message = require('../../models/Message');
const Conversation = require('../../models/Conversation');
const User = require('../../models/User');

const validateMessage = require('../../validation/messages');
// const validateConversation = require('../../validation/conversations');

// filter to return all user's sent/received messages
const userMessages = (userId) => ({
  $or: [{ to: userId }, { from: userId }],
});

// Find or create conversation b/w users
// If there isn't already a conversation, a new one is created and
// each user's conversation array is updated
// the order of users isn't important
const findOrCreateConversation = async (user1, user2) => {
  let conversation = await Conversation.findOne({
    $and: [{ participants: user1 }, { participants: user2 }],
  })
    .populate({
      path: 'messages',
      options: {
        sort: { createdAt: 1 },
      },
      populate: {
        path: 'from',
        select: 'name imageUrl',
      },
    })
    .populate('participants', 'name imageUrl')
    .populate('unreadBy', 'name');

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [user1, user2],
    });

    await User.updateMany(
      { _id: { $in: conversation.participants } },
      { $push: { conversations: conversation._id } },
      { new: true }
    );
  }

  return conversation;
};

const addMessageToConversation = async (from, message, conversation) => {
  conversation.messages.push(message._id);
  if (conversation.unreadBy.includes(from)) {
    conversation.unreadBy = conversation.participants.slice();
  } else {
    conversation.unreadBy = conversation.participants.filter(
      (x) => !x.equals(from)
    );
  }
  return conversation.save();
};

// Returns both the newly created message and new/updated conversation
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    // const { errors, isValid } = validateMessage(req.body);

    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }

    const userFrom = req.user._id;
    const userTo = req.body.to;

    try {
      let conversation = await findOrCreateConversation(userFrom, userTo);
      let message = await Message.create({
        ...req.body,
        from: userFrom,
        conversation: conversation._id,
      });

      // Need from field populated for chat
      message = await Message.findById(message._id).populate(
        'from',
        'name imageUrl'
      );

      addMessageToConversation(userFrom, message, conversation);
      return res.json({ conversation, message });
    } catch (err) {
      console.log('ERRORR: ', err);
      return res.status(404).json(err);
    }
  }
);

router.patch(
  '/:messageId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { messageId } = req.params;

    Message.findById(messageId, function (err, message) {
      if (err) return res.status(404).json(err);

      // no need to verify if just toggling read status
      if (req.body.toggleRead) {
        message.read = !message.read;
      } else {
        const { errors, isValid } = validateMessage(req.body);
        if (!isValid) {
          return res.status(400).json(errors);
        }
        message.body = req.body;
      }
      return message
        .save()
        .then((msg) => res.json(msg))
        .catch((err) => res.status(404).json(err));
    });
  }
);

// Index returns all messages for currently logged in user (sent and received)
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const user = req.user;
    const { userId, name } = req.query;

    // create filter for a conversation with user
    let filter = userId ? userMessages(userId) : {};

    Message.find({
      ...userMessages(user._id),
      ...filter,
    })
      .populate('from', 'name')
      .populate('to', 'name')
      .sort({ createdAt: -1 })
      .then((messages) => res.json(messages))
      .catch((error) => res.status(404).json(error));
  }
);

// router.get('/:messageId', (req, res) => {
//   Message.findById(req.params.messageId)
//     .populate('to', 'name')
//     .populate('from', 'name')
//     .then((message) => res.json(message))
//     .catch((_err) => res.status(404).json({ message: 'Message not found' }));
// });

// router.delete(
//   '/:messageId',
//   passport.authenticate('jwt', { session: false }),
//   (req, res) => {
//     const { messageId } = req.params;
//     Message.findByIdAndRemove(messageId)
//       .then((message) => {
//         if (!message) res.status(404).json({ message: 'Message bad' });
//         else res.json(message);
//       })
//       .catch((err) => res.status(400).json(err));
//   }
// );

// FIXME: update to use conversations
// Toggle entire thread with other user containing `messageId` as un/read
// if `read` is not passed in request body, then by default thread is marked as read
router.post(
  '/thread/:messageId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { messageId } = req.params;
    const user = req.user;
    const markRead = 'read' in req.body ? req.body.read : true;

    Message.findById(messageId, function (err, msg) {
      if (err) return res.status(404).json(err);

      const otherUser = msg.to === req.user._id ? msg.from : msg.to;
      const filter = {
        ...userMessages(user._id),
        ...userMessages(otherUser._id),
      };

      return Message.updateMany(filter, { read: markRead }, { new: true })
        .then((_) =>
          Message.find(filter).then((messages) => res.json(messages))
        )
        .catch((errors) => res.status(404).json(errors));
    });
  }
);

module.exports = {
  router,
  userMessages,
  findOrCreateConversation,
  addMessageToConversation,
};
