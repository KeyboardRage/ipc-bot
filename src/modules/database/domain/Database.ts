import type { ClientSession, ConnectOptions, Model } from "mongoose";
import mongoose from "mongoose";
import type DocSchema from "./DocSchema.js";

type Connection = mongoose.Connection;
const { Types } = mongoose;

interface IDBServiceDependencies {
    config: ConnectOptions;
}

export default class DocDBService {
    #db: Connection;

    constructor(dependencies: IDBServiceDependencies) {
        this.#db = mongoose.createConnection(process.env.MONGO_URI, dependencies.config);
    }

    /**********************
     * INSTANCE
     **********************/

    get db(): Connection {
        return this.#db;
    }

    /**
     * Access the models of the DB connection
     */
    get models(): Readonly<{ [p: string]: Model<any> }> {
        return this.db.models;
    }

    /**
     * Returns a specific model instance.
     * Alias of `models[modelName]`, but offers nicer typing if you provide the generic for it.
     */
    getModel<T>(modelName: string): Model<T> {
        return this.db.models[modelName];
    }

    /**********************
     * UTILITY METHODS
     **********************/
    /**
     * Checks if a given ID is a valid ObjectId
     * @param id
     */
    static isValidObjectId(id: string): boolean {
        if (typeof (id) !== "string") return false;
        if (id.length !== 24) return false;
        if (/^[\da-f]+$/.test(id) !== true) return false;

        const ObjectId = new Types.ObjectId(id).toHexString();
        return ObjectId === id;
    }

    /**
     * Checks if a given ID is a valid ObjectId
     * @param id
     */
    isValidObjectId(id: string): boolean {
        return DocDBService.isValidObjectId(id);
    }

    /**
     * Creates a new Object ID
     * @param [fromDate] Use a specified date for the ID
     */
    static makeId(fromDate?: Date): string {
        if (fromDate) {
            const s = Math.floor(fromDate.getTime() / 1000);
            return new Types.ObjectId(s).toHexString();
        }

        return new Types.ObjectId().toHexString();
    }

    /**
     * Creates a new Object ID
     * @param [fromDate] Use a specified date for the ID
     */
    makeId(fromDate?: Date): string {
        return DocDBService.makeId(fromDate);
    }

    /**
     * Extract the date from an Object ID
     */
    static getDate(objectId: string): Date {
        return new Types.ObjectId(objectId).getTimestamp();
    }

    /**
     * Extract the date from an Object ID
     */
    getDate(objectId: string): Date {
        return DocDBService.getDate(objectId);
    }

    /**
     * Closes the DB connection
     * @param [forced=false] Whether to forcefully close connection
     */
    async stop(forced: boolean = false): Promise<void> {
        await this.db.close(forced);
        console.info(`[OK] Doc DB stopped`);
    }

    /**
     * Register a database schema by name
     * @param name What you want to name the model in the model container
     * @param schema The schema for this model
     */
    registerModel<ModelInterface>(name: string, schema: DocSchema<ModelInterface>): Model<ModelInterface> {
        return this.db.model<ModelInterface>(name, schema);
    }

    /**
     * Creates a new MongoDB Session and returns it.
     * This session can then be passed into DB operations to perform transactions.
     * https://mongoosejs.com/docs/transactions.html
     * @example
     * // Setup transaction
     * const session = await DocDB.createSession();
     * session.startTransaction();
     *
     * try {
     *  // Make updates using the session - Do not use `Promise.X`: https://mongoosejs.com/docs/transactions.html#note-about-parallelism-in-transactions
     *  await users.updateOne({ id: "111" }, {$set: {name: "John"}}, { session });
     *  await users.updateOne({ id: "222" }, {$set: {name: "Max"}}, { session });
     *
     *  // Commit changes
     *  await session.commitTransaction();
     * } catch(e) {
     *     console.error(e);
     *     // Abort changes
     *     await session.abortTransaction();
     * }
     *
     * // Conclude & cleanup
     * await session.endSession();
     */
    createSession(): Promise<ClientSession> {
        return this.db.startSession();
    }
}