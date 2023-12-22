const express = require("express");
const db = require("../data/db");
const { Chatroom } = require("../data/chatroom");
const User = require("../data/user");
const { wsServer, sendToRoom } = require("../realtime");
const { translate } = require("../translation");
const router = express.Router();
const { SUPPORTED_LANGUAGES } = require("../misc/constants");

router.get("/", async function (req, res, next) {
    const rooms = await Chatroom.aggregate([
        { $project: { _id: 1, name: 1, total_members: { $size: "$members" } } },
    ]);

    if (!rooms.length) return res.status(200).send({ data: [] });

    return res.status(200).send({ data: rooms });
});

router.get("/mine/:id", async function (req, res, next) {
    if (!req.params.id) {
        return res.status(403).send({ error: "Unknown user" });
    }

    const rooms = await Chatroom.find(
        { "members.user_id": req.params.id },
        "name images url"
    );

    if (!rooms.length) return res.status(404).send({ error: "Not found" });

    return res.status(200).send({ data: rooms });
});

router.get("/:id", async function (req, res, next) {
    try {
        if (!req.params.id)
            return res.status(404).send({ error: "Missing id. Choose a room" });
        let room = await Chatroom.findOne({ _id: req.params.id }).populate(
            "messages.user_id",
            "username"
        );

        if (!room) return res.status(404).send({ error: "Room not found" });
        return res.status(200).send({ data: room });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ error: "SERVER ERROR" });
    }
});

router.post("/", async function (req, res, next) {
    const { name } = req.body;

    try {
        if (!name)
            return res.status(403).send({ error: "Room Name mandatory" });
        const room = await Chatroom.create({ name });

        if (!room) throw new Error("Unable to create room");

        return res.send({ success: true });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.post("/:id/join", async function (req, res, next) {
    try {
        if (!req.params.id)
            return res.status(404).send({ error: "Missing id. Choose a room" });

        const { user_id } = req.body;

        const user = await User.findOne({ _id: user_id });

        if (!user) return res.status(403).send({ error: "Unknown user" });

        const room = await Chatroom.findOne({
            _id: req.params.id,
            "members.user_id": { $ne: user_id },
        });

        if (room) {
            room.members.push({ user_id: user._id, active: true });
            await room.save();
        }

        return res.status(200).send({ success: true });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.post("/:id/message", async function (req, res, next) {
    try {
        if (!req.params.id)
            return res.status(404).send({ error: "Missing id. Choose a room" });

        const { message, user_id, lang, response_to } = req.body;
        if (!lang) return res.status(403).send({ error: "Unknown language" });
        if (!message) return res.status(403).send({ error: "Empty message" });
        if (!user_id) return res.status(403).send({ error: "Unknown user" });
        const user = await User.findOne({ _id: user_id }, "username");

        if (!user) return res.status(403).send({ error: "Unknown user" });

        const room = await Chatroom.findOne({
            _id: req.params.id,
            "members.user_id": user_id,
        });

        if (!room)
            return res
                .status(404)
                .send({ error: "Room not found where user is member" });

        const targetMessage = room.messages.find(
            (message) => message._id === response_to
        );

        const chat = {
            message,
            date: new Date(),
            user_id,
            lang,
            response_to: targetMessage?._id,
        };

        // translate to supported languages
        const to = SUPPORTED_LANGUAGES.filter(
            (language) => language.code !== lang
        ).map((language) => language.code);

        const [{ translations }] = await translate(chat.message, lang, to);
        // console.log(JSON.stringify(translations));

        // TODO: implement caching with least-use-pruning

        chat.translations = translations.map((item) => ({
            message: item.text,
            lang: item.to,
        }));

        room.messages.push(chat);
        await room.save();

        sendToRoom(req.params.id, { ...chat, user_id: user });

        return res.status(200).send({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message });
    }
});

module.exports = router;
