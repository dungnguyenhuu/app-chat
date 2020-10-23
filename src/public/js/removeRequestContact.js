// hủy yêu cầu kết bạn
function removeRequestContact() {
    $(".user-remove-request-contact").bind("click", function () {
        let targetId = $(this).data("uid");
        $.ajax({
            type: "delete",
            url: "/contact/remove-request-contact",
            data: {uid: targetId},
            success: function (data) {
                if(data.success) {
                    $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).hide();
                    $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display", "inline-block");
                    decreaseNumberNotifContact("count-request-contact-sent"); // js/caculateNotuf.js

                    socket.emit("remove-req-contact", {contactId: targetId});
                }
            }
        });
    });
};

// nhận phản hồi khi có 1 hủy bỏ kết bạn
socket.on("response-remove-req-contact", function(user) {
    // xóa trên thông báo trên popup notifications
    $(".noti_content").find(`div[data-uid = ${user.id}]`).remove();
    // xóa trên thông báo trên modal notifications
    $(".list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove();


    // xóa ở modal contact
    decreaseNumberNotifContact("count-request-contact-received");
    decreaseNumberNotification("noti_contact_counter", 1);
    decreaseNumberNotification("noti_counter", 1);
});
