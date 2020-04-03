var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

// список обработчиков запросов
var handle = {};
handle["/"] = requestHandlers.main;
handle["/css/style.css"] = requestHandlers.loadCss;
handle["/js/main.js"] = requestHandlers.loadJs;
handle["/images/HongKong_happy.jpg"] = requestHandlers.loadHappyHongKong;
handle["/images/HongKong_sad.jpg"] = requestHandlers.loadSadHongKong;
server.start(router.route, handle);