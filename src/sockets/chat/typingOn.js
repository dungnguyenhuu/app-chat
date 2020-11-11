/* sockets/chat */

import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdToArray } from "./../../helpers/socketHelper";

/* param: io from socket.io lib */
let typingOn = (io) => {
    // lưu key userId và giá trị là các socketId, 
    let clients = {};
    io.on("connection", (socket) => {
        // thêm socketId khi user F5 hay đăng nhập
        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
        
        socket.request.user.chatGroupIds.forEach(group => {
            clients = pushSocketIdToArray(clients, group._id, socket.id);
        });
        
        socket.on("user-is-typing", (data) => {
            if(data.groupId) {
                let response = {
                    currentGroupId: data.groupId,
                    currentUserId: socket.request.user._id,
                };
                // gửi tin nhắn mới tới nhóm (nhắn tin tới nhóm)
                if (clients[data.groupId]){
                    // console.log(data.groupId);
                    emitNotifyToArray(clients, data.groupId, io, "response-user-is-typing", response);
                };
            }

            if(data.contactId) {
                let response = {
                    currentUserId: socket.request.user._id,
                };
                // gửi tin nhắn mới tới bạn bè (nhắn tin 2 người)
                if (clients[data.contactId]){
                    emitNotifyToArray(clients, data.contactId, io, "response-user-is-typing", response);
                };
            }
            
        });

        // bắt sự kiện user đăng xuất hoặc mấy kết nối
        socket.on("disconnect", () => {
            clients = removeSocketIdToArray(clients, socket.request.user._id, socket);
            socket.request.user.chatGroupIds.forEach(group=> {
                clients = removeSocketIdToArray(clients, group._id, socket);
            });
        });
        // console.log(clients);
    });
};

module.exports = typingOn;
