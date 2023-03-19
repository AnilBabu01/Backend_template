const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
var cors = require("cors");
const db = require("./Helper/Connect");

const User = require("./Routes/User");
const Admin = require("./Routes/Admin");
const Payment = require("./Routes/Payment");
// to run migrations run command - --------  npm run migrate ---------------------

app.use(cors());
app.use(express.static(__dirname + "/Documentation"));
app.use(express.json({ limit: "50mb" }));

app.get("/test", (req, res) => {
  res.send("<h2>working api's</h2>");
});

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/Documentation/index.html");
});

app.use("/payment", Payment);
app.use("/api", User);
app.use("/admin", Admin);

app.use("*", (req, res) => {
  return res.status(404).json({
    status: false,
    msg: "No Route Found!!",
  });
});

db.sync({ sync: true }).then((req) => {
  app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
  });
});
