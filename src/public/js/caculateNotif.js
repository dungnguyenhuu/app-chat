// giảm số thông báo
function decreaseNumberNotifContact(className) {
    let currentValue = +$(`.${className}`).find("em").text();
    currentValue -= 1;
    if(currentValue === 0){
        $(`.${className}`).html("");
    } else {
        $(`.${className}`).html(`(<em>${currentValue}</em>)`);
    }
};

// tăng số thông báo
function increaseNumberNotifContact(className) {
    let currentValue = +$(`.${className}`).find("em").text();
    currentValue += 1;
    if(currentValue === 0){
        $(`.${className}`).html("");
    } else {
        $(`.${className}`).html(`(<em>${currentValue}</em>)`);
    }
};
