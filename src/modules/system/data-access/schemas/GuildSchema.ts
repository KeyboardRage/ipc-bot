import type { IGuild } from "../../types.js";
import { Schema } from "mongoose";

const schema = new Schema<IGuild>({
    "_id": String,
    "name": {
        type: String,
        required: true,
    },
    "channelId": {
        type: String,
    },
    "broadcastEnabled": {
        type: Boolean,
        default: true,
    },
}, {
    collection: "guilds",
    timestamps: false,
    versionKey: false,
});

export default schema;