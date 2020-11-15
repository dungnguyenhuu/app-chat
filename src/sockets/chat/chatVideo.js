/* sockets/chat */

import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdToArray } from "./../../helpers/socketHelper";

/* param: io from socket.io lib */
let chatVideo = (io) => {
    // lưu key userId và giá trị là các socketId, 
    let clients = {};
    io.on("connection", (socket) => {
        // thêm socketId khi user F5 hay đăng nhập
        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
        
        socket.request.user.chatGroupIds.forEach(group => {
            clients = pushSocketIdToArray(clients, group._id, socket.id);
        });
        
        socket.on("caller-check-listener-online", (data) => {
            if(clients[data.listenerId]) {
                // online
                let response = {
                    callerId: socket.request.user._id,
                    listenerId: data.listenerId,
                    callerName: data.callerName
                }
                emitNotifyToArray(clients, data.listenerId, io, "server-request-peer-id-of-listener", response);
            } else {
                // offline
                socket.emit("server-send-listener-is-offline");
            }
            
        });

        socket.on("listener-emit-peer-id-to-server", (data) => {
            let response = {
                callerId: data.callerId,
                listenerId: data.listenerId,
                callerName: data.callerName,
                listenerName: data.listenerName,
                listenerPeerId: data.listenerPeerId,
            };
            if(clients[data.callerId]) {
                emitNotifyToArray(clients, data.callerId, io, "server-send-peer-id-of-caller", response);
            }
        });

        socket.on("caller-request-call-to-server", (data) => {
            let response = {
                callerId: data.callerId,
                listenerId: data.listenerId,
                callerName: data.callerName,
                listenerName: data.listenerName,
                listenerPeerId: data.listenerPeerId,
            };
            if(clients[data.listenerId]) {
                emitNotifyToArray(clients, data.listenerId, io, "server-send-request-call-to-listener", response);
            }
        });

        socket.on("caller-cancel-requset-call-to-server", (data) => {
            let response = {
                callerId: data.callerId,
                listenerId: data.listenerId,
                callerName: data.callerName,
                listenerName: data.listenerName,
                listenerPeerId: data.listenerPeerId,
            };
            if(clients[data.listenerId]) {
                emitNotifyToArray(clients, data.listenerId, io, "server-send-cancel-request-call-to-listener", response);
            }
        });

        socket.on("listener-reject-request-to-server", (data) => {
            let response = {
                callerId: data.callerId,
                listenerId: data.listenerId,
                callerName: data.callerName,
                listenerName: data.listenerName,
                listenerPeerId: data.listenerPeerId,
            };
            if(clients[data.callerId]) {
                emitNotifyToArray(clients, data.callerId, io, "server-send-reject-call-to-caller", response);
            }
        });

        socket.on("listener-accept-request-to-server", (data) => {
            let response = {
                callerId: data.callerId,
                listenerId: data.listenerId,
                callerName: data.callerName,
                listenerName: data.listenerName,
                listenerPeerId: data.listenerPeerId,
            };
            if(clients[data.callerId]) {
                emitNotifyToArray(clients, data.callerId, io, "server-send-accept-request-call-to-caller", response);
            }
            if(clients[data.listenerId]) {
                emitNotifyToArray(clients, data.listenerId, io, "server-send-accept-request-call-to-listener", response);
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

module.exports = chatVideo;
