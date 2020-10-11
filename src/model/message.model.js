import mongoose from "mongoose";

let Schema = mongoose.Schema;

// lưu trữ các thông tin liên quan đến tin nhắn
let MessageSchema = new Schema({
    sender: {                                                      // người gửi
        id: String,
        username: String,
        avatar: String
    },
    receiver: {                                                     // người nhận
        id: String,
        username: String,
        avatar: String
    },
    
    text: String,                                                   // nội dung tin nhắn văn bản
    file: {data: Buffer, contentType: String, fileName: String},    // các file đính kém, hình ảnh,...

    createdAt: {type: Number, default: Date.now},                   // ngày tạo, mặc định là thời gian khởi tạo    
    updatedAt: {type: Number, default: null},                       // ngày cập nhập, mặc định là null    
    deletedAt: {type: Number, default: null}                        // ngày xóa, mặc định là null
});

module.exports = mongoose.model("message", MessageSchema);
