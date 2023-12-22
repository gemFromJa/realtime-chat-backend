var { v4: uuidv4 } = require("uuid");
var WebSocket = require("ws");
var wsServer = new WebSocket.Server({ noServer: true });

const rooms = {};

wsServer.on("connection", (ws, request) => {
    const uuid = uuidv4();
    const leave = (room) => {
        // not present: do nothing
        if (!rooms[room][uuid]) return;

        // if the one exiting is the last one, destroy the room
        if (Object.keys(rooms[room]).length === 1) {
            delete rooms[room];
        } else {
            delete rooms[room][uuid];
        }
    };

    ws.on("error", console.error);

    ws.on(
        "message",
        (/* { message, meta, room, ...rest } */ data, isBinary) => {
            const { meta, message, room } = JSON.parse(data.toString());

            if (meta === "join") {
                if (!rooms[room]) rooms[room] = {};
                if (!rooms[room][uuid]) rooms[room][uuid] = ws;
            } else if (meta === "leave") {
                leave(room);
            } else {
                sendToRoom(room, message);
                // wsServer.clients.forEach(function each(client) {
                //     if (client.readyState === WebSocket.OPEN) {
                //         client.send(message, { binary: isBinary });
                //     }
                // });
            }
        }
    );

    ws.on("close", ({}) => {
        Object.keys(rooms).forEach((room) => leave(room));
    });
});

function sendToRoom(room, message) {
    if (rooms[room]) {
        Object.entries(rooms[room]).forEach(([, socket]) =>
            socket.send(JSON.stringify({ meta: "message", message }))
        );
    }
}

module.exports = {
    wsServer,
    sendToRoom,
};
