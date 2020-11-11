import { notification, contact, message } from "./../services/index";
import { bufferToBase64, lastItemOfArray, convertTimestamp } from "./../helpers/clientHelper";
<<<<<<< HEAD

=======
>>>>>>> revert1

let getHome = async (req, res) => {
    // lấy ra 10 thông báo dần nhất
    let notifications = await notification.getNotifications(req.user._id);

    //số thông báo chưa đọc
    let countNotifUnread = await notification.countNotifUnread(req.user._id);

    // lấy 10 người trong danh bạ
    let contacts = await contact.getContacts(req.user._id);
    let countAllContacts = await contact.countAllContacts(req.user._id);

    // lấy 10 người đã gửi lời mời (sent)
    let contactsSend = await contact.getContactsSend(req.user._id);
    let countAllContactsSend = await contact.countAllContactsSend(req.user._id);

    // lấy 10 lời mời đã nhận recevied
    let contactsRecevied = await contact.getContactsRecevied(req.user._id);
    let countAllContactsRecevied = await contact.countAllContactsRecevied(req.user._id);

<<<<<<< HEAD
    let getAllConversation = await message.getAllConversation(req.user._id);

    let allConversations = getAllConversation.allConversations;

    let userConversatons = getAllConversation.userConversatons;

    let groupConversations = getAllConversation.groupConversations;

    // lấy tất cả tin nhắn (với max là 30)
    let allConversationMessages = getAllConversation.allConversationMessage;
=======
    let getAllConversationItems = await message.getAllConversationItems(req.user._id);

    // tin nhắn trong các cuộc trò chuyện
    let allConversationMessages = getAllConversationItems.allConversationMessages;
>>>>>>> revert1

    return res.render("main/home/home", {
        errors: req.flash("errors"),
        success: req.flash("success"),
        user: req.user,
        notifications: notifications,
        countNotifUnread: countNotifUnread,
        contacts: contacts,
        contactsSend: contactsSend,
        contactsRecevied: contactsRecevied,
        countAllContacts: countAllContacts,
        countAllContactsSend: countAllContactsSend,
        countAllContactsRecevied: countAllContactsRecevied,
<<<<<<< HEAD
        allConversations: allConversations,
        userConversatons: userConversatons,
        groupConversations: groupConversations,
=======
>>>>>>> revert1
        allConversationMessages: allConversationMessages,
        bufferToBase64: bufferToBase64,
        lastItemOfArray: lastItemOfArray,
        convertTimestamp: convertTimestamp,
    });
};

module.exports = {
    getHome: getHome,
};
