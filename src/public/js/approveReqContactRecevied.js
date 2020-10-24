// chấp nhận yêu cầu kết bạn bên tab yêu cầu kết bạn

function approveRequestContactRecevied() {
    $(".user-approve-request-contact-received").unbind("click").on("click", function () {
        let targetId = $(this).data("uid");

        $.ajax({
            type: "put",
            url: "/contact/approve-request-contact-recevied",
            data: {uid: targetId},
            success: function (data) {
                if(data.success) {
                    let userInfo = $("#request-contact-received").find(`ul li[data-uid = ${targetId}]`);
                    $(userInfo).find("div.user-approve-request-contact-received").remove(); // xóa nút chấp nhận bên tab yêu cầu kết bạn
                    $(userInfo).find("div.user-remove-request-contact-received").remove(); // xóa nút xóa yêu cầu bên tab yêu cầu kết bạn
                    // thêm 2 nút trò chuyện và xóa liên lạc như bên tab danh bạ
                    $(userInfo)
                        .find("div.contactPanel")
                            .append(`
                                <div class="user-talk" data-uid="${targetId}">
                                    Trò chuyện
                                </div>
                                <div class="user-remove-contact action-danger" data-uid="${targetId}">
                                    Xóa liên hệ
                                </div>
                            `);

                    let userInfoHtml = userInfo.get(0).outerHTML;

                    $("#contacts").find("ul").prepend(userInfoHtml);
                    $(userInfo).remove();

                    decreaseNumberNotifContact("count-request-contact-received"); // js/caculateNotif.js
                    increaseNumberNotifContact("count-contacts"); // js/caculateNotif.js

                    // giảm số thông báo navbar
                    decreaseNumberNotification("noti_contact_counter", 1); // js/caculateNotification.js

                    socket.emit("approve-req-contact-received", {contactId: targetId});
                }
            }
        });
    });
};

// nhận phản hồi khi có 1 hủy bỏ kết bạn
socket.on("response-approve-req-contact-received", function(user) {
    // thông báo cho người mời 
    let notif = `<div class="notif-readed-false" data-uid="${ user.id }">
                    <img class="avatar-small" src="images/users/${ user.avatar }" alt=""> 
                    <strong>${ user.username }</strong> đã chấp nhận lời mời kết bạn của bạn!
                </div>`;
    // chèn thông báo mới nhất lên đầu popup notification
    $(".noti_content").prepend(notif);
    // chèn thông báo mới nhất lên đầu modal notification
    $("ul.list-notifications").prepend(`<li>${notif}</li>`);
    
    decreaseNumberNotification("noti_contact_counter", 1); // js/caculateNotification.js
    increaseNumberNotification("noti_counter", 1); // js/caculateNotification.js
   
    decreaseNumberNotifContact("count-request-contact-sent"); // js/caculateNotif.js
    increaseNumberNotifContact("count-contacts"); // js/caculateNotif.js

    $("#request-contact-sent").find(`ul li[data-uid = ${ user.id }]`).remove();
    $("#find-user").find(`ul li[data-uid = ${ user.id }]`).remove();

    let userInfoHtml = `
        <li class="_contactList" data-uid="${ user._id }">
            <div class="contactPanel">
                <div class="user-avatar">
                    <img src="images/users/${ user.avatar }" alt="">
                </div>
                <div class="user-name">
                    <p>
                        ${ user.username }
                    </p>
                </div>
                <br>
                <div class="user-address">
                    <span>&nbsp ${ user.address }</span>
                </div>
                <div class="user-talk" data-uid="${ user._id }">
                    Trò chuyện
                </div>
                <div class="user-remove-contact action-danger" data-uid="${ user._id }">
                    Xóa liên hệ
                </div>
            </div>
        </li>
    `;

    $("#contacts").find("ul").prepend(userInfoHtml);
});

$(document).ready(function () {
    approveRequestContactRecevied(); // js/approveReqContactRecevied.js
});
