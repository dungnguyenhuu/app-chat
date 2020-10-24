import addNewContact from "./contact/addNewContact";
import removReqContactSent from "./contact/removeReqContactSent";
import removReqContactRecevied from "./contact/removeReqContactRecevied";
import approveReqContactRecevied from "./contact/approveReqContactRecevied";

let initSockets = (io) => {
    addNewContact(io);
    removReqContactSent(io);
    removReqContactRecevied(io);
    approveReqContactRecevied(io);
};

module.exports = initSockets;
