const Router = require("express");
const bodyParser = require("body-parser");
const { OAuth2Client } = require("google-auth-library");
// const cors = require("cors");

const route = Router();

const client = new OAuth2Client();

const CLIENT_ID = process.env.CLIENT_ID;

// route.use(cors());

route.use(bodyParser.json());

route.get("/request", (req, res) => {
  res.json({ clientId: CLIENT_ID });
});

route.post("/response", async (req, res) => {
  const { idToken, clientId } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: clientId,
    });
    const payload = ticket.getPayload();
    const userId = payload["sub"];

    res.json({ success: true, user: payload });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ success: false, error: "Unauthorized" });
  }
});

module.exports = route;
