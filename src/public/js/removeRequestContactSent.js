// hủy yêu cầu kết bạn bên tab tìm kiếm và tab đang chờ xác nhận

function removeRequestContactSent() {
    $(".user-remove-request-contact-sent").unbind("click").on("click", function () {
        let targetId = $(this).data("uid");
        $.ajax({
            type: "delete",
            url: "/contact/remove-request-contact-sent",
            data: {uid: targetId},
            success: function (data) {
                if(data.success) {
                    $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${targetId}]`).hide();
                    $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display", "inline-block");

                    // giảm số thông báo ở modal contact
                    decreaseNumberNotifContact("count-request-contact-sent"); // js/caculateNotif.js

                    // giảm số thông báo navbar
                    decreaseNumberNotification("noti_contact_counter", 1); // js/caculateNotification.js

                    // xóa ở tab đang chờ xác nhận
                    $("#request-contact-sent").find(`li[data-uid=${targetId}]`).remove();

                    socket.emit("remove-req-contact-sent", {contactId: targetId});
                }
            }
        });
    });
};

// nhận phản hồi khi có 1 hủy bỏ kết bạn
socket.on("response-remove-req-contact-sent", function(user) {
    // xóa trên thông báo trên popup notifications
    $(".noti_content").find(`div[data-uid = ${user.id}]`).remove();
    // xóa trên thông báo trên modal notifications
    $(".list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove();

    // xóa ở tab yêu cầu kết bạn
    $("#request-contact-received").find(`li[data-uid=${user.id}]`).remove();

    // giảm số thông báo ở modal contact
    decreaseNumberNotifContact("count-request-contact-received"); // js/caculateNotif.js

    // giảm số thông báo navbar
    decreaseNumberNotification("noti_contact_counter", 1); // js/caculateNotification.js
    decreaseNumberNotification("noti_counter", 1); // js/caculateNotification.js
});

$(document).ready(function () {
    removeRequestContactSent(); // js/removeRequestContactSent.js
});
