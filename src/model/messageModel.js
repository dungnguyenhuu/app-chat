import mongoose from "mongoose";
import { stringify } from "uuid";

let Schema = mongoose.Schema;

// lưu trữ các thông tin liên quan đến tin nhắn
let MessageSchema = new Schema({
    senderId: String,
    receiverId: String,
    coversationType: String,
    messageType: String,
    sender: {                                                      // người gửi
        id: String,
        name: String,
        avatar: String
    },
    receiver: {                                                     // người nhận
        id: String,
        name: String,
        avatar: String
    },
    
    text: String,                                                   // nội dung tin nhắn văn bản
    file: {data: Buffer, contentType: String, fileName: String},    // các file đính kém, hình ảnh,...

    createdAt: {type: Number, default: Date.now},                   // ngày tạo, mặc định là thời gian khởi tạo    
    updatedAt: {type: Number, default: null},                       // ngày cập nhập, mặc định là null    
    deletedAt: {type: Number, default: null}                        // ngày xóa, mặc định là null
});

MessageSchema.statics = {
    // lấy tin nhắn
    getMessagesPersonal(senderId, receiverId, limit) {
        return this.find({
            $or: [
                {$and: [
                    {"senderId": senderId},
                    {"receiverId": receiverId},
                ]},
                {$and: [
                    {"senderId": receiverId},
                    {"receiverId": senderId},
                ]},
            ]
        }).sort({"createdAt": 1}).limit(limit).exec();
    },

    getMessagesInGroup(groupId, limit){
        return this.find({"receiverId": groupId}).sort({"createdAt": 1}).limit(limit).exec();
    },
};

const MESSAGE_CONVERSATION_TYPES = {
    PERSONAL: "personal",
    GROUP: "group",
};

const MESSAGE_TYPES = {
    TEXT: "text",
    IMAGE: "image",
    FILE: "file",
};

module.exports = {
    model: mongoose.model("message", MessageSchema),
    conversationTypes: MESSAGE_CONVERSATION_TYPES,
    messageType: MESSAGE_TYPES,
};
