import { notification, contact, message } from "./../services/index";
import { bufferToBase64, lastItemOfArray, convertTimestamp } from "./../helpers/clientHelper";

let getICETurnServer = () => {
    return new Promise(async (resolve, reject) => {
        // // Node Get ICE STUN and TURN list
        // let o = {
        //     format: "urls"
        // };

        // let bodyString = JSON.stringify(o);
        // let options = {
        //     url: "https://global.xirsys.net/_turn/app-chat",
        //     // host: "global.xirsys.net",
        //     // path: "/_turn/app-chat",
        //     method: "PUT",
        //     headers: {
        //         "Authorization": "Basic " + Buffer.from("dungnh:182dbc98-2724-11eb-8d64-0242ac150002").toString("base64"),
        //         "Content-Type": "application/json",
        //         "Content-Length": bodyString.length
        //     }
        // };

        // // call request to get ICE list of turn server
        // request(options, (error, response, body) => {
        //     if(error) {
        //         console.log("error when get list ICE: " + error);
        //         return reject(error);
        //     }
        //     let bodyJson = JSON.parse(body);
        //     resolve(bodyJson.v.iceServers);
        // });
        resolve([]);
    });
}

let getHome = async (req, res) => {
    // lấy ra 10 thông báo gần nhất
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

    // lấy thông tin của các thành viên trong nhóm trò chuyện
    let listMembersInfo = getAllConversationItems.listMembersInfo;

    // get ICE list from xirsys turn server
    let iceServerList = await getICETurnServer();

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
        listMembersInfo: listMembersInfo,
        bufferToBase64: bufferToBase64,
        lastItemOfArray: lastItemOfArray,
        convertTimestamp: convertTimestamp,
        iceServerList: JSON.stringify(iceServerList),
    });
};

module.exports = {
    getHome: getHome,
};
