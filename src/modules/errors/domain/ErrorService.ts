import type { AnyOriginalError } from "../../../types.js";

/**
 * A placeholder logger and error capture.
 */
export default class ErrorService {
    /**
     * Capture an exception
     */
    captureException(error: AnyOriginalError): void {
        console.error(error);
    }
}