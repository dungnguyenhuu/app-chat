import ContactModel from "./../model/contactModel";
import UserModel from "./../model/userModel";
import NotificationModel from "./../model/notificationModel";
import _ from "lodash";

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
        // tạo thông báo
        await NotificationModel.model.createNew(notificationItem);

        resolve(newContact);
    });
};

// hủy bỏ liên lạc bên tab danh bạ
let removeContact = (currentUserId, contactId) => {
    return new Promise (async (resolve, reject) => {
        // console.log(currentUserId);
        // console.log(contactId);
        // gọi removeContact() ở ContactModel
        let removeContact = await ContactModel.removeContact(currentUserId, contactId);
        // console.log(removeContact);
        if(removeContact.result.n === 0) {
            return reject(false);
        };
        resolve(true);
    });
};

// hủy yêu cầu kết bạn bên tab đang chờ xác nhận
let removeRequestContactSent = (currentUserId, contactId) => {
    return new Promise (async (resolve, reject) => {
        // gọi removeRequestContactSent() ở ContactModel
        let removeReq = await ContactModel.removeRequestContactSent(currentUserId, contactId);
        if(removeReq.result.n === 0) {
            return reject(false);
        };

        // xóa thông báo
        await NotificationModel.model.removeReqContactNotification(currentUserId, contactId, NotificationModel.types.ADD_CONTACT);

        resolve(true);
    });
};

// hủy yêu cầu kết bạn bên tab yêu cầu kết bạn
let removeRequestContactRecevied = (currentUserId, contactId) => {
    return new Promise (async (resolve, reject) => {
        // gọi removeRequestContactRecevied() ở ContactModel
        let removeReq = await ContactModel.removeRequestContactRecevied(currentUserId, contactId);
        if(removeReq.result.n === 0) {
            return reject(false);
        };

        // xóa thông báo
        // await NotificationModel.model.removeReqContactNotification(currentUserId, contactId, NotificationModel.types.ADD_CONTACT);

        resolve(true);
    });
};

// chấp nhận yêu cầu kết bạn bên tab yêu cầu kết bạn
let approveRequestContactRecevied = (currentUserId, contactId) => {
    return new Promise (async (resolve, reject) => {
        // gọi approveRequestContactRecevied() ở ContactModel
        let approveReq = await ContactModel.approveRequestContactRecevied(currentUserId, contactId);
        // console.log(approveReq);
        if(approveReq.nModified === 0) {
            return reject(false);
        };

        // tạo thông báo khi chấp nhận lời mời kết bạn
        let notificationItem = {
            senderId: currentUserId, 
            receiverId: contactId, 
            type: NotificationModel.types.APPROVE_CONTACT, 
        };
        // tạo thông báo
        await NotificationModel.model.createNew(notificationItem);

        resolve(true);
    });
}
// lấy user bên tab danh bạ
let getContacts = (currentUserId) => {
    return new Promise (async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContacts(currentUserId, LIMIT_NUMBER_TAKEN);
            let users = contacts.map(async (contact) => {
                if(contact.contactId == currentUserId) {
                    return await UserModel.getNomalDataUserById(contact.userId);
                } else {
                    return await UserModel.getNomalDataUserById(contact.contactId);
                }
            });

            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};

// tổng user trong danh bạ
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

// lấy thêm user bên tab danh bạ
let readMoreContacts = (currentUserId, skipNumberContact) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newContacts = await ContactModel.readMoreContacts(currentUserId, skipNumberContact, LIMIT_NUMBER_TAKEN);
            
            let users = newContacts.map(async (contact) => {
                if(contact.contactId == currentUserId) {
                    return await UserModel.getNomalDataUserById(contact.userId);
                } else {
                    return await UserModel.getNomalDataUserById(contact.contactId);
                }
            });

            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};

// lấy user bên tab đang chờ xác nhận
let getContactsSend = (currentUserId) => {
    return new Promise (async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContactsSend(currentUserId, LIMIT_NUMBER_TAKEN);
            let users = contacts.map(async (contact) => {
                return await UserModel.getNomalDataUserById(contact.contactId);
            });

            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};

// tổng user trong đang chờ xác nhận
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

// lấy thêm user bên tab đang chờ xác nhận
let readMoreContactsSent = (currentUserId, skipNumberContactSent) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contactsSent = await ContactModel.readMoreContactsSent(currentUserId, skipNumberContactSent, LIMIT_NUMBER_TAKEN);
            
            let users = contactsSent.map(async (contactSent) => {
                return await UserModel.getNomalDataUserById(contactSent.contactId);
            });

            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};

// lấy user bên tab yêu cầu kết bạn
let getContactsRecevied = (currentUserId) => {
    return new Promise (async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContactsRecevied(currentUserId, LIMIT_NUMBER_TAKEN);
            let users = contacts.map(async (contact) => {
                return await UserModel.getNomalDataUserById(contact.userId);
            });

            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};

// tổng user trong yêu cầu kết bạn
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

// lấy thêm user bên tab yêu cầu kết bạn
let readMoreContactsReceived = (currentUserId, skipNumberContactReceived) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contactsReceived = await ContactModel.readMoreContactsReceived(currentUserId, skipNumberContactReceived, LIMIT_NUMBER_TAKEN);
            
            let users = contactsReceived.map(async (contactReceived) => {
                return await UserModel.getNomalDataUserById(contactReceived.userId);
            });

            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};

// tìm kiếm bạn bè để thêm vào nhóm trò chuyện
let searchFriends = (currentUserId, keyword) => {
    return new Promise (async (resolve, reject) => {
        let friendIds = [];
        let friends = await ContactModel.getFriends(currentUserId);
        friends.forEach((item) => {
            friendIds.push(item.userId);
            friendIds.push(item.contactId);
        });
        friendIds = _.unionBy(friendIds);
        friendIds = friendIds.filter(userId => userId != currentUserId);
        
        let users = await UserModel.findAllToAddGroupChat(friendIds, keyword);
        resolve(users);        
    });
};

module.exports = {
    findUsersContact: findUsersContact,
    addNew: addNew,
    removeContact: removeContact,
    removeRequestContactSent: removeRequestContactSent,
    removeRequestContactRecevied: removeRequestContactRecevied,
    approveRequestContactRecevied: approveRequestContactRecevied,
    getContacts: getContacts,
    getContactsSend: getContactsSend,
    getContactsRecevied: getContactsRecevied,
    countAllContacts: countAllContacts,
    countAllContactsSend: countAllContactsSend,
    countAllContactsRecevied: countAllContactsRecevied,
    readMoreContacts: readMoreContacts,
    readMoreContactsSent: readMoreContactsSent,
    readMoreContactsReceived: readMoreContactsReceived,
    searchFriends: searchFriends,
};
