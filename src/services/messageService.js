import ContactModel from "./../model/contactModel";
import UserModel from "./../model/userModel";
import ChatGroupModel from "./../model/chatGroupModel";
import MessageModel from "./../model/messageModel";
import _, { conforms } from "lodash";
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
            let listMembersInfo = groupConversations.map(async (groupConversation) => {
                let arrayMembersInfoPromise = groupConversation.members.map(async (member) => {
                    let memberInfo = await UserModel.getNomalDataUserById(member.userId);
                    return memberInfo;
                });
                let arrayMembersInfo = await Promise.all(arrayMembersInfoPromise);
                // console.log(arrayMembersInfo.length);
                let object = {
                    createBy: groupConversation.userId,
                    groupChatId: groupConversation._id,
                    arrayMembersInfo: arrayMembersInfo
                }
                // console.log(object.arrayMembersInfo);
                // console.log(object);
                // console.log("-------------------------------------");
                // listMembersInfo.push(object);
                return object;
            });
            listMembersInfo = await Promise.all(listMembersInfo);
            // console.log(listMembersInfo);
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
                listMembersInfo: listMembersInfo,
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
         console.log("loi o addNewImage messageService");
         reject(error);
     }
    });
};

// lưu tin nhắn là tệp đính kèm
let addNewattAchment = (sender, receiverId, messageVal, isChatGroup) => {
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

             let attachmentBuffer = await fsExtra.readFile(messageVal.path);
             let attachmentContentType = messageVal.mimetype;
             let attachmentName = messageVal.originalname;
 
             let newMessageItem = {
                 senderId: sender.id,
                 receiverId: receiver.id,
                 conversationType: MessageModel.conversationTypes.GROUP,
                 messageType: MessageModel.messageTypes.FILE,
                 sender: sender,
                 receiver:receiver,
                 file: {data: attachmentBuffer, contentType: attachmentContentType, fileName: attachmentName},    
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
 
             let attachmentBuffer = await fsExtra.readFile(messageVal.path);
             let attachmentContentType = messageVal.mimetype;
             let attachmentName = messageVal.originalname;
 
             let newMessageItem = {
                 senderId: sender.id,
                 receiverId: receiver.id,
                 conversationType: MessageModel.conversationTypes.PERSONAL,
                 messageType: MessageModel.messageTypes.FILE,
                 sender: sender,
                 receiver: receiver,
                 file: {data: attachmentBuffer, contentType: attachmentContentType, fileName: attachmentName},      
                 createdAt: Date.now(),                      
             };
             let newMessage = await MessageModel.model.createNew(newMessageItem);
             // cập nhập lại dữ liệu của contact
             await ContactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);
             resolve(newMessage);
         };
     } catch (error) {
         console.log(error);
         console.log("loi o addNewAttachment messageService");
         reject(error);
     }
    });
};

// lấy thêm contact
let readMoreAllChat = (currentUserId, skipPersonal, skipGroup) => {
    return new Promise (async (resolve, reject) => {
        try {
            let contacts = await ContactModel.readMoreContacts(currentUserId, skipPersonal, LIMIT_CONVERSATION_TAKEN);

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
            let groupConversations = await ChatGroupModel.readMoreChatGroups(currentUserId, skipGroup, LIMIT_CONVERSATION_TAKEN);
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

            resolve(allConversationMessages);
        } catch (error) {
            reject(error);
        }
    });
};

let readMoreUserChat = (currentUserId, skipPersonal) => {
    return new Promise (async (resolve, reject) => {
        try {
            let contacts = await ContactModel.readMoreContacts(currentUserId, skipPersonal, LIMIT_CONVERSATION_TAKEN);
            
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

            // lấy tin nhắn trong từng cuộc trò chuyện
            let userConversationMessagesPromise = userConversations.map(async (conversation) => {
                conversation = conversation.toObject();
                let getMessages = await MessageModel.model.getMessagesPersonal(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);
                conversation.messages = _.reverse(getMessages);
            
                return conversation;
            });

            let userConversationMessages = await Promise.all(userConversationMessagesPromise);
            // sắp xếp lại
            userConversationMessages = _.sortBy(userConversationMessages, (item) => {
                return -item.updateAt;
            });
            resolve(userConversationMessages);
        } catch (error) {
            reject(error);
        }
    });
};

let readMoreGroupChat = (currentUserId, skipGroup) => {
    return new Promise (async (resolve, reject) => {
        try {
            // nhóm trò chuyện
            let groupConversations = await ChatGroupModel.readMoreChatGroups(currentUserId, skipGroup, LIMIT_CONVERSATION_TAKEN);
            
            // lấy tin nhắn trong từng cuộc trò chuyện
            let groupConversationMessagesPromise = groupConversations.map(async (conversation) => {
                conversation = conversation.toObject();
                let getMessages = await MessageModel.model.getMessagesGroup(conversation._id, LIMIT_MESSAGES_TAKEN);
                conversation.messages = _.reverse(getMessages);
                return conversation;
            });

            let groupConversationMessages = await Promise.all(groupConversationMessagesPromise);
            // sắp xếp lại
            groupConversationMessages = _.sortBy(groupConversationMessages, (item) => {
                return -item.updateAt;
            });

            resolve(groupConversationMessages);
        } catch (error) {
            reject(error);
        }
    });
};

let readMore = (currentUserId, skipMessage, targetId, chatInGroup) => {
    return new Promise (async (resolve, reject) => {
        try {
            //  message in gorup chat
            if(chatInGroup) {
                let getMessages = await MessageModel.model.readMoreMessagesGroup(targetId, skipMessage, LIMIT_MESSAGES_TAKEN);
                getMessages = _.reverse(getMessages);
                return resolve(getMessages);
            } 

            // message in personal
            let getMessages = await MessageModel.model.readMoreMessagesPersonal(currentUserId, targetId, skipMessage, LIMIT_MESSAGES_TAKEN);
            getMessages = _.reverse(getMessages);
            return resolve(getMessages);
        
        } catch (error) {
            reject(error);
        }
    });
};

module.exports =  {
    getAllConversationItems: getAllConversationItems,
    addNewTextEmoji: addNewTextEmoji,
    addNewImage: addNewImage, 
    addNewattAchment: addNewattAchment, 
    readMoreAllChat: readMoreAllChat,
    readMoreUserChat: readMoreUserChat,
    readMoreGroupChat: readMoreGroupChat,
    readMore: readMore
};
