#! /usr/bin/env node
'use strict';

const mongoose = require('mongoose');
const db = require('../config/keys').mongoURI;
const path = require('path');

const Message = require('../models/Message');

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(async () => {
    console.log('Connected to MongoDB successfully');

    // Messages
    try {
      const messages = require('../data/messagedata.json');
      console.dir(messages);

      // Cleanup any bad data
      let res = await Message.deleteMany({ createdAt: null });
      if (res.ok === 1) {
        console.log('Removed messages with no timestamp');
      }

      const msgs = messages.map((msg) => new Message(msg));
      res = await Message.collection.insertMany(msgs);
    } catch (err) {
      // console.error(err.message);
      console.log('No message data... skipping seeding messages');
    }

    mongoose.connection.close();
  })
  .catch((err) => console.log(err));
