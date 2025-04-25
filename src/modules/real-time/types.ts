import type { DefaultEventsMap, Socket } from "socket.io";
import type { IUserData } from "../../types.js";

export type IOSocket = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

declare module "socket.io" {
    export interface Socket {
        /**
         * The Discord user that is connected to this socket.
         */
        user: IUserData;
    }
}