// server.js
const axios = require('axios');
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join("views"));

const {
    PORT
} = dotenv.config().parsed;

app.get('/', async (req, res) => {
    res.render('rt', {
        title: "PayPal Reference Transaction (REST V1)",
        documentation: "https://developer.paypal.com/limited-release/reference-transactions/"
    });
});

app.post('/RTBAcreation', async (req, res) => {
    try {
        const jsonToSend = JSON.parse(req.body.jsonToSend);

        const url = "https://api-m.sandbox.paypal.com/v1/billing-agreements/agreement-tokens";

        const response = await axios.post(url, jsonToSend, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')
            }
        });

        res.json({
            response: response.data
        });
    } catch (error) {
        console.error('Error in RTBAcreation:', error);

        if (error.response) {
            res.status(error.response.status).json({
                error: error.response.data
            });
        } else {
            res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    }
});

app.post('/RTBAcreationAfterApproval', async (req, res) => {
    try {

        const url = "https://api-m.sandbox.paypal.com/v1/billing-agreements/agreements";

        const jsonToSend = {
            token_id: req.body.jsonToSend
        };

        const response = await axios.post(url, jsonToSend, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')
            }
        });

        res.json({
            response: response.data
        });

    } catch (error) {
        console.error('Error in RTBAcreation:', error);

        if (error.response) {
            res.status(error.response.status).json({
                error: error.response.data
            });
        } else {
            res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    }
});

app.post('/transactionOnBA', async (req, res) => {
    try {
        const jsonToSend = JSON.parse(req.body.jsonToSend);
        const url = "https://api-m.sandbox.paypal.com/v1/payments/payment/";

        console.log(jsonToSend);

        const response = await axios.post(url, jsonToSend, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')
            }
        });

        res.json({
            response: response.data
        });
    } catch (error) {
        console.error('Error in transactionOnBA:', error);

        if (error.response) {
            res.status(error.response.status).json({
                error: error.response.data
            });
        } else {
            res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Node server listening at http://localhost:${PORT}/`);
});