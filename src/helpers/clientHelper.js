import moment from "moment";
import "moment/locale/vi";

export let bufferToBase64 = (bufferForm) => {
    return Buffer.from(bufferForm).toString("base64");
};

export let lastItemOfArray = (array) => {
    if(!array.length) {
        return [];
    }
    return array[array.length - 1];
};

export let convertTimestamp = (timestamp) => {
    if(!timestamp){
        return "";
    }
    return moment(timestamp).local("vi").startOf("seconds").fromNow();
};
