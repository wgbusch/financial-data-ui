import {notification} from "antd";


export const successNotification = (message) => {
    notification.info({
        message: message,
        description: '',
        placement: "bottomLeft"
    });
}

export const failureNotification = (message) => {
    notification.error({
        message: message,
        description: '',
        placement: "bottomLeft"
    });
}