var express = require('express');
var app = express();

var stripe = require('stripe')('sk_test_E2acphiJrk1YYk4Dia6hYhkB');

var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');

//Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//Set static folder
app.use(express.static(`${__dirname}/public`));

//INDEX route
app.get('/', function (req, res) {
  res.render('index');
});

//Charge route post request
app.post('/charge', (req, res) => {
  console.log(req.body);

  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  }).then(customer => stripe.charges.create({
    amount: 10000,
    description: "til roll - box of 20",
    currency: 'gbp',
    customer: customer.id
  })).then(charge => res.render('success'));
});

var port = process.env.PORT || 5000;

app.listen(port, function (req, res) {
  console.log('Server Starter MOFO! Your\'re on port: ' + port);
});