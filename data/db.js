const mongoose = require("mongoose");

// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set("strictQuery", false);

const mongoDB = "mongodb://127.0.0.1/chatdatabase";

connect().catch((err) => console.log(err));
async function connect() {
    await mongoose.connect(mongoDB);
}
