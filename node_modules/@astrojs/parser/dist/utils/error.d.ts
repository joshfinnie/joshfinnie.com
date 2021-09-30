export declare class CompileError extends Error {
    code: string;
    end: {
        line: number;
        column: number;
    };
    filename: string;
    frame: string;
    start: {
        line: number;
        column: number;
    };
    constructor({ code, filename, start, end, message }: {
        code: string;
        filename: string;
        start: number;
        message: string;
        end?: number;
    });
    toString(): string;
}
/** Throw CompileError */
export default function error(code: string, message: string, props: {
    name: string;
    source: string;
    filename: string;
    start: number;
    end?: number;
}): never;
