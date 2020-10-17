import mongoose from "mongoose";

let Schema = mongoose.Schema;

// lưu trữ thông tin liên lạc của giữa 2 người – chức năng kết bạn
let ContactSchema = new Schema({
    userId: String,                                 // id người gửi liên lạc (lời mời kết bạn)
    contactId: String,                              // id người được liên lạc (người nhận lời mời)
    status:{type: Boolean, default: false},         // trạng thái liên lạc (chưa xác nhận: false)
    createdAt: {type: Number, default: Date.now},   // ngày tạo, mặc định là thời gian khởi tạo
    updatedAt: {type: Number, default: null},       // ngày cập nhập, mặc định là null
    deletedAt: {type: Number, default: null}        // ngày xóa, mặc định là null
});

// các hàm thao tác với bảng contact trên MongoDB
ContactSchema.statics = {
    // tạo bản ghi mới
    createNew(item) {
        return this.create(item);
    },

    // tìm kiếm bạn bè đã kết bạn
    findAllByUser(userId) {
        return this.find({
            $or: [
                {"userId": userId},
                {"contactId": userId}
            ]
        }).exec();
    }
};

module.exports = mongoose.model("contact", ContactSchema);
