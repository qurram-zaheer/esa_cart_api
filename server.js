const express = require("express");
const keys = require("./config/dev");

/* ------------------------- Importing model schemas ------------------------ */

require("./models/catalog");
require("./models/users");
require("./models/cart");

/* ----------------------------- Mongoose config ---------------------------- */

const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", true);
mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

/* ----------------------------- Express config ----------------------------- */

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* ------------------------ Implementing controllers ------------------------ */

require("./controllers/users")(app);
require("./controllers/products")(app);
require("./controllers/cart")(app);

app.listen(5000, () => console.log("Server is listening on port 5000"));
