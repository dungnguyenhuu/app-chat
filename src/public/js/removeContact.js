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

    /* xóa tiếp user ở phần chat */

});

$(document).ready(function () {
    removeContact(); // js/removeContact.js
});
