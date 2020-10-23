import ContactModel from "./../model/contactModel";
import UserModel from "./../model/userModel";
import NotificationModel from "./../model/notificationModel";
import _ from "lodash";
import { resolveInclude } from "ejs";

const LIMIT_NUMBER_TAKEN = 8;

// tìm kiếm người dùng để kết bạn
let findUsersContact = (currentUserId, keyword) => {
    return new Promise (async (resolve, reject) => {
        // mảng id những người đã là bạn của currentUserId (người gửi yêu cầu kết bạn)
        let deprecatedUserIds = [currentUserId];
        // tìm kiếm những người đã là bạn của currentUserId (người gửi yêu cầu kết bạn)
        // gọi findAllByUser() ở ContactModel
        let contactByUser = await ContactModel.findAllByUser(currentUserId);
        contactByUser.forEach((contact) => {
            deprecatedUserIds.push(contact.userId);
            deprecatedUserIds.push(contact.contactId);
        });

        // lọc các id trùng nhau
        deprecatedUserIds = _.unionBy(deprecatedUserIds);
        // tìm kiếm người dùng theo keyword và tránh người có trong mảng deprecatedUserIds
        // gọi findAllForAddContact() ở UserModel
        let users = await UserModel.findAllForAddContact(deprecatedUserIds, keyword);
        resolve(users);        
    });
};

// thêm liên lạc vào danh bạ
let addNew = (currentUserId, contactId) => {
    return new Promise (async (resolve, reject) => {
        // kiểm tra 2 user đã là bạn nhau chưa
        // gọi checkExists() ở ContactModel
        let contactExists = await ContactModel.checkExists(currentUserId, contactId);
        if (contactExists){ // nếu tồn tại thì trả về false
            return reject(false);
        };

        let newContactItem =  {
            userId: currentUserId,
            contactId: contactId,
        };
        // tạo 1 liên lạc giữa 2 user
        // gọi createNew() ở ContactModel
        let newContact = await ContactModel.createNew(newContactItem);

        // tạo thông báo khi gửi lời mời kết bạn
        let notificationItem = {
            senderId: currentUserId, 
            receiverId: contactId, 
            type: NotificationModel.types.ADD_CONTACT, 
        };
        await NotificationModel.model.createNew(notificationItem);

        resolve(newContact);
    });
};

// hủy yêu cầu kết bạn
let removeRequestContact = (currentUserId, contactId) => {
    return new Promise (async (resolve, reject) => {
        // gọi removeRequestContact() ở ContactModel
        let removeReq = await ContactModel.removeRequestContact(currentUserId, contactId);
        if(removeReq.result === 0) {
            return reject(false);
        };

        // xóa thông báo
        await NotificationModel.model.removeReqContactNotification(currentUserId, contactId, NotificationModel.types.ADD_CONTACT);

        resolve(true);
    });
};

let getContacts = (currentUserId) => {
    return new Promise (async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContacts(currentUserId, LIMIT_NUMBER_TAKEN);
            let users = contacts.map(async (contact) => {
                if(contact.contactId == currentUserId) {
                    return await UserModel.findUserById(contact.userId);
                } else {
                    return await UserModel.findUserById(contact.contactId);
                }
            });

            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};

let countAllContacts = (currentUserId) => {
    return new Promise (async (resolve, reject) => {
        try {
            let count = await ContactModel.countAllContacts(currentUserId, LIMIT_NUMBER_TAKEN);
            resolve(count);
        } catch (error) {
            reject(error);
        }
    });
};

let getContactsSend = (currentUserId) => {
    return new Promise (async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContactsSend(currentUserId, LIMIT_NUMBER_TAKEN);
            let users = contacts.map(async (contact) => {
                return await UserModel.findUserById(contact.contactId);
            });

            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};

let countAllContactsSend = (currentUserId) => {
    return new Promise (async (resolve, reject) => {
        try {
            let count = await ContactModel.countAllContactsSend(currentUserId, LIMIT_NUMBER_TAKEN);
            resolve(count);
        } catch (error) {
            reject(error);
        }
    });
};

let getContactsRecevied = (currentUserId) => {
    return new Promise (async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContactsRecevied(currentUserId, LIMIT_NUMBER_TAKEN);
            let users = contacts.map(async (contact) => {
                return await UserModel.findUserById(contact.userId);
            });

            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};

let countAllContactsRecevied = (currentUserId) => {
    return new Promise (async (resolve, reject) => {
        try {
            let count = await ContactModel.countAllContactsRecevied(currentUserId, LIMIT_NUMBER_TAKEN);
            resolve(count);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    findUsersContact: findUsersContact,
    addNew: addNew,
    removeRequestContact: removeRequestContact,
    getContacts: getContacts,
    getContactsSend: getContactsSend,
    getContactsRecevied: getContactsRecevied,
    countAllContacts: countAllContacts,
    countAllContactsSend: countAllContactsSend,
    countAllContactsRecevied: countAllContactsRecevied,
};
