import mongoose from "mongoose";

let Schema = mongoose.Schema;

// lưu trữ thông tin liên quan đến nhóm chat
let ChatGroupSchema = new Schema({
    name: String,                                       // tên nhóm trò chuyện
    userAmount: {type: Number, min: 3, max: 100},       // số thành viên
    messageAmount: {type: Number, default: 0},          // tổng số tin nhắn
    userId: String,                                     // id người tạo nhóm
    members: [                                          // mảng chứa id các thành viên trong nhóm
        {userId: String}
    ],
    createdAt: {type: Number, default: Date.now},        // ngày tạo, mặc định là thời gian khởi tạo
    updatedAt: {type: Number, default: Date.now},            // ngày cập nhập, mặc định là null
    deletedAt: {type: Number, default: null}             // ngày xóa, mặc định là null
});

ChatGroupSchema.statics = {

    getChatGroups(userId, limit) {
        return this.find({
            "members": {$elemMatch: {"userId": userId}}
        }).sort({"updatedAt": -1}).limit(limit).exec();
    },
};

module.exports = mongoose.model("chat-group", ChatGroupSchema);
