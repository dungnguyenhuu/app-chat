// chấp nhận yêu cầu kết bạn bên tab yêu cầu kết bạn

function approveRequestContactRecevied() {
    $(".user-approve-request-contact-received").unbind("click").on("click", function () {
        let targetId = $(this).data("uid");
        let targetName = $(this).parent().find("div.user-name>p").text().trim();
        let targetAvatar = $(this).parent().find("div.user-avatar>img").attr("src");
        console.log(targetAvatar);

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

                    // thêm user vào tab danh bạ
                    $("#contacts").find("ul").prepend(userInfoHtml);
                    // xóa user ở tab yêu cầu kết bạn
                    $(userInfo).remove();

                    decreaseNumberNotifContact("count-request-contact-received"); // js/caculateNotif.js
                    increaseNumberNotifContact("count-contacts"); // js/caculateNotif.js

                    // giảm số thông báo navbar
                    decreaseNumberNotification("noti_contact_counter", 1); // js/caculateNotification.js

                    removeContact(); // js/removeContact.js

                    socket.emit("approve-req-contact-received", {contactId: targetId});

                    /** thêm vào phần leftside và rightside */
                    // 1. ẩn modal 
                    // $("#contactsModal").modal("hide");

                    // 2. thêm vào leftSide.ejs
                    let subUserName = targetName;
                    if(subUserName.length > 15) {
                        subUserName = subUserName.substr(0, 14) + "...";
                    }
                    let leftSideData = `
                        <a href="#uid_${ targetId }" class="room-chat" data-target="#to_${ targetId }">
                            <li class="person" data-chat="${ targetId }">
                                <div class="left-avatar">
                                    <div class="dot"></div>
                                    <img src="${ targetAvatar }" alt="">
                                </div>
                                <span class="name">
                                    ${subUserName}
                                </span>
                                <span class="time"></span>
                                <span class="preview convert-emoji"></span>
                            </li>
                        </a>`; 
                    $("#all-chat").find("ul").prepend(leftSideData);
                    $("#user-chat").find("ul").prepend(leftSideData);

                    // 3. handle rightSide.ejs
                    let rightSideData = `
                        <div class="tab-pane right" data-chat="${ targetId }" id="to_${ targetId }">
                            <div class="top">
                                <span>To: <span class="name">${ targetName }</span></span>
                                <span class="chat-menu-right">
                                    <a href="#attachmentsModal_${ targetId }" class="show-attachments" data-toggle="modal">
                                        Tệp đính kèm
                                        <i class="fa fa-paperclip"></i>
                                    </a>
                                </span>
                                <span class="chat-menu-right">
                                    <a href="javascript:void(0)">&nbsp;</a>
                                </span>
                                <span class="chat-menu-right">
                                    <a href="#imagesModal_${ targetId }" class="show-images" data-toggle="modal">
                                        Hình ảnh
                                        <i class="fa fa-photo"></i>
                                    </a>
                                </span>
                            </div>
                            <div class="content-chat">
                                <div class="chat" data-chat="${ targetId }"></div>
                            </div>
                            <div class="write" data-chat="${ targetId }">
                                <input type="text" class="write-chat" id="write-chat-${ targetId }" data-chat="${ targetId }">
                                <div class="icons">
                                    <a href="#" class="icon-chat" data-chat="${ targetId }"><i class="fa fa-smile-o"></i></a>
                                    <label for="image-chat-${ targetId }">
                                        <input type="file" id="image-chat-${ targetId }" name="my-image-chat" class="image-chat" data-chat="${ targetId }">
                                        <i class="fa fa-photo"></i>
                                    </label>
                                    <label for="attachment-chat-${ targetId }">
                                        <input type="file" id="attachment-chat-${ targetId }" name="my-attachment-chat" class="attachment-chat" data-chat="${ targetId }">
                                        <i class="fa fa-paperclip"></i>
                                    </label>
                                    <a href="javascript:void(0)" id="video-chat-${ targetId }" class="video-chat" data-chat="${ targetId }" data-toggle="modal">
                                        <i class="fa fa-video-camera"></i>
                                    </a>
                                    <input type="hidden" id="peer-id" value="">
                                </div>
                            </div>
                        </div>`;
                    $("#screen-chat").prepend(rightSideData);

                    // 4. call function changeScreenChat
                    changeScreenChat();

                     // 5. handle imageModel
                    let imageModalData = `
                        <div class="modal fade" id="imagesModal_${ targetId }" role="dialog">
                            <div class="modal-dialog modal-lg">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                                        <h4 class="modal-title">Hình ảnh</h4>
                                    </div>
                                    <div class="modal-body">
                                        <div class="all-images" style="visibility: hidden;">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    $("body").append(imageModalData);

                    // 6. call function gridPhoto()
                    gridPhotos(5);

                    // 7. handle attachmentModal
                    let attachmentModalData = `
                        <div class="modal fade" id="attachmentsModal_${ targetId }" role="dialog">
                            <div class="modal-dialog modal-lg">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                                        <h4 class="modal-title">Tệp đính kèm</h4>
                                    </div>
                                    <div class="modal-body">
                                        <ul class="list-attachments">
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    $("body").append(attachmentModalData);

                    // 8. update online
                    socket.emit("check-status");

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
                    <span>&nbsp; ${ user.address }</span>
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
    removeContact(); // js/removeContact.js

    /** thêm vào phần leftside và rightside */
    // 1. ẩn modal: nothing code

    // 2. thêm vào leftSide.ejs
    let subUserName = user.username;
    if(subUserName.length > 15) {
        subUserName = subUserName.substr(0, 14) + "...";
    }
    let leftSideData = `
        <a href="#uid_${ user.id }" class="room-chat" data-target="#to_${ user.id }">
            <li class="person" data-chat="${ user.id }">
                <div class="left-avatar">
                    <div class="dot"></div>
                    <img src="images/users/${ user.avatar }" alt="">
                </div>
                <span class="name">
                    ${ subUserName }
                </span>
                <span class="time"></span>
                <span class="preview convert-emoji"></span>
            </li>
        </a>`; 
    $("#all-chat").find("ul").prepend(leftSideData);
    $("#user-chat").find("ul").prepend(leftSideData);

    // 3. handle rightSide.ejs
    let rightSideData = `
        <div class="tab-pane right" data-chat="${ user.id }" id="to_${ user.id }">
            <div class="top">
                <span>To: <span class="name">${ user.username }</span></span>
                <span class="chat-menu-right">
                    <a href="#attachmentsModal_${ user.id }" class="show-attachments" data-toggle="modal">
                        Tệp đính kèm
                        <i class="fa fa-paperclip"></i>
                    </a>
                </span>
                <span class="chat-menu-right">
                    <a href="javascript:void(0)">&nbsp;</a>
                </span>
                <span class="chat-menu-right">
                    <a href="#imagesModal_${ user.id }" class="show-images" data-toggle="modal">
                        Hình ảnh
                        <i class="fa fa-photo"></i>
                    </a>
                </span>
            </div>
            <div class="content-chat">
                <div class="chat" data-chat="${ user.id }"></div>
            </div>
            <div class="write" data-chat="${ user.id }">
                <input type="text" class="write-chat" id="write-chat-${ user.id }" data-chat="${ user.id }">
                <div class="icons">
                    <a href="#" class="icon-chat" data-chat="${ user.id }"><i class="fa fa-smile-o"></i></a>
                    <label for="image-chat-${ user.id }">
                        <input type="file" id="image-chat-${ user.id }" name="my-image-chat" class="image-chat" data-chat="${ user.id }">
                        <i class="fa fa-photo"></i>
                    </label>
                    <label for="attachment-chat-${ user.id }">
                        <input type="file" id="attachment-chat-${ user.id }" name="my-attachment-chat" class="attachment-chat" data-chat="${ user.id }">
                        <i class="fa fa-paperclip"></i>
                    </label>
                    <a href="javascript:void(0)" id="video-chat-${ user.id }" class="video-chat" data-chat="${ user.id }" data-toggle="modal">
                        <i class="fa fa-video-camera"></i>
                    </a>
                    <input type="hidden" id="peer-id" value="">
                </div>
            </div>
        </div>`;
    $("#screen-chat").prepend(rightSideData);

    // 4. call function changeScreenChat
    changeScreenChat();

        // 5. handle imageModel
    let imageModalData = `
        <div class="modal fade" id="imagesModal_${ user.id }" role="dialog">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Hình ảnh</h4>
                    </div>
                    <div class="modal-body">
                        <div class="all-images" style="visibility: hidden;">
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    $("body").append(imageModalData);

    // 6. call function gridPhoto()
    gridPhotos(5);

    // 7. handle attachmentModal
    let attachmentModalData = `
        <div class="modal fade" id="attachmentsModal_${ user.id }" role="dialog">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Tệp đính kèm</h4>
                    </div>
                    <div class="modal-body">
                        <ul class="list-attachments">
                        </ul>
                    </div>
                </div>
            </div>
        </div>`;
    $("body").append(attachmentModalData);

    // 8. update online
    socket.emit("check-status");
});

$(document).ready(function () {
    approveRequestContactRecevied(); // js/approveReqContactRecevied.js
});
