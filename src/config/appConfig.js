export const appConfig ={
    max_event_listener: 30,
    hostname: "localhost",
    port: 8888,

    // config MongoDB
    DB_CONNECTION: "mongodb",
    DB_HOST: "localhost",
    DB_PORT: 27017,
    DB_NAME: "app_chat",
    DB_USERNAME: "",
    DB_PASSWORD: "",

    avatar_directory: "src/public/images/users",
    avatar_type: ["image/png", "image/jpg", "image/jpeg"],
    avatar_limit_size: 1048576, // byte = 1MB

    image_message_directory: "src/public/images/chat/message",
    image_message_type: ["image/png", "image/jpg", "image/jpeg"],
    image_message_limit_size: 1048576, // byte = 1MB

    attachment_message_directory: "src/public/images/chat/message",
    attachment_message_limit_size: 1048576, // byte = 1MB
    
    SESSION_KEY: "express.sid",
    SESSION_SECRET: "mySecret",

    general_avatar_group_chat: "group-avatar-trungquandev.png",
};
