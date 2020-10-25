import ContactModel from "./../model/contactModel";
import UserModel from "./../model/userModel";
import MessageModel from "./../model/messageModel";
import ChatGroupModel from "./../model/chatGroupModel";
import _ from "lodash";

const LIMIT_CONVERSATION_TAKEN = 15;
const LIMIT_MESSAGES_TAKEN = 30;

// lấy tất cả các cuộc hội thoại chat
let getAllConversation = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContacts(currentUserId, LIMIT_CONVERSATION_TAKEN);
            let userConversatonsPromise = contacts.map(async (contact) => {
                if(contact.contactId == currentUserId) {
                    let getUserContact = await UserModel.getNomalDataUserById(contact.userId);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                } else {
                    let getUserContact = await UserModel.getNomalDataUserById(contact.contactId);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                }
            });
            let userConversatons = await Promise.all(userConversatonsPromise);
            let groupConversations = await ChatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATION_TAKEN);
            let allConversations = userConversatons.concat(groupConversations);
            allConversations = _.sortBy(allConversations, (item) => {
                return -item.updatedAt;
            })

            // lấy tín nhắn để đưa ra màn hình chat
            let allConversationMessPromise =  allConversations.map(async (conversation) => {
                let getMessages = await MessageModel.model.getMessages(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);
                
                conversation = conversation.toObject();
                conversation.messages = getMessages;
                return conversation;
            });

            let allConversationMessage = await Promise.all(allConversationMessPromise);
            // sắp xếp lại thứ tự tin nhắn
            allConversationMessage = _.sortBy(allConversationMessage, (item) => {
                return item.updatedAt;
            });

            // console.log(allConversationMessage);
            resolve({
                allConversations: allConversations,
                userConversatons: userConversatons,
                groupConversations: groupConversations,
                allConversationMessage: allConversationMessage,
            });
        } catch (error) {
            reject(error);
        }
    })
};

module.exports = {
   getAllConversation: getAllConversation,
};
