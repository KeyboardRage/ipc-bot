import type { FromSchema } from "json-schema-to-ts";

export const headers = {
    type: "object",
    properties: {
        "authorization": {
            type: "string",
            minLength: 64,
            maxLength: 2048,
        },
    },
    required: ["authorization"],
} as const;

export const body = {
    type: "object",
    properties: {
        "content": {
            type: "string",
            minLength: 1,
            maxLength: 2048,
        },
    },
    required: ["content"],
} as const;

export const responses = {} as const;

export type RequestTypes = {
    Headers: FromSchema<typeof headers>;
    Body: FromSchema<typeof body>;
}