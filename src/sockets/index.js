import addNewContact from "./contact/addNewContact";
import removReqContactSent from "./contact/removReqContactSent";
import removReqContactRecevied from "./contact/removReqContactRecevied";

let initSockets = (io) => {
    addNewContact(io);
    removReqContactSent(io);
    removReqContactRecevied(io);
};

module.exports = initSockets;
