function renderViewChat(idChat, data) {
    if(data.leftSideData.trim() === "") {
        alertify.notify("Bạn không còn cuộc trò chuyện nào nữa", "error", 5);
        $(`#link-read-more-${idChat}`).css("display", "none");
    }
    // 1. handle leftSide 
    $(`#${idChat}`).find("ul").append(data.leftSideData);

    // 2. handle scroll left
    resizeNineScrollLeft()
    nineScrollLeft();

    // 3. handle rightSide
    $("#screen-chat").append(data.rightSideData);

    // 4. call screenChat function
    changeScreenChat();

    // 5. convert emoji
    convertEmoji();

    // 6. handle imageModal
    $("body").append(data.imageModalData);

    // 7. call gridPhoto()
    gridPhotos(5);

    // 8. handle attachmentModal
    $("body").append(data.attachmentModalData);

    // 9. check online
    socket.emit("check-status");

    // 10. read more message
    readMoreMessage();
}

$(document).ready(function () {
    /* toàn bộ trò chuyện */
    $("#link-read-more-all-chat").bind("click", function (e) {
        let skipPersonal = $("#all-chat").find("li:not(.group-chat)").length;
        let skipGroup = $("#all-chat").find("li.group-chat").length;

        $.get(`/message/read-more-all-chat?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}`, function(data) {
            renderViewChat("all-chat", data);
        });
    });

    /* trò chuyện cá nhân */
    $("#link-read-more-user-chat").bind("click", function (e) {
        let skipPersonal = $("#user-chat").find("li:not(.group-chat)").length;

        $.get(`/message/read-more-user-chat?skipPersonal=${skipPersonal}`, function(data) {
            renderViewChat("user-chat", data);
        });
    });
    /* trò chuyện nhóm */
    $("#link-read-more-group-chat").bind("click", function (e) {
        let skipGroup = $("#group-chat").find("li.group-chat").length;

        $.get(`/message/read-more-group-chat?skipGroup=${skipGroup}`, function(data) {
            renderViewChat("group-chat", data);
        });
    });
});
