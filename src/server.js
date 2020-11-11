import express from "express";
import ConnectDB from "./config/connectDB";
import ConfigViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import session from "./config/session";
import passport from "passport";
import { appConfig } from "./config/appConfig";
import http from "http";
import socketio from "socket.io";
import initSockets from "./sockets/index";
import cookieParser from "cookie-parser";
import configSoketIo from "./config/socketio";

// khởi tại app
let app = express();

// init server with socket.io and express app
let server = http.createServer(app);
let io = socketio(server);

// kết nối với MongoDB
ConnectDB();

// config session
session.config(app);

// tạo view engine
ConfigViewEngine(app);

// enable post data for request
app.use(bodyParser.urlencoded({ extended: true }));

// enable flash messages
app.use(connectFlash());

// sử dụng cookie-parser
app.use(cookieParser());

// congfig passport
// thêm is
app.use(passport.initialize());
app.use(passport.session());

// tạo routes
initRoutes(app);

// confif socketio
configSoketIo(io, cookieParser, session.sessionStore);

// tạo các sockets
initSockets(io);

server.listen(appConfig.port, appConfig.hostname, () => {
    console.log(`running ${appConfig.hostname}: ${appConfig.port}`);
});
