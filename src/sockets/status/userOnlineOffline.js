/* sockets/chat */

import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdToArray } from "./../../helpers/socketHelper";

/* param: io from socket.io lib */
let userOnlineOffline = (io) => {
    // lưu key userId và giá trị là các socketId, 
    let clients = {};
    io.on("connection", (socket) => {
        // thêm socketId khi user F5 hay đăng nhập
        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
        
        socket.request.user.chatGroupIds.forEach(group => {
            clients = pushSocketIdToArray(clients, group._id, socket.id);
        });
        
        let listUserIds = Object.keys(clients);
        // 1. emit to user after login or f5 web page
        socket.emit("server-send-list-users-online", listUserIds);
        // 2. emit to all another users when new user online
        socket.broadcast.emit("server-send-when-new-user-online", socket.request.user._id);

        // bắt sự kiện user đăng xuất hoặc mấy kết nối
        socket.on("disconnect", () => {
            clients = removeSocketIdToArray(clients, socket.request.user._id, socket);
            socket.request.user.chatGroupIds.forEach(group=> {
                clients = removeSocketIdToArray(clients, group._id, socket);
            });

            // 3. emit to all another users when has user offline
            socket.broadcast.emit("server-send-when-has-user-offline", socket.request.user._id);
        });
        // console.log(clients);
    });
};

module.exports = userOnlineOffline;
