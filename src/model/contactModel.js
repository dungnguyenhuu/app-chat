import mongoose from "mongoose";
import { user } from "../services";

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
                    {"userId": contactId},
                    {"contactId": userId},
                ]}
            ]
        }).exec();
    },

    // hủy bỏ liên lạc bên tab danh bạ
    removeContact (userId, contactId) {
        // console.log(userId);
        // console.log(contactId);

        return this.remove({
            $or: [
                {$and: [
                    {"userId": userId},
                    {"contactId": contactId},
                    {"status": true}
                ]},
                {$and: [
                    {"userId": contactId},
                    {"contactId": userId},
                    {"status": true}
                ]}
            ]
        }).exec();
    },

    // xóa yêu cầu ở tab tìm kiếm và tab đang chờ xác nhận 
    removeRequestContactSent (userId, contactId) {
        return this.remove({
            $and: [
                {"userId": userId},
                {"contactId": contactId},
                {"status": false}
            ]
        }).exec();
    },

     // xóa yêu cầu ở tab yêu cầu kết bạn 
     removeRequestContactRecevied (userId, contactId) {
        return this.remove({
            $and: [
                {"contactId": userId},
                {"userId": contactId},
                {"status": false}
            ]
        }).exec();
    },

     // chấp nhận yêu cầu ở tab yêu cầu kết bạn 
     approveRequestContactRecevied (userId, contactId) {
        return this.update({
            $and: [
                {"contactId": userId},
                {"userId": contactId},
                {"status": false},
            ]
        }, {"status": true}).exec();
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

    // lấy tổng số user trong danh bạ
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

    // lấy thêm user bên tab danh bạ
    readMoreContacts(userId, skip, limit){
        return this.find({
            $and: [
                {$or: [
                    {"userId": userId},
                    {"contactId": userId}
                ]},
                {"status": true},
            ]
        }).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
    },

    // lấy user bên tab đang chờ xác nhận
    getContactsSend(userId, limit){
        return this.find({
            $and: [
                {"userId": userId},
                {"status": false},
            ]
        }).sort({"createdAt": -1}).limit(limit).exec();
    },

    // lấy tổng số user bên tab đang chờ xác nhận
    countAllContactsSend(userId) {
        return this.count({
            $and: [
                {"userId": userId},
                {"status": false},
            ]
        }).exec();    
    },

    // lấy thêm user bên tab đang chờ xác nhận
    readMoreContactsSent(userId, skip, limit){
        return this.find({
            $and: [
                {"userId": userId},
                {"status": false},
            ]
        }).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
    },

    // lấy user bên tab yêu cầu kết bạn
    getContactsRecevied(userId, limit){
        return this.find({
            $and: [
                {"contactId": userId},
                {"status": false},
            ]
        }).sort({"createdAt": -1}).limit(limit).exec();
    },

    // tổng user trong yêu cầu kết bạn
    countAllContactsRecevied(userId) {
        return this.count({
            $and: [
                {"contactId": userId},
                {"status": false},
            ]
        }).exec();    
    },

    // lấy thêm user bên tab yêu cầu kết bạn
    readMoreContactsReceived(userId, skip, limit){
        return this.find({
            $and: [
                {"contactId": userId},
                {"status": false},
            ]
        }).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
    },

};

module.exports = mongoose.model("contact", ContactSchema);
