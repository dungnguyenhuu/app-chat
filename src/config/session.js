import session from "express-session";
import connectMongo from "connect-mongo";

let MongoStore = connectMongo(session);

let DB_CONNECTION = "mongodb";
let DB_HOST = "localhost";
let DB_PORT = 27017;
let DB_NAME = "app_chat";
let DB_USERNAME = "";
let DB_PASSWORD = "";


/* this variable is where save session, in this case is mongodb */
let sessionStore = new MongoStore({
    url: `${DB_CONNECTION}://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    autoReconnect: true,
    // autoRemove: "native"
});

/* Congfig session for app
    @param app from exactly express module
*/

let configSession = (app) => {
    app.use(session({
        key: "express",
        secret: "mySecret",
        store:sessionStore,
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000*60*15 // 15min
        }
    }));
};

module.exports = configSession;
