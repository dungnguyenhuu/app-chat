import mongoose from "mongoose";

let Schema = mongoose.Schema;

// lưu các thông tin về 1 thông báo
let NotificationSchema = new Schema({
    
    sender: {                                       // người gửi thông báo
        id: String,
        username: String,
        avatar: String
    },
    
    receiver: {                                     //người nhận thông báo
        id: String,
        username: String,
        avatar: String
    },
    
    text: String,                                   // thể loại thông báo 
    
    content: String,                                // nội dung thông báo
    
    isRead: {type: Boolean, default: false},        // trạng thái của thông báo (chưa đọc: false)
    createdAt: {type: Number, default: Date.now}    // ngày tạo, mặc định là thời gian khởi tạo
});

module.exports = mongoose.model("notification", NotificationSchema);