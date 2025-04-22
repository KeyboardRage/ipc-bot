export default {
    type: 1,
    name: "broadcast",
    description: "Dispatch an IPC broadcast to all factions",
    options: [
        {
            type: 3,
            name: "message",
            description: "The message to send",
            required: true,
        }
    ],
};