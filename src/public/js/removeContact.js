// xóa bạn bè bên tab danh bạ

function removeContact() {
    $(".user-remove-contact").unbind("click").on("click", function () {
        let targetId = $(this).data("uid");
        let username = $(this).parent().find("div.user-name").text().trim();

        Swal.fire({
            title: `Bạn chắc chắn muốn hủy liên lạc với ${username}?`,
            text: "Bạn không thể hoàn tác quá trình này!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2ECC71",
            cancelButtonColor: "#FF7675",
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Hủy",
          }).then((result) => {
            if(!result.value){
                return false;
            }
            $.ajax({
                type: "delete",
                url: "/contact/remove-contact",
                data: {uid: targetId},
                success: function (data) {
                    if(data.success) {
                        $("#contacts").find(`ul li[data-uid = ${targetId}]`).remove();
                        decreaseNumberNotifContact("count-contacts"); // js/caculateNotif.js
                        socket.emit("remove-contact", {contactId: targetId});

                        /** Xóa đi ở phần leftside và rightside  */
                        // 0. check active
                        let checkActive = $("#all-chat").find(`li[data-chat=${targetId}]`).hasClass("active");

                        // 1. xóa ở leftSide.ejs
                        $("#all-chat").find(`ul a[href = "#uid_${ targetId }"]`).remove();
                        $("#user-chat").find(`ul a[href = "#uid_${ targetId }"]`).remove();

                        // 2. xóa bên rightside.ejs
                        $("#screen-chat").find(`div#to_${ targetId }`).remove();

                        // 3. xóa imageModal
                        $("body").find(`div#imagesModal_${ targetId }`).remove();

                        // 4. xóa attachmentModal
                        $("body").find(`div#attachmentsModal_${ targetId }`).remove();

                        // 5. click first conversation
                        if(checkActive) {
                            $("ul.people").find("a")[0].click();
                        }
                    }
                }
            });
            
        });
    });
};

// nhận phản hồi khi có 1 hủy bỏ kết bạn
socket.on("response-remove-contact", function(user) {
   
    $("#contacts").find(`ul li[data-uid = ${user.id}]`).remove();
    decreaseNumberNotifContact("count-contacts"); // js/caculateNotif.js

    /** Xóa đi ở phần leftside và rightside  */
    // 0. check active
    let checkActive = $("#all-chat").find(`li[data-chat=${ user.id }]`).hasClass("active");

    // 1. xóa ở leftSide.ejs
    $("#all-chat").find(`ul a[href = "#uid_${ user.id }"]`).remove();
    $("#user-chat").find(`ul a[href = "#uid_${ user.id }"]`).remove();

    // 2. xóa bên rightside.ejs
    $("#screen-chat").find(`div#to_${ user.id }`).remove();

    // 3. xóa imageModal
    $("body").find(`div#imagesModal_${ user.id }`).remove();

    // 4. xóa attachmentModal
    $("body").find(`div#attachmentsModal_${ user.id }`).remove();

    // 5. click first conversation
    if(checkActive) {
        $("ul.people").find("a")[0].click();
    }
});

$(document).ready(function () {
    removeContact(); // js/removeContact.js
});
