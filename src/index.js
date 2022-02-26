"use strict";
exports.__esModule = true;
var express_1 = require("express");
var path_1 = require("path");
var passport_1 = require("passport");
require("./login/patreon");
var config_1 = require("./misc/config");
var app = (0, express_1["default"])();
app.get("/", (function (req, res) {
    res.sendFile(path_1["default"].join(__dirname, "../public/index.html"));
}));
app.get("/login/patreon", passport_1["default"].authenticate("oauth2", { scope: "users pledges-to-me my-campaign", state: '1234' }));
app.get("/auth/patreon/callback", passport_1["default"].authenticate("oauth2", { failureRedirect: "/login" }), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
});
console.log(config_1["default"]);
app.listen(3000);
