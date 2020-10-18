import ContactModel from "./../model/contactModel";
import UserModel from "./../model/userModel";
import _ from "lodash";

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
        resolve(true);
    });
};

module.exports = {
    findUsersContact: findUsersContact,
    addNew: addNew,
    removeRequestContact: removeRequestContact,
};
