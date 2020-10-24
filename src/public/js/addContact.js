/* contactModel.ejs */

// thêm vào danh bạ liên lạc
function addContact() {
    $(".user-add-new-contact").bind("click", function() {
        let targetId = $(this).data("uid");
        $.post("/contact/add-new", {uid: targetId}, function (data) {
            if(data.success) {
                $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).hide();
                $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${targetId}]`).css("display", "inline-block");
                increaseNumberNotifContact("count-request-contact-sent"); // js/caculateNotif.js

                increaseNumberNotification("noti_contact_counter", 1); // js/caculateNotification.js


                let userInfoHtml = $("#find-user").find(`ul li[data-uid = ${targetId}]`).get(0).outerHTML;
                // thêm vào đang chờ xác nhận
                $("#request-contact-sent").find("ul").prepend(userInfoHtml);

                removeRequestContactSent(); // js/removeRequestContactSent.js
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
    increaseNumberNotification("noti_contact_counter", 1);
    increaseNumberNotification("noti_counter", 1);

    let userInfoHtml = `<li class="_contactList" data-uid="${ user.id }">
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
                                <div class="user-acccept-contact-received" data-uid="${ user.id }">
                                    Chấp nhận
                                </div>
                                <div class="user-remove-request-contact-received action-danger" data-uid="${ user.id }">
                                    Xóa yêu cầu
                                </div>
                            </div>
                        </li>`;
    // thêm vào yêu cầu kết bạn
    $("#request-contact-received").find("ul").prepend(userInfoHtml);
    removeRequestContactRecevied(); // js/removeRequestContactRecevied.js
});
