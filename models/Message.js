const mongoose = require('mongoose');

const GroupMessageSchema = new mongoose.Schema({
    from_user: { type: String, required: true },
    room: { type: String, required: true },
    message: { type: String, required: true },
    date_sent: { type: Date, default: Date.now }
});

module.exports.GroupMessage = mongoose.model('GroupMessage', GroupMessageSchema);

const PrivateMessageSchema = new mongoose.Schema({
    from_user: { type: String, required: true },
    to_user: { type: String, required: true },
    message: { type: String, required: true },
    date_sent: { type: Date, default: Date.now }
});

module.exports.PrivateMessage = mongoose.model('PrivateMessage', PrivateMessageSchema);
