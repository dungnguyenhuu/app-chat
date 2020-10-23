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
    },

    // kiểm tra 2 người có phải là bạn của nhau
    checkExists (userId, contactId) {
        return this.findOne({
            $or: [
                {$and: [
                    {"userId": userId},
                    {"contactId": contactId},
                ]},
                {$and: [
                    {"contactId": contactId},
                    {"userId": userId},
                ]}
            ]
        }).exec();
    },

    // xóa liên lạc giữa 2 người 
    removeRequestContact (userId, contactId) {
        return this.remove({
            $and: [
                {"userId": userId},
                {"contactId": contactId},
            ]
        }).exec();
    },

    // lấy users trong danh bạ
    getContacts(userId, limit){
        return this.find({
            $and: [
                {$or: [
                    {"userId": userId},
                    {"contactId": userId}
                ]},
                {"status": true},
            ]
        }).sort({"createdAt": -1}).limit(limit).exec();
    },

    // lấy tổng số user
    countAllContacts(userId) {
        return this.count({
            $and: [
                {$or: [
                    {"userId": userId},
                    {"contactId": userId}
                ]},
                {"status": true},
            ]
        }).exec();
    },

    // lấy users đã gửi lời mời (sent)
    getContactsSend(userId, limit){
        return this.find({
            $and: [
                {"userId": userId},
                {"status": false},
            ]
        }).sort({"createdAt": -1}).limit(limit).exec();
    },

    // lấy tổng số user
    countAllContactsSend(userId) {
        return this.count({
            $and: [
                {"userId": userId},
                {"status": false},
            ]
        }).exec();    
    },

    // lấy các lời mời đã nhận recevied
    getContactsRecevied(userId, limit){
        return this.find({
            $and: [
                {"contactId": userId},
                {"status": false},
            ]
        }).sort({"createdAt": -1}).limit(limit).exec();
    },

    // lấy tổng số user
    countAllContactsRecevied(userId) {
        return this.count({
            $and: [
                {"contactId": userId},
                {"status": false},
            ]
        }).exec();    
    },

};

module.exports = mongoose.model("contact", ContactSchema);
