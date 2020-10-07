var express = require("express");
var app = express();

var hostname = "localhost";
var port = 8888;

app.get("/helloworld", (req, res) => {
    res.send("<h1>Hello World</h1>");
});

app.listen(port, hostname, () => {
    console.log(`running ${hostname}: ${port}`);
});