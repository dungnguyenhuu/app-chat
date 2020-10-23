// giảm số thông báo trên thanh navbar
function decreaseNumberNotification(className, number) {
    let currentValue = +$(`.${className}`).text();
    currentValue -= number;
    if(currentValue === 0){
        $(`.${className}`).css("display", "none").html("");
    } else {
        $(`.${className}`).css("display", "block").html(currentValue);
    }
};

// tăng số thông báo trên thanh navbar
function increaseNumberNotification(className, number) {
    let currentValue = +$(`.${className}`).text();
    currentValue += number;
    if(currentValue === 0){
        $(`.${className}`).css("display", "none").html("");
    } else {
        $(`.${className}`).css("display", "block").html(currentValue);
    }
};