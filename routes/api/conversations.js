const express = require('express');
const router = express.Router();
const passport = require('passport');

const { findOrCreateConversation } = require('./messages');
const Conversation = require('../../models/Conversation');
const User = require('../../models/User');
// const validateConversation = require('../../validation/conversations');

const getUsers = async (search) => {
  let users = await User.find({ name: new RegExp(search, 'i') });
  // return users && users.map((usr) => usr._id);
  return users;
};

// XXX: semi-broken lol
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const user = req.user;
    const otherUser = req.body.userId;

    try {
      return res.json({
        conversation: findOrCreateConversation(user._id, otherUser),
      });
    } catch (err) {
      return res.status(404).json(err);
    }
  }
);

// XXX: could add filtered search only for current conversations?
// https://stackoverflow.com/questions/11303294/querying-after-populate-in-mongoose
// needs to filter by participant name after populate, see $lookup
// const buildSearchFilter = async ({ search }) => {
//   if (search) {
//     let users = await getUsers(search);
//     return {
//       participants: { $in: users }
//     };
//   }
//   return [];
// };

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const user = req.user;
    // debugger;
    let filter = { participants: user._id };

    // If search query is passed, populate users
    let users = [];
    const { search } = req.query;
    if (search) {
      users = await getUsers(search);
      filter = {
        $and: [
          { participants: { $in: users.map((user) => user._id) } },
          filter,
        ],
      };
    }

    let conversations = await Conversation.find(filter)
      .populate('participants', 'name imageUrl')
      .populate('unreadBy', 'name')
      .sort({ createdAt: -1 })
      .then((conversations) => res.json({ conversations, users }))
      .catch((errors) => res.status(404).json(errors));

    return conversations;
  }
);

// Return the messages associated with conversation
// Marks the conversation as read by the current user
router.get(
  '/:conversationId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const userId = req.user._id;
    const { conversationId } = req.params;

    Conversation.findById(conversationId)
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
      .populate('unreadBy', 'name')
      .then((conversation) => {
        const messages = conversation.messages.slice();
        conversation.messages = messages.map((e) => e._id);

        // Mark conversation as read by current user if not already
        conversation.unreadBy = conversation.unreadBy.filter(
          (x) => !x._id.equals(userId)
        );
        conversation.save();

        res.json({ conversation, messages });
        // XXX: remove this after notifications are updated
        //   Message.updateMany({
        //     _id: conversation.messages,
        //     to: userId
        //   }, { read: true }, { new: true })
        //     .then(_ => Message.find({ _id: conversation.messages }))
        //     .catch(errors => res.status(404).json(errors));
        // })
        // .catch(errors => res.status(404).json(errors));
      })
      .catch((errors) => res.status(404).json(errors));
  }
);

module.exports = router;
