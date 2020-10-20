/* sockets/contact */

import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdToArray } from "./../../helpers/socketHelper";

/* param: io from socket.io lib */
let removReqContact = (io) => {
    // lưu key userId và giá trị là các socketId, 
    let clients = {};
    io.on("connection", (socket) => {
        // thêm socketId khi user F5 hay đăng nhập
        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

        socket.on("remove-req-contact", (data) => {
            let currentUser = {
                id: socket.request.user._id,
            };

            // emit thông báo cho người bạn mới
            if (clients[data.contactId]){
                emitNotifyToArray(clients, data.contactId, io, "response-remove-req-contact", currentUser);
            };
        });

        // bắt sự kiện user đăng xuất hoặc mấy kết nối
        socket.on("disconnect", () => {
            clients = removeSocketIdToArray(clients, socket.request.user._id, socket);
        });
    });
};

module.exports = removReqContact;
