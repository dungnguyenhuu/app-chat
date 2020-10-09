import mongoose from "mongoose";

let Schema = mongoose.Schema;

let NotificationSchema = Schema({
    sender: {
        id: String,
        username: String,
        avatar: String
    },
    receiver: {
        id: String,
        username: String,
        avatar: String
    },
    text: String,
    content: String,
    isRead: {type: Boolean, default: false},
    createdAt: {type: Number, default: Date.now}
});

module.exports = mongoose.model("notification", NotificationSchema);