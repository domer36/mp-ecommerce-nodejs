require('dotenv').config()
var express = require('express');
var exphbs  = require('express-handlebars');
const mercadopago = require('mercadopago')
 
var app = express();
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    const { img, title, price, unit } = req.query
    
    mercadopago.configure({
        access_token: process.env.TOKEN
    })

    let preference = {
        "items": [
            {
                "title": title,
                "picture_url": img,
                "quantity": Number(unit),
                "unit_price": Number(price)
            }
        ]
    }

    mercadopago.preferences.create( preference )
    .then( response => {
        global.init_point = response.body.init_point
        res.render('detail', {
            img: req.query.img, title, price, unit, id_preference: response.body.id
        });
    })
    .catch( err => console.log( err ))



});

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));
 
app.listen(3000);