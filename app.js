require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const connectDB = require("./server/config/db");
const MongoStore = require("connect-mongo");
const session = require("express-session"); // Add this line

const app = express();
const PORT = 5000 || process.env.PORT;

// connect to database

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) }
  })
);
app.use(express.static("public"));

// templating engine
app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes//main"));
app.use("/", require("./server/routes/admin"));
app.listen(PORT, () => {
  console.log(`server is running in server ${PORT}`);
});
