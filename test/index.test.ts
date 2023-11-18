import { cloneError } from '../src';

test('Creates a new Error object that contains equivalent information', () => {
    const original = new Error('Hello world');

    const clone = cloneError(original);

    // Different reference
    expect(clone).not.toBe(original);

    // Same data
    expect(clone).toEqual(original);
});

describe('cause', () => {
    test('Clones the original cause', () => {
        const cause = new Error('BANG!');
        const original = new Error('Hello world', { cause });

        const clone = cloneError(original);

        // Different reference
        expect(clone).not.toBe(original);
        expect(clone.cause).not.toBe(cause);

        // Same data in the clone
        expect(clone).not.toBe(original);
        expect(clone.cause).toEqual(original.cause);
    });

    test('Clones the entire cause chain', () => {
        const a = new Error('BANG!');
        const b = new Error('CRASH!', { cause: a });
        const c = new Error('WALLOP!', { cause: b });

        const original = new Error('Hello world', { cause: c });

        const clone = cloneError(original);

        // Different reference
        expect(clone).not.toBe(original);
        expect(clone.cause).not.toBe(original.cause);

        // @ts-expect-error We know what we're doing
        expect(clone.cause.cause).not.toBe(original.cause.cause);
        // @ts-expect-error We know what we're doing
        expect(clone.cause.cause).toEqual(original.cause.cause);

        // @ts-expect-error We know what we're doing
        expect(clone.cause.cause.cause).not.toBe(original.cause.cause.cause);
        // @ts-expect-error We know what we're doing
        expect(clone.cause.cause.cause).toEqual(original.cause.cause.cause);
    });

    test('allows a new cause to be added', () => {
        const cause = new Error('BANG!');
        const original = new Error('Hello world', { cause });

        const additionalCause = new Error('HACK THE PLANET!');
        const clone = cloneError(original, { cause: additionalCause });

        expect(clone.cause).toEqual(cause);

        // @ts-expect-error We know what we're doing
        expect(clone.cause.cause).toEqual(additionalCause);
    });
});
