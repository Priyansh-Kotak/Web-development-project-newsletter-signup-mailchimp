require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
// const request = require("request");
// const https = require("https");
// const { log } = require("console");
const path = require("path");

// setup express server
const app = express();

// configure middlewares
const Mailchimp = require("mailchimp-api-v3");
app.use(bodyParser.urlencoded({ extended: true }));

// mailchimp configuration
const mailchimp = new Mailchimp(process.env.API_KEY);

app
  .route("/")
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "pages", "index.html"));
  })
  .post((req, res) => {
    // Subscribe a user to a list
    const { fnamee, lnamee, email } = req.body;
    console.log({ fnamee, lnamee, email });

    mailchimp
      .post(`/lists/${process.env.MAILCHIMP_LIST_ID}/members`, {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fnamee,
          LNAME: lnamee,
        },
      })
      .then((results) => {
        console.log(results);
        res.sendFile(path.join(__dirname, "pages", "success.html"));
      })
      .catch(function (err) {
        console.log(err);
        res.sendFile(path.join(__dirname, "pages", "failure.html"));
      });

    // console.log(fnamee);
    // console.log(lnamee);
    // console.log(email);

    // const data = {
    //   members: [
    //     {
    //       email_address: email,
    //       status: "subscribed",
    //       merge_fields: {
    //         FNAME: fnamee,
    //         LNAME: lnamee,
    //       },
    //     },
    //   ],
    // };

    // const options = {
    //   method: "POST",
    //   auth: process.env.API_KEY,
    // };

    // const request = https.request(url, options, (response) => {
    //   if (response.statusCode === 200) {
    //     res.sendFile(__dirname + "/success.html");
    //   } else {
    //     res.sendFile(__dirname + "/failure.html");
    //   }

    //   response.on("data", function (data) {
    //     console.log(JSON.parse(data));
    //   });
    // });

    // request.write(jasondata);
    // request.end();
  });

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT, () =>
  console.log(`🚨 Server started at http://localhost:${process.env.PORT}`)
);
