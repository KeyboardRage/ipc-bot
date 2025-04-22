import type { SchemaDefinition } from "mongoose";
import mongoose from "mongoose";

const { Schema } = mongoose;

export default class DocSchema<T> extends Schema<T> {
    constructor(definition?: SchemaDefinition, options?: any) {
        super(definition, options);
    }
}