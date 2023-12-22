const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const TranslationSchema = new Schema(
    {
        message: String,
        lang: String,
    },
    {
        versionKey: false,
    }
);
const MembersSchema = new Schema(
    {
        user_id: Schema.Types.ObjectId,
        active: Boolean,
    },
    {
        versionKey: false,
    }
);
const MessageSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: "User" },
        message: String,
        date: Date,
        resonse_to: Schema.Types.ObjectId,
        lang: String,
        translations: [TranslationSchema],
    },
    {
        versionKey: false,
    }
);

const ChatroomSchema = new Schema(
    {
        name: String,
        url: String,
        images: String,
        members: [MembersSchema],
        messages: [MessageSchema],
    },
    {
        versionKey: false,
    }
);

// const Members = mongoose.model("Members", MembersSchema);
// const Message = mongoose.model("Message", MessageSchema);
const Chatroom = mongoose.model("Chatroom", ChatroomSchema);

module.exports = {
    // Members,
    // Message,
    Chatroom,
};
