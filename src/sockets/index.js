import addNewContact from "./contact/addNewContact";
import removReqContact from "./contact/removeReqContact";

let initSockets = (io) => {
    addNewContact(io);
    removReqContact(io);
};

module.exports = initSockets;
