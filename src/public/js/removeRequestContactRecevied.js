// hủy yêu cầu kết bạn bên tab yêu cầu kết bạn

function removeRequestContactRecevied() {
    $(".user-remove-request-contact-received").unbind("click").on("click", function () {
        let targetId = $(this).data("uid");
        $.ajax({
            type: "delete",
            url: "/contact/remove-request-contact-recevied",
            data: {uid: targetId},
            success: function (data) {
                if(data.success) {
                     // xóa trên thông báo trên popup notifications
                    // $(".noti_content").find(`div[data-uid = ${user.id}]`).remove();
                    // xóa trên thông báo trên modal notifications
                    // $(".list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove();
                    // decreaseNumberNotification("noti_counter", 1); // js/caculateNotification.js

                    // giảm số thông báo ở tab yêu cầu kết bạn trong modal contact
                    decreaseNumberNotifContact("count-request-contact-received"); // js/caculateNotif.js

                    // giảm số thông báo navbar
                    decreaseNumberNotification("noti_contact_counter", 1); // js/caculateNotification.js

                    // xóa user ở tab yêu cầu kết bạn
                    $("#request-contact-received").find(`li[data-uid=${targetId}]`).remove();

                    socket.emit("remove-req-contact-received", {contactId: targetId});
                }
            }
        });
    });
};

// nhận phản hồi khi có 1 hủy bỏ kết bạn
socket.on("response-remove-req-contact-received", function(user) {

    $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${user.id}]`).hide();
    $("#find-user").find(`div.user-add-new-contact[data-uid = ${user.id}]`).css("display", "inline-block");

    // xóa ở tab yêu cầu kết bạn
    $("#request-contact-sent").find(`li[data-uid=${user.id}]`).remove();

    // giảm số thông báo ở modal contact
    decreaseNumberNotifContact("count-request-contact-sent"); // js/caculateNotif.js

    // giảm số thông báo navbar
    decreaseNumberNotification("noti_contact_counter", 1); // js/caculateNotification.js
});

$(document).ready(function () {
    removeRequestContactRecevied(); // js/removeRequestContactRecevied.js
});
