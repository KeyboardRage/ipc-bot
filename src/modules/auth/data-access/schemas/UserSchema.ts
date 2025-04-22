import type { IUserData } from "../../../../types.js";
import { Schema } from "mongoose";

const schema = new Schema<IUserData>({
    id: String,
    nickname: String,
    username: String,
    globalName: String,
}, {
    collection: "users",
    timestamps: true,
    versionKey: false,
});

schema.index({ id: 1 }, { unique: true });

export default schema;