// rt.js
function getTimestamp() {
  return Date.now();
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("submitStep1").addEventListener("click", function (event) {
    event.preventDefault();
    var jsonToSend = document.getElementsByName('jsonToSend')[0].value;

    fetch('/RTBAcreation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonToSend: jsonToSend
        }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        if (data.response && data.response.links && data.response.links[0] && data.response.links[0].href) {
          const approvalLink = data.response.links[0].href;
          console.log(approvalLink);
          document.querySelector('#responseStep1 pre').innerHTML = "TOKEN ID : " + JSON.stringify(data.response.token_id, null, 2);

          document.querySelector('#responseStep1').classList.remove('hidden');

          // create link to approval
          document.querySelector('#approvalLink').href = approvalLink;
          document.querySelector('#approvalLink').classList.remove('hidden');

          document.querySelector('#approvalLink').onclick = function () {
            document.querySelector('#token_id').value = data.response.token_id;
            document.querySelector('#token_id').classList.remove('hidden');
            document.querySelector('#step2').classList.remove('hidden');
            document.querySelector('#responseStep1').classList.remove('hidden');

          }


        } else {
          console.error("issue with JSON approval link not found.");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  });


  document.getElementById("btnStep2").addEventListener("click", function (event) {
    event.preventDefault();
    var jsonToSend = document.getElementById('token_id').value;

    fetch('/RTBAcreationAfterApproval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonToSend: jsonToSend
        }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        if (data.response) {

          document.querySelector('#responseStep2 pre').innerHTML = prettyPrintObject(data.response)
          document.getElementById("responseStep2").classList.remove('hidden');

          document.getElementById('jsonToSendTransaction').value = jsonForTransaction.payer.funding_instruments[0].billing.billing_agreement_id = data.response.id

          console.log("jsonForTransaction", jsonForTransaction)

          document.getElementById('jsonToSendTransaction').value = JSON.stringify(jsonForTransaction, null, 2);
          document.getElementById("step3").classList.remove('hidden');


        } else {
          console.error("issue with JSON returned from RTBAcreationAfterApproval.");
        }
        console.log(data)
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  });

  const jsonForTransaction = {
    "intent": "sale",
    "payer": {
      "payment_method": "PAYPAL",
      "funding_instruments": [{
        "billing": {
          "billing_agreement_id": "<%= BAResponseAfterApproval && BAResponseAfterApproval.id ? BAResponseAfterApproval.id : '' %>"
        }
      }]
    },
    "transactions": [{
      "amount": {
        "total": "30.11",
        "currency": "USD",
        "details": {
          "subtotal": "30.00",
          "tax": "0.07",
          "shipping": "0.03",
          "handling_fee": "1.00",
          "shipping_discount": "-1.00",
          "insurance": "0.01"
        }
      },
      "description": "The payment transaction description.",
      "custom": "EBAY_EMS_90048630024435",
      // set invoice number to current timestamp
      "invoice_number": getTimestamp(),
      "payment_options": {
        "allowed_payment_method": "INSTANT_FUNDING_SOURCE"
      },
      "soft_descriptor": "ECHI5786786",
      "item_list": {
        "items": [{
            "name": "hat",
            "description": "Brown hat.",
            "quantity": "5",
            "price": "3",
            "tax": "0.01",
            "sku": "1",
            "currency": "USD"
          },
          {
            "name": "handbag",
            "description": "Black handbag.",
            "quantity": "1",
            "price": "15",
            "tax": "0.02",
            "sku": "product34",
            "currency": "USD"
          }
        ],
        "shipping_address": {
          "recipient_name": "Brian Robinson",
          "line1": "4th Floor",
          "line2": "Unit #34",
          "city": "San Jose",
          "country_code": "US",
          "postal_code": "95131",
          "phone": "011862212345678",
          "state": "CA"
        }
      }
    }],
    "note_to_payer": "Contact us for any questions on your order.",
    "redirect_urls": {
      "return_url": "https://example.com/return",
      "cancel_url": "https://example.com/cancel"
    }
  }


  document.getElementById("btnStep3").addEventListener("click", function (event) {
    event.preventDefault();
    var jsonToSend = document.getElementById('jsonToSendTransaction').value;

    fetch('/transactionOnBA', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonToSend: jsonToSend
        }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);

        document.querySelector('#step3Result pre').innerHTML = prettyPrintObject(data.response)
        document.getElementById("step3Result").classList.remove('hidden');

      })
      .catch((error) => {
        console.error('Error:', error);
      });

  });
});