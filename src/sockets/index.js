import addNewContact from "./contact/addNewContact";
import removReqContactSent from "./contact/removeReqContactSent";
import removReqContactRecevied from "./contact/removeReqContactRecevied";
import approveReqContactRecevied from "./contact/approveReqContactRecevied";
import removeContact from "./contact/removeContact";
import chatTextEmoji from "./chat/chatTextEmoji";
import typingOn from "./chat/typingOn";
import typingOff from "./chat/typingOff";
import chatImage from "./chat/chatImage";
import chatAttachment from "./chat/chatAttachment";

let initSockets = (io) => {
    addNewContact(io);
    removReqContactSent(io);
    removReqContactRecevied(io);
    approveReqContactRecevied(io);
    removeContact(io);
    chatTextEmoji(io);
    typingOn(io);
    typingOff(io);
    chatImage(io);
    chatAttachment(io);
};

module.exports = initSockets;
