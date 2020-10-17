import ContactModel from "./../model/contactModel";
import UserModel from "./../model/userModel";
import _ from "lodash";

let findUsersContact = (currentUserId, keyword) => {
    return new Promise (async (resolve, reject) => {
        let deprecatedUserIds = [];
        let contactByUser = await ContactModel.findAllByUser(currentUserId);
        contactByUser.forEach((contact) => {
            deprecatedUserIds.push(contact.userId);
            deprecatedUserIds.push(contact.contactId);
        });

        deprecatedUserIds = _.unionBy(deprecatedUserIds);
        let users = await UserModel.findAllForAddContact(deprecatedUserIds, keyword);
        resolve(users);        
    });
};

module.exports = {
    findUsersContact: findUsersContact,
};