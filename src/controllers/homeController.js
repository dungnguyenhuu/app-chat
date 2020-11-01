import { notification, contact, message } from "./../services/index";
import { bufferToBase64, lastItemOfArray, convertTimestamp } from "./../helpers/clientHelper";

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

    let getAllConversationItems = await message.getAllConversationItems(req.user._id);

    // tin nhắn trong các cuộc trò chuyện
    let allConversationMessages = getAllConversationItems.allConversationMessages;

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
        allConversationMessages: allConversationMessages,
        bufferToBase64: bufferToBase64,
        lastItemOfArray: lastItemOfArray,
        convertTimestamp: convertTimestamp,
    });
};

module.exports = {
    getHome: getHome,
};
