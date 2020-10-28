const dotenv = require('dotenv').config();
const app = require("express")();
const stripe = require("stripe")(process.env.SECRET_KEY);
const bodyParser = require('body-parser');

const calculateOrderAmount = require('./helpers/calculateOrderAmount');
const calculateApplicationFeeAmount = require('./helpers/calculateApplicationFeeAmount');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("hello world"));

app.post('/create-payment-intent', async (req, res) => {
  
    const data = req.body;
    const amount = calculateOrderAmount(data.items)

    await stripe.paymentIntents.create({
      amount: amount,
      currency: data.currency,
      //application_fee_amount: calculateApplicationFeeAmount(amount)
    }).then(function(paymentIntent) {
      try {
        return res.send({
          publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
          clientSecret: paymentIntent.client_secret
        });
      } catch (err) {
        return res.status(500).send({
          error: err.message
        });
      }
    }); 
});

app.listen(3000, () => console.log("We are up and running on port 3000"));