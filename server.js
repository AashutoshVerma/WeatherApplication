var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");

var app = express();
// app.use(json());./

app.use(cors());
app.use(express.json());
app.listen(8080, () => {
  console.log("Server Started!!");
});

mongourl = "mongodb://127.0.0.1:27017/WeatherApp";

mongoose
  .connect(mongourl, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

const UserSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
  },
  { collection: "Users" }
);

var user = mongoose.model("Users", UserSchema);
app.get("/getusers", async (req, res) => {
  try {
    const data = await user.find({});
    res.send(JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const findUser = await user.findOne({ username });
    if (findUser) {
      console.log(findUser);
      console.log(password + " : db : " + findUser.password);
      if (findUser) {
        if (password === findUser.password) {
          res.send({ status: "ok", data: findUser });
        } else {
          res.send({
            status: "not Ok",
          });
        }
      }
    } else {
      res.send({ status: "User Not Found  " });
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/createUser", async (req, res) => {
  try {
    {
      const { username, password } = req.body;
      const findUser = await user.findOne({ username });
      if (findUser) {
        res.send({ status: "User Exists" });
      } else {
        var newUser = user.create({ username, password });
        console.log(newUser);
        res.send({ status: "User Created" });
      }
    }
  } catch (error) {
    console.log(error);
  }
});
