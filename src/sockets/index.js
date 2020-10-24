import addNewContact from "./contact/addNewContact";
import removReqContactSent from "./contact/removReqContactSent";

let initSockets = (io) => {
    addNewContact(io);
    removReqContactSent(io);
};

module.exports = initSockets;
