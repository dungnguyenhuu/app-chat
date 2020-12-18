function loadMember() {
    $(".group-chat").unbind("click").on("click", function () {
        let groupId = $(this).data("chat");
        
    });
}

$(document).ready(function () {
    loadMember();
});