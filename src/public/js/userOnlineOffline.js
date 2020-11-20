// 0.
socket.emit("check-status");

// 1. 
socket.on("server-send-list-users-online", function (listUserIds) {
    listUserIds.forEach(userId => {
        $(`.person[data-chat=${userId}]`).find("div.dot").addClass("online");
        $(`.person[data-chat=${userId}]`).find("img").addClass("avatar-online");
    });
});
// 2.
socket.on("server-send-when-new-user-online", function(userId) {
    $(`.person[data-chat=${userId}]`).find("div.dot").addClass("online");
    $(`.person[data-chat=${userId}]`).find("img").addClass("avatar-online");
});

// 3.
socket.on("server-send-when-has-user-offline", function (userId) {
    $(`.person[data-chat=${userId}]`).find("div.dot").removeClass("online");
    $(`.person[data-chat=${userId}]`).find("img").removeClass("avatar-online");
});