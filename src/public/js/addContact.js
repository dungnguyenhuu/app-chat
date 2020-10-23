/* contactModel.ejs */

// thêm vào danh bạ liên lạc
function addContact() {
    $(".user-add-new-contact").bind("click", function() {
        let targetId = $(this).data("uid");
        $.post("/contact/add-new", {uid: targetId}, function (data) {
            if(data.success) {
                $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).hide();
                $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).css("display", "inline-block");
                increaseNumberNotifContact("count-request-contact-sent"); // js/caculateNotuf.js

                socket.emit("add-new-contact", {contactId: targetId});
            }
        });
    });
};

// nhận phản hồi khi có 1 yêu cầu kết bạn
socket.on("response-add-new-contact", function(user) {
    let notif = `<div class="notif-readed-false" data-uid="${ user.id }">
                    <img class="avatar-small" src="images/users/${ user.avatar }" alt=""> 
                    <strong>${ user.username }</strong> đã gửi lời mời kết bạn cho bạn!
                </div>`;
    // chèn thông báo mới nhất lên đầu popup notification
    $(".noti_content").prepend(notif);

    // chèn thông báo mới nhất lên đầu modal notification
    $("ul.list-notifications").prepend(`<li>${notif}</li>`);

    increaseNumberNotifContact("count-request-contact-received");
    increaseNumberNotification("noti_contact_counter");
    increaseNumberNotification("noti_counter");
});
