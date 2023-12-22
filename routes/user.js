const express = require("express");
const db = require("../data/db");
const User = require("../data/user");
const router = express.Router();

/* GET user */
router.get("/:username", async function (req, res, next) {
    const user = await User.findOne(
        { username: req.params.username },
        "name username"
    );

    if (!user) return res.status(404).send({ error: "Account not found" });
    return res.status(200).send({ data: user });
});

router.post("/", async function (req, res, next) {
    const { name, username } = req.body;

    try {
        if (!name) return res.status(403).send({ error: "Missing name" });
        if (!username)
            return res.status(403).send({ error: "Missing username" });

        const exists = await User.findOne({ username });
        if (exists)
            return res.status(403).send({ error: "Not able to use username" });

        const user = await User.create({ name, username });

        if (!user) throw new Error("Unable to create user");

        return res.send({ data: { name: user.name, username: user.username } });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

module.exports = router;
