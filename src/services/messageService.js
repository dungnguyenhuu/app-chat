import ContactModel from "./../model/contactModel";
import UserModel from "./../model/userModel";
import ChatGroupModel from "./../model/chatGroupModel";
import _ from "lodash";

const LIMIT_CONVERSATION_TAKEN = 15;

// lấy tất cả các cuộc hội thoại chat
let getAllConversation = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContacts(currentUserId, LIMIT_CONVERSATION_TAKEN);
            let userConversatonsPromise = contacts.map(async (contact) => {
                if(contact.contactId == currentUserId) {
                    let getUserContact = await UserModel.getNomalDataUserById(contact.userId);
                    getUserContact.createdAt = contact.createdAt;
                    return getUserContact;
                } else {
                    let getUserContact = await UserModel.getNomalDataUserById(contact.contactId);
                    getUserContact.createdAt = contact.createdAt;
                    return getUserContact;
                }
            });
            let userConversatons = await Promise.all(userConversatonsPromise);
            let groupConversations = await ChatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATION_TAKEN);
            let allConversations = userConversatons.concat(groupConversations);
            allConversations = _.sortBy(allConversations, (item) => {
                return -item.createdAt;
            })

            resolve({
                allConversations: allConversations,
                userConversatons: userConversatons,
                groupConversations: groupConversations,
            });
        } catch (error) {
            reject(error);
        }
    })
};

module.exports = {
   getAllConversation: getAllConversation,
};
