function callFindUsers(element) {
    if(element.which === 13 || element.type === "click"){ // 13 là sự kiện ấn phím enter
        let keyword = $("#input-find-user-contact").val();
        
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
        $.get(`/contact/find-users/${keyword}`, function (data){
            $("#find-user ul").html(data);
        });
    }
}

$(document).ready(function () {
    $("#input-find-user-contact").bind("keypress", callFindUsers);

    $("#btn-find-user-contact").bind("click", callFindUsers);
});
