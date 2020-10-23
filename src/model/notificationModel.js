import mongoose from "mongoose";

let Schema = mongoose.Schema;

// lưu các thông tin về 1 thông báo
let NotificationSchema = new Schema({
    senderId: String,                                       // người gửi thông báo    
    receiverId: String,                                     //người nhận thông báo
    type: String,                                  // thể loại thông báo 
    isRead: {type: Boolean, default: false},        // trạng thái của thông báo (chưa đọc: false)
    createdAt: {type: Number, default: Date.now}    // ngày tạo, mặc định là thời gian khởi tạo
});

NotificationSchema.statics = {
    // tạo bản ghi mới
    createNew(item) {
        return this.create(item);
    },
    // xóa thông báo kết bạn giữa 2 người 
    removeReqContactNotification (senderId, receiverId, type) {
        return this.remove({
            $and: [
                {"senderId": senderId},
                {"receiverId": receiverId},
                {"type": type},
            ]
        }).exec();
    },

    // lấy một số thông báo mới nhất để hiện thị
    getByUserIdAndLimit(userId, limit) {
        return this.find({"receiverId": userId}).sort({"createdAt": -1}).limit(limit).exec();
    },

    // tổng số thông báo chưa đọc
    countNotifUnread(userId){
        return this.count({
            $and: [
                {"receiverId": userId},
                {"isRead": false},
            ]
        }).exec();
    },

    // lấy thêm thông báo
    readMore(userId, skip, limit) {
        return this.find({"receiverId": userId}).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
    },

    // đánh dấu đã đọc tất cả các thông báo
    markAllAsRead(userId, targetUsers) {
        return this.updateMany(
            {$and: [
                {"receiverId": userId},
                {"senderId": {$in: targetUsers}},
            ]},
            {"isRead": true}
        ).exec();
    },
};

const NOTIFICATION_TYPES = {
    ADD_CONTACT: "add_contact",
};

const NOTIFICATION_CONTENTS = {
    getContent: (notificationType, isRead, userId, username, userAvatar) => {
        if(notificationType === NOTIFICATION_TYPES.ADD_CONTACT) {
            if(!isRead) {
                return `<div class="notif-readed-false" data-uid="${ userId }">
                            <img class="avatar-small" src="images/users/${ userAvatar }" alt=""> 
                            <strong>${ username }</strong> đã gửi lời mời kết bạn cho bạn!
                        </div>`;
            }

            return `<div data-uid="${ userId }">
                            <img class="avatar-small" src="images/users/${ userAvatar }" alt=""> 
                            <strong>${ username }</strong> đã gửi lời mời kết bạn cho bạn!
                        </div>`;
        };
        return "No matching witj any notification type";
    },
};

module.exports = {
    model: mongoose.model("notification", NotificationSchema),
    types: NOTIFICATION_TYPES,
    contents: NOTIFICATION_CONTENTS,
};
