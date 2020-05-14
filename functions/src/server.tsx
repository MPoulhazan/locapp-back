import * as functions from "firebase-functions";
import * as firebaseAdmin from "firebase-admin";
export * from "firebase-functions";
import express = require("express");
import bodyParser = require("body-parser");
firebaseAdmin.initializeApp(functions.config().firebase);
import * as BasketController from "./functions/BasketController";
import * as UserController from "./functions/UserController";
import { BasketValidator } from "./Validators/BasketValidator";

const cors = require("cors");
const app = express();

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = async (req: any, res: any, next: any) => {
  if (
    (!req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")) &&
    !(req.cookies && req.cookies.__session)
  ) {
    res.status(403).send("Unauthorized: Authorization not found");
    return;
  }

  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    // Read the ID Token header.
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else if (req.cookies) {
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    res.status(403).send("Unauthorized: No cookie");
    return;
  }

  try {
      console.log('Try Decode token');
    const decodedIdToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    req.user = decodedIdToken;
    next();
    console.log('End decode token');
    return;
  } catch (error) {
    // Unauthorized
    res.status(403).send("Unauthorized: Invalid token");
    return;
  }
};

app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
console.log('Start decode token')
app.use(validateFirebaseIdToken);

console.log('Token ok')

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

console.log('Prepare Apis');
app.get("/users/me", UserController.getAuthentifiedUser);
app.get("/baskets", BasketController.getAllBaskets);        // TODO
app.post("/baskets", BasketValidator, BasketController.post);

export const root = functions.https.onRequest(app);
// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
