function increaseNumberMessageGroup(divId) {
    let currentValue = $(`.right[data-chat=${divId}]`).find("span.show-number-member");
    let newValue = +currentValue.text() + 1;
    currentValue.html(newValue);
};
