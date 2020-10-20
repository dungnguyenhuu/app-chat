export let pushSocketIdToArray = (clients, userId, socketId) => {
    if(clients[userId]) {
        // khi user đã đăng nhập thì đã tồn tại key userId trong clients và
        // khi đó, user mở tab mới hay F5 thì sẽ thêm socketId mới vào mảng có key là userId trong clients
            clients[userId].push(socketId);
        } else {
        // khi user chưa đăng nhập
            clients[userId] = [socketId];
        }

        return clients;
};

// thông báo tới user nhận lời kết bạn
export let emitNotifyToArray = (clients, userId, io, evenName, data) => {
    clients[userId].forEach(socketId => {
        return io.sockets.connected[socketId].emit(evenName, data);
    });
};

export let removeSocketIdToArray = (clients, userId, socket) => {
      // bỏ đi socketId cũ do user F5
    clients[userId] = clients[userId].filter((socketId) => {
        return socketId !== socket.id;
    });

    // khi user thoát hoàn toàn web sẽ xóa đi mảng chứa socketId
    if(!clients[userId].length) {
        delete clients[userId];
    };
    return clients;
};
