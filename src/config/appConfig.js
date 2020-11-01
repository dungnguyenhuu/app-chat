export const appConfig ={
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

    SESSION_KEY: "express.sid",
    SESSION_SECRET: "mySecret",

    general_avatar_group_chat: "group-avatar-trungquandev.png",
};
