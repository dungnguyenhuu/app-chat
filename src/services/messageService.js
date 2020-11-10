import ContactModel from "./../model/contactModel";
import UserModel from "./../model/userModel";
import ChatGroupModel from "./../model/chatGroupModel";
import MessageModel from "./../model/messageModel";
import _ from "lodash";
import { transErrors } from "./../../lang/vi";
import { appConfig } from "./../config/appConfig";
import fsExtra from "fs-extra";

const LIMIT_CONVERSATION_TAKEN = 15;
const LIMIT_MESSAGES_TAKEN = 30;

let getAllConversationItems = (currentUserId) => {
    return new Promise (async (resolve, reject) => {
        try {
            let contacts = await ContactModel.getContacts(currentUserId, LIMIT_CONVERSATION_TAKEN);
            let userConversationsPromise = contacts.map(async (contact) => {
                if(contact.contactId == currentUserId) {
                    let getUserContacts =  await UserModel.getNomalDataUserById(contact.userId);
                    getUserContacts.updatedAt = contact.updatedAt;
                    return getUserContacts;
                } else {
                    let getUserContacts = await UserModel.getNomalDataUserById(contact.contactId);
                    getUserContacts.updatedAt = contact.updatedAt;
                    return getUserContacts;
                }
            });
            // bạn bè trò chuyện
            let userConversations = await Promise.all(userConversationsPromise);
            // nhóm trò chuyện
            let groupConversations = await ChatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATION_TAKEN);
            // tất cả trò chuyện (cả nhóm và bạn bè)
            let allConversations = userConversations.concat(groupConversations);
            // sắp xếp lại các cuộc trò chuyện theo update mới nhất
            allConversations = _.sortBy(allConversations, (item) => {
                return -item.updatedAt;
            });
            // console.log(allConversations);
            
            // lấy tin nhắn trong từng cuộc trò chuyện
            let allConversationMessagesPromise = allConversations.map(async (conversation) => {
                conversation = conversation.toObject();

                if(conversation.members) {
                    let getMessages = await MessageModel.model.getMessagesGroup(conversation._id, LIMIT_MESSAGES_TAKEN);
                    conversation.messages = _.reverse(getMessages);
                } else {
                    let getMessages = await MessageModel.model.getMessagesPersonal(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);
                    conversation.messages = _.reverse(getMessages);
                }
                return conversation;
            });

            let allConversationMessages = await Promise.all(allConversationMessagesPromise);
            // sắp xếp lại
            allConversationMessages = _.sortBy(allConversationMessages, (item) => {
                return -item.updateAt;
            });

            resolve({
                allConversationMessages: allConversationMessages,
            });
        } catch (error) {
            reject(error);
        }
    });
};

// lưu tin nhắn lại
let addNewTextEmoji = (sender, receiverId, messageVal, isChatGroup) => {
   return new Promise(async (resolve, reject) => {
    try {
        if(isChatGroup) {
            // tìm nhóm chat theo id
            let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
            if(!getChatGroupReceiver) {
                return reject(transErrors.conversation_not_found);
            };

            let receiver = {
                id: getChatGroupReceiver._id,
                name: getChatGroupReceiver.name,
                avatar: appConfig.general_avatar_group_chat,
            };

            let newMessageItem = {
                senderId: sender.id,
                receiverId: receiver.id,
                conversationType: MessageModel.conversationTypes.GROUP,
                messageType: MessageModel.messageTypes.TEXT,
                sender: sender,
                receiver:receiver,                
                text: messageVal,       
                createdAt: Date.now(),                      
            };

            let newMessage = await MessageModel.model.createNew(newMessageItem);
            // cập nhập lại dữ liệu của nhóm chat
            await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1);
            resolve(newMessage);
        } else {
            // tìm người theo id
            let getUserReceiver = await UserModel. getNomalDataUserById(receiverId);
            if(!getUserReceiver) {
                return reject(transErrors.conversation_not_found);
            };

            let receiver = {
                id: getUserReceiver._id,
                name: getUserReceiver.username,
                avatar: getUserReceiver.avatar,
            };

            let newMessageItem = {
                senderId: sender.id,
                receiverId: receiver.id,
                conversationType: MessageModel.conversationTypes.PERSONAL,
                messageType: MessageModel.messageTypes.TEXT,
                sender: sender,
                receiver: receiver,                
                text: messageVal,       
                createdAt: Date.now(),                      
            };
            let newMessage = await MessageModel.model.createNew(newMessageItem);
            // cập nhập lại dữ liệu của contact
            await ContactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);
            resolve(newMessage);
        };
    } catch (error) {
        console.log(error);
        console.log("loi o addNewTextEmoji messageService");
        reject(error);
    }
   });
};

// lưu tin nhắn hình ảnh
let addNewImage = (sender, receiverId, messageVal, isChatGroup) => {
    return new Promise(async (resolve, reject) => {
     try {
         if(isChatGroup) {
             // tìm nhóm chat theo id
             let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
             if(!getChatGroupReceiver) {
                 return reject(transErrors.conversation_not_found);
             };
 
             let receiver = {
                 id: getChatGroupReceiver._id,
                 name: getChatGroupReceiver.name,
                 avatar: appConfig.general_avatar_group_chat,
             };

             let imageBuffer = await fsExtra.readFile(messageVal.path);
             let imageContentType = messageVal.mimetype;
             let imageName = messageVal.originalname;
 
             let newMessageItem = {
                 senderId: sender.id,
                 receiverId: receiver.id,
                 conversationType: MessageModel.conversationTypes.GROUP,
                 messageType: MessageModel.messageTypes.IMAGE,
                 sender: sender,
                 receiver:receiver,
                 file: {data: imageBuffer, contentType: imageContentType, fileName: imageName},    
                 createdAt: Date.now(),                      
             };
 
             let newMessage = await MessageModel.model.createNew(newMessageItem);
             // cập nhập lại dữ liệu của nhóm chat
             await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1);
             resolve(newMessage);
         } else {
             // tìm người theo id
             let getUserReceiver = await UserModel. getNomalDataUserById(receiverId);
             if(!getUserReceiver) {
                 return reject(transErrors.conversation_not_found);
             };
 
             let receiver = {
                 id: getUserReceiver._id,
                 name: getUserReceiver.username,
                 avatar: getUserReceiver.avatar,
             };
 
             let imageBuffer = await fsExtra.readFile(messageVal.path);
             let imageContentType = messageVal.mimetype;
             let imageName = messageVal.originalname;
 
             let newMessageItem = {
                 senderId: sender.id,
                 receiverId: receiver.id,
                 conversationType: MessageModel.conversationTypes.PERSONAL,
                 messageType: MessageModel.messageTypes.IMAGE,
                 sender: sender,
                 receiver: receiver,
                 file: {data: imageBuffer, contentType: imageContentType, fileName: imageName},    
                 createdAt: Date.now(),                      
             };
             let newMessage = await MessageModel.model.createNew(newMessageItem);
             // cập nhập lại dữ liệu của contact
             await ContactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);
             resolve(newMessage);
         };
     } catch (error) {
         console.log(error);
         console.log("loi o addNewTextEmoji messageService");
         reject(error);
     }
    });
 };

module.exports =  {
    getAllConversationItems: getAllConversationItems,
    addNewTextEmoji: addNewTextEmoji,
    addNewImage: addNewImage
};
