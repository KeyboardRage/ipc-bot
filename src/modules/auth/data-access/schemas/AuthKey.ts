import type { IAuthData } from "../../types";
import { Schema } from "mongoose";

const schema = new Schema<IAuthData>({
    "_id": String,
    "authKey": {
        type: String,
        required: true,
    },
    "expiresAt": {
        type: Date,
        required: true,
    }
}, {
    collection: "authkeys",
    timestamps: true,
    versionKey: false,
});

export default schema;