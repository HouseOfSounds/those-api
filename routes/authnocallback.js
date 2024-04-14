const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const route = express.Router();

route.use(express.json());

// Route for initiating the Google Sign-In process
route.get("/auth/google", (req, res) => {
  const googleClientId = process.env.CLIENT_ID;
  //   const redirectUri = "postmessage";
  const redirectUri = "http://localhost:3000/v1/auth/google/callback";
  const origin = encodeURIComponent("http://localhost:3000");
  const url = `https://accounts.google.com/o/oauth2/auth?response_type=id_token&client_id=${googleClientId}&redirect_uri=${redirectUri}&scope=openid%20email%20profile&nonce=randomnonce&origin=${origin}`;
  res.redirect(url);
  //   res.send(url);
});

// Route for receiving the token and extracting user info
route.post("/auth/google/callback", async (req, res) => {
  const { id_token } = req.body;
  console.log(id_token);
  try {
    const userInfo = await verifyGoogleToken(id_token);
    // Here you can handle the user info, for example, saving it to the database or returning it to the client
    // res.json(userInfo);
    console.log(userInfo);
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
});

// Function to verify the JWT token received from Google
async function verifyGoogleToken(idToken) {
  try {
    const googleCertUrl = "https://www.googleapis.com/oauth2/v3/certs";
    const response = await axios.get(googleCertUrl);
    const { keys } = response.data;
    const key = keys[0];
    const pem = `-----BEGIN CERTIFICATE-----\n${key.x5c[0]}\n-----END CERTIFICATE-----`;
    return jwt.verify(idToken, pem);
  } catch (error) {
    throw error;
  }
}

module.exports = route;
