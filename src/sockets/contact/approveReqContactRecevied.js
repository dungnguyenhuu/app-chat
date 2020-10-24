/* sockets/contact 
    chấp nhận lời mời kết bạn bên tab yêu cầu kết bạn
*/

import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdToArray } from "./../../helpers/socketHelper";

/* param: io from socket.io lib */
let approveReqContactRecevied = (io) => {
    // lưu key userId và giá trị là các socketId, 
    let clients = {};
    io.on("connection", (socket) => {
        // thêm socketId khi user F5 hay đăng nhập
        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

        socket.on("approve-req-contact-received", (data) => {
            let currentUser = {
                id: socket.request.user._id,
                username: socket.request.user.username,
                avatar: socket.request.user.avatar,
                address: (socket.request.user.address !== null) ? socket.request.user.address : "",
            };

            // thông báo tới user nhận lời kết bạn
            if (clients[data.contactId]){
                emitNotifyToArray(clients, data.contactId, io, "response-approve-req-contact-received", currentUser);
            };
        });

        // bắt sự kiện user đăng xuất hoặc mấy kết nối
        socket.on("disconnect", () => {
            clients = removeSocketIdToArray(clients, socket.request.user._id, socket);
        });
        // console.log(clients);
    });
};

module.exports = approveReqContactRecevied;
