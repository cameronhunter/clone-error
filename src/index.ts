export function cloneError(err: unknown, overrides?: { cause?: unknown }): Error {
    if (!(err instanceof Error)) {
        return err as any as Error;
    }

    const clone = new Error(err.message);

    // @ts-expect-error Ensure that the clone has the same instance type.
    clone.__proto__ = err.__proto__;

    clone.stack = err.stack;

    if (err.cause) {
        if (overrides?.cause) {
            const newCause = cloneError(err.cause);
            const lastCause = findLastCause(newCause);
            // @ts-expect-error I'm unsure how to handle causes that aren't errors
            lastCause.cause = cloneError(overrides.cause);
            clone.cause = newCause;
        } else {
            clone.cause = cloneError(err.cause);
        }
    } else {
        clone.cause = cloneError(overrides?.cause);
    }

    return clone;
}

function findLastCause(error: unknown): unknown {
    return error instanceof Error && error.cause !== undefined ? findLastCause(error.cause) : error;
}
