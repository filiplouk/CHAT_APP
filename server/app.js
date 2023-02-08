const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require("passport-local").Strategy;

const app = express();
//Setup Socket.io

const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//

require("dotenv").config();

//Middlewares

app.use(bodyParser.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  })
);

//MongoDB Session Store
const store = MongoStore.create({
  mongoUrl: process.env.MONGO_PORT,
  crypto: {
    secret: process.env.MONGOSTORE_SECRET,
  },
});
const sessionMiddleware = session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 60,
  },
});
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

//Middleware for Web Socket Session
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
//

//MongoDB Connection
mongoose.connect(process.env.MONGO_PORT, {
  useNewUrlParser: true,
});

//MongoDB Users
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: { value: true, message: "Please add username" },
    unique: {
      value: true,
      message: "This username is already used. Please choose another username",
    },
  },
  password: {
    type: String,
    required: { value: true, message: "Please add password" },
  },
  email: {
    type: String,
    required: { value: true, message: "Please add email." },
    unique: {
      value: true,
      message: "There is a registered user with this email.",
    },
  },
});

UserSchema.plugin(passportLocalMongoose, {
  usernameField: "username",
  usernameQueryFields: ["username"],
  passwordField: "password",
  hashField: "password",
});

const User = mongoose.model("User", UserSchema);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Routes

app.post("/login", async (req, res, next) => {
  try {
    await passport.authenticate("local", (err, user) => {
      if (err) {
        throw err;
      }
      if (!user) {
        return res
          .status(401)
          .json({ message: "Incorrect username or password." });
      }
      req.login(user, (err) => {
        if (err) {
          throw err;
        }
        return res.status(200).json({ message: "Login successful." });
      });
    })(req, res, next);
  } catch (err) {
    return next(err);
  }
});

app.post("/register", async (req, res, next) => {
  try {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    });
    User.register(newUser, req.body.password, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, () => {
          res.status(201).json({ message: "Registration successful" });
        });
      }
    });
  } catch (err) {
    return next(err);
  }
});

app.get("/chat_page", async (req, res, next) => {
  try {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      return res.json({ authenticated: true });
    }
    return res.json({ authenticated: false });
  } catch (err) {
    next(err);
  }
});

//Socket Server

io.on("connection", (socket) => {
  socket.on("message", (data) => {
    console.log(data);
  });
});

app.use(errorHandler);
//Port

server.listen(5000, () => {
  console.log("Server started on port 5000");
});
