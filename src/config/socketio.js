import passportSocketIo from "passport.socketio";
import { appConfig } from "./appConfig";

let configSoketIo = (io, cookieParser, sessionStore) => {
    io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,
        key: appConfig.SESSION_KEY,
        secret: appConfig.SESSION_SECRET,
        store: sessionStore,
        success: (data, accept) => {
            if(!data.user.logged_in) {
                return accept("Invalid user.", false);
            }
            return accept(null, true);
        },
        fail: (data, message, error, accept) => {
            if(error){
                console.log("Failed connection to socket.io", message);
                return accept(new Error(message), false);
            }
        },
    }));
};

module.exports = configSoketIo;
