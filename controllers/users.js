const mongoose = require("mongoose");
const Users = mongoose.model("Users");
const Cart = mongoose.model("Cart");

module.exports = app => {
    app.post("/register", async (req, res) => {
        const { username, password } = req.body;
        const user = new Users({
            username,
            password
        });

        try {
            await user.save();
            const temp = await Users.findOne({ username: username });
            const cart = new Cart({
                _user: temp._id
            });
            res.send("User registered succesfully with ID = " + temp._id);
            await cart.save();
        } catch (err) {
            console.log(err);
            res.sendStatus(500).send(err);
        }
    });
    app.get("/check/:uname", async (req, res) => {
        let uname = req.params.uname;
        const temp = await Users.findOne({ username: uname });
        if (!temp) {
            res.sendStatus(400);
        }
        res.sendStatus(200);
    });
};
