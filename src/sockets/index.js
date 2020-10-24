import addNewContact from "./contact/addNewContact";
import removReqContactSent from "./contact/removeReqContactSent";
import removReqContactRecevied from "./contact/removeReqContactRecevied";
import approveReqContactRecevied from "./contact/approveReqContactRecevied";
import removeContact from "./contact/removeContact";

let initSockets = (io) => {
    addNewContact(io);
    removReqContactSent(io);
    removReqContactRecevied(io);
    approveReqContactRecevied(io);
    removeContact(io);
};

module.exports = initSockets;
