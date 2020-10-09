// var express = require("express");
import express from "express";
let app = express();

let hostname = "localhost";
let port = 8888;

app.get("/helloworld", (req, res) => {
    res.send("<h1>Hello World</h1>");
});

app.listen(port, hostname, () => {
    console.log(`running ${hostname}: ${port}`);
});
