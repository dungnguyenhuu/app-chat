function addFriendsToGroup() {
    $("ul#group-chat-friends").find("div.add-user").bind("click", function() {
        let uid = $(this).data("uid");
        $(this).remove();
        let html = $("ul#group-chat-friends").find("div[data-uid=" + uid + "]").html();

        let promise = new Promise(function(resolve, reject) {
            $("ul#friends-added").append(html);
            $("#groupChatModal .list-user-added").show();
            resolve(true);
        });
        promise.then(function(success) {
            $("ul#group-chat-friends").find("div[data-uid=" + uid + "]").remove();
        });
    });
}
  
function cancelCreateGroup() {
$("#cancel-group-chat").bind("click", function() {
    $("#groupChatModal .list-user-added").hide();
    if ($("ul#friends-added>li").length) {
        $("ul#friends-added>li").each(function(index) {
            $(this).remove();
        });
    }
});
}

function callSearchFriends(element) {
    if(element.which === 13 || element.type === "click"){ // 13 là sự kiện ấn phím enter
        let keyword = $("#input-search-friends-to-add-group-chat").val();
        
        if(keyword.length < 3 || keyword.length > 17){
            alertify.notify("Nhập ít nhất 3 kí tự và tối đa 17 kí tự", "error", 5);
            return false; 
        }

        /* let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
        if(!regexKeyword.test(keyword)){
            alertify.notify("Lỗi từ khóa tìm kiếm, không được có kí tự đặc biệt", "error", 5);
            return false; 
        } */

        // đưa kết quả tìm kiếm ra giao diện
        $.get(`/contact/search-friends/${keyword}`, function (data){
            $("ul#group-chat-friends").html(data);
            // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
            addFriendsToGroup();

            // Action hủy việc tạo nhóm trò chuyện
            cancelCreateGroup();
        });
    }
}

function callCreatedGroup() {

}

$(document).ready(function () {
    // gõ và ấn enter
    $("#input-search-friends-to-add-group-chat").bind("keypress", callSearchFriends);

    // click icon tìm kiếm
    $("#btn-search-friends-to-add-group-chat").bind("click", callSearchFriends);
});
