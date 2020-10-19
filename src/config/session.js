import session from "express-session";
import connectMongo from "connect-mongo";
import { appConfig } from "./appConfig";
 
let MongoStore = connectMongo(session);

/* this variable is where save session, in this case is mongodb */
let sessionStore = new MongoStore({
    url: `${appConfig.DB_CONNECTION}://${appConfig.DB_HOST}:${appConfig.DB_PORT}/${appConfig.DB_NAME}`,
    autoReconnect: true,
    // autoRemove: "native"
});

/* Congfig session for app
    @param app from exactly express module
*/
let config = (app) => {
    app.use(session({
        key: appConfig.SESSION_KEY,
        secret: appConfig.SESSION_SECRET,
        store: sessionStore,
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000*60*30 // 15min
        }
    }));
};

module.exports = {
    config: config,
    sessionStore: sessionStore,
};
