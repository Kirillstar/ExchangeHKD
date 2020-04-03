var http = require("http"),
    fs = require("fs"),
    ejs = require("ejs");

//функция для запроса на сайт ЦБ
function CentreBankRequest(callback) {
    var content = ""; //Строка, которая будет содержать данные с сайта ЦБ
    //Настройки пути до файла JSON с ежедневным курсом валют на сайте Центробанка
    var options = {
        host: "www.cbr-xml-daily.ru",
        port: 80,
        path: "/daily_json.js"
    };

    //Запрос на сайт Центробанка
    var req = http.request(options, function (res) {
        res.setEncoding("utf-8"); //устанавливаем кодировку для получемых данных

        //Данные поступают порциями, прибавляем к сроке результата каждую порцию
        res.on("data", function (chunck) {
            content += chunck;
        });

        //Все данные пришли
        res.on("end", function () {
            content = JSON.parse(content); //Парсим из строки JSON
            var HKD = content.Valute.HKD.Value; //Курс Гонконского доллара
            var PreviousHKD = content.Valute.HKD.Previous; //Курс Гонконского доллара за вчерашний день
            var diff = HKD - PreviousHKD; //Изменение курса

            //Передаем данные в обработчик запроса
            var obj = {};
            obj.HKD = HKD;
            obj.diff = diff;
            callback(obj);
        });
    });
    req.end();
}
//обработчик запроса для главной страницы
function main(response) {
    console.log("Request handler 'main' was called.");
    CentreBankRequest(function (data) {
        //считывание HTML-страницы
        fs.readFile('./views/index.html', "utf-8", function (err, html) {
            if (err) {
                throw err;
            }
            var HKD = data.HKD;
            var diff = data.diff.toFixed(4);
            var rendered = ejs.render(html, {HKD:HKD, diff: diff}); //С помощью щаблонизатора вставляем данные на страницу
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(rendered);
            response.end();
        });
    });
}
//обработчик запроса стилей
function loadCss(response) {
    fs.readFile('./css/style.css', "utf-8", function (err, css) {
        if (err) {
            throw err;
        }
        response.writeHead(200, {"Content-Type": "text/css"});
        response.write(css);
        response.end();
    });
}
//обработчик запроса скрипта калькулятора
function loadJs(response) {
    fs.readFile('./js/main.js', "utf-8", function (err, js) {
        if (err) {
            throw err;
        }
        response.writeHead(200, {"Content-Type": "text/javascript"});
        response.write(js);
        response.end();
    });
}
//обработчики запросов изображений
function loadHappyHongKong(response) {
    var HongKongHappy = fs.readFileSync("./images/HongKong_happy.jpg");
    response.writeHead(200, {"Content-Type": "image/jpg"});
    response.end(HongKongHappy, 'binary');
}
function loadSadHongKong(response) {
    var HongKongSad = fs.readFileSync("./images/HongKong_sad.jpg");
    response.writeHead(200, {"Content-Type": "image/jpg"});
    response.end(HongKongSad, 'binary');
}

exports.main = main;
exports.loadCss = loadCss;
exports.loadJs = loadJs;
exports.loadHappyHongKong = loadHappyHongKong;
exports.loadSadHongKong = loadSadHongKong;