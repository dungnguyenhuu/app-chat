<<<<<<< HEAD
import mongoose from "mongoose";
import { stringify } from "uuid";
=======
import mongoose from "mongoose"
>>>>>>> revert1

let Schema = mongoose.Schema;

// lưu trữ các thông tin liên quan đến tin nhắn
let MessageSchema = new Schema({
    senderId: String,
    receiverId: String,
<<<<<<< HEAD
    coversationType: String,
=======
    conversationType: String,
>>>>>>> revert1
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
<<<<<<< HEAD
    // lấy tin nhắn
=======

    createNew(item) {
        return this.create(item);
    },

    // lấy tin nhắn cá nhân
>>>>>>> revert1
    getMessagesPersonal(senderId, receiverId, limit) {
        return this.find({
            $or: [
                {$and: [
                    {"senderId": senderId},
<<<<<<< HEAD
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
=======
                    {"receiverId": receiverId}
                ]},
                {$and: [
                    {"senderId": receiverId},
                    {"receiverId": senderId}
                ]}
            ]
        }).sort({"createdAt": -1}).limit(limit).exec();
    },

    // lấy tin nhắn trong nhóm 
    getMessagesGroup(groupId, limit) {
        return this.find({"receiverId": groupId}).sort({"createdAt": -1}).limit(limit).exec();
    },

    readMoreMessagesPersonal(senderId, receiverId, skip, limit) {
        return this.find({
            $or: [
                {$and: [
                    {"senderId": senderId},
                    {"receiverId": receiverId}
                ]},
                {$and: [
                    {"senderId": receiverId},
                    {"receiverId": senderId}
                ]}
            ]
        }).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
    },

    readMoreMessagesGroup(groupId, skip, limit) {
        return this.find({"receiverId": groupId}).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
    },
};

const MESSAGE_CONVERSATION_TYPE = {
    PERSONAL: "personal",   
    GROUP: "group"
};

const MESSAGE_TYPE = {
>>>>>>> revert1
    TEXT: "text",
    IMAGE: "image",
    FILE: "file",
};

module.exports = {
    model: mongoose.model("message", MessageSchema),
<<<<<<< HEAD
    conversationTypes: MESSAGE_CONVERSATION_TYPES,
    messageType: MESSAGE_TYPES,
=======
    conversationTypes: MESSAGE_CONVERSATION_TYPE,
    messageTypes: MESSAGE_TYPE,
>>>>>>> revert1
};
