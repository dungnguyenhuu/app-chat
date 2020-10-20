// giảm số thông báo trên thanh navbar
function decreaseNumberNotification(className) {
    let currentValue = +$(`.${className}`).text();
    currentValue -= 1;
    if(currentValue === 0){
        $(`.${className}`).css("display", "none").html("");
    } else {
        $(`.${className}`).css("display", "block").html(currentValue);
    }
};

// tăng số thông báo trên thanh navbar
function increaseNumberNotification(className) {
    let currentValue = +$(`.${className}`).text();
    currentValue += 1;
    if(currentValue === 0){
        $(`.${className}`).css("display", "none").html("");
    } else {
        $(`.${className}`).css("display", "block").html(currentValue);
    }
};