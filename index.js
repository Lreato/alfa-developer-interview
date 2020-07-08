const express = require("express");
const app = express();
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const request = require('request');
const { log } = require("console");
const { stringify } = require("querystring");


app.engine('handlebars', handlebars({ defaultLayout: 'main' })) //chama o arquivo main de dentro da pasta layout
app.set('view engine', 'handlebars')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Rotas

app.get('/', function (req, res) {
  res.redirect('/home')
});

app.get('/adicionar', function (req, res) { //Rota GET
  res.render('formulario.handlebars')
})

app.get('/aeroportos/:search?', function(req,res) {
  if (req.params.search) {
    request.get("https://services.odata.org/TripPinRESTierService/(S(ctpn323ovytfqtzxrhwsec3p))/Airports?$filter=contains(Location/Address,'" + req.params.search  + "')", function (error, response, body) {
      if (response.statusCode === 200) {
        var read = JSON.parse(response.body)
        res.render('aeroporto.handlebars', { posts: read.value })
      } else {
        res.send({ "mensagem": "Ocorreu um erro na conexão" })
      }
    });
  } else {
    request.get("https://services.odata.org/TripPinRESTierService/(S(ctpn323ovytfqtzxrhwsec3p))/Airports", function (error, response, body) {
      if (response.statusCode === 200) {
        var read = JSON.parse(response.body)
        res.render('aeroporto.handlebars', { posts: read.value })
      } else {
        res.send({ "mensagem": "Ocorreu um erro na conexão" })
      }
    });
  }
})

app.get('/home/:search?', function (req, res) { 
  if (req.params.search) {
    request.get("https://services.odata.org/TripPinRESTierService/(S(ctpn323ovytfqtzxrhwsec3p))/People?$filter=contains(UserName,'" + req.params.search + "')", function (error, response, body) {
      if (response.statusCode === 200) {
        var read = JSON.parse(response.body)
        res.render('home.handlebars', { posts: read.value })
      } else {
        res.send({ "mensagem": "Ocorreu um erro na conexão" })
      }
    });
  } else {
    request.get("https://services.odata.org/TripPinRESTierService/(S(ctpn323ovytfqtzxrhwsec3p))/People", function (error, response, body) {
      if (response.statusCode === 200) {
        var read = JSON.parse(response.body)
        res.render('home.handlebars', { posts: read.value })
      } else {
        res.send({ "mensagem": "Ocorreu um erro na conexão" })
      }
    });
  }
})


app.post('/add', function (req, res) {
  var body = {
    "UserName": req.body.username,
    "FirstName": req.body.firstname,
    "LastName": req.body.lastname,
    "Emails": [
      req.body.emails
    ],
    "AddressInfo": [
      {
        "Address": req.body.address,
        "City": {
          "Name": req.body.name,
          "CountryRegion": req.body.countryregion,
          "Region": req.body.region
        }
      }
    ]
  }
  request.post('https://services.odata.org/TripPinRESTierService/(S(ctpn323ovytfqtzxrhwsec3p))/People', { json: body }, function (error, response, body) {
    if (response.statusCode == 201) {
      res.redirect('/home')
    }
    else {
      res.send("Ocorreu um erro")
    }
  });
})

app.listen(8081, function () {
  console.log("Servidor Rodando na url http://localhost:8081");
}); //ultima linha do codigo
