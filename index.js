const request = require("request");
const cron = require("node-cron");

const accountSid = process.env.ACC_SID;
const authToken = process.env.AUTH_TOKEN;

const twilio = require("twilio");
const client = new twilio(accountSid, authToken);

// Call API
function getData() {
  request(
    "https://covidapi.info/api/v1/country/IND",
    { json: true },
    (err, res, body) => {
      if (err) {
        return console.log(err);
      }

      var result =
        body.result[
          Object.keys(body.result)[Object.keys(body.result).length - 1]
        ];

      // console.log(result);
      var msg = `\n Coronavirus Stats (IND): 
                \nConfirmed: ${result.confirmed}
                \nDeaths: ${result.deaths}
                \nRecovered: ${result.recovered}
            `;
      sendNotification(msg);
    }
  );
}

// Send message
function sendNotification(msg) {
  client.messages
    .create({
      body: msg,
      to: process.env.TO,
      from: process.env.FROM
    })
    .then(message => console.log(message.sid));
}

// Create cron job every day
cron.schedule("0 8 * * *", () => {
  getData();
});

// Cron job to send message every 2 hour from 8-23 daily
cron.schedule("0 9-23/2 * * *", () => {
  sendNotification("Its time to wash your hands 🖐");
});
