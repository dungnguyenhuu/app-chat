import UserModel from "./../model/userModel";
import NotificationModel from "./../model/notificationModel";
const LIMIT_NUMBER_TAKEN = 10;

/* lấy 10 thông báo từ database */
let getNotifications = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId, LIMIT_NUMBER_TAKEN);

            let getNotifContents = notifications.map(async (notification) => {
                let sender = await UserModel.findUserById(notification.senderId);
                return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
            });

            // console.log(await Promise.all(getNotifContents));
            resolve(await Promise.all(getNotifContents));
        } catch (error) {
            reject(error);
        }
    });
};

/* tổng số thông báo chưa đọc từ database */
let countNotifUnread = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let notificationUnread = await NotificationModel.model.countNotifUnread(currentUserId);
            resolve(notificationUnread);
        } catch (error) {
            reject(error);
        }
    });
};

/* lấy thêm thông báo từ database */
let readMore = (currentUserId, skipNumberNotif) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newNotification = await NotificationModel.model.readMore(currentUserId, skipNumberNotif, LIMIT_NUMBER_TAKEN);
            
            let getNotifContents = newNotification.map(async (notification) => {
                let sender = await UserModel.findUserById(notification.senderId);
                return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
            });

            resolve(await Promise.all(getNotifContents));
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    getNotifications: getNotifications,
    countNotifUnread: countNotifUnread,
    readMore: readMore,
};
