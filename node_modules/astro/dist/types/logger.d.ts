/// <reference types="node" />
import type { CompileError } from '@astrojs/parser';
import { Writable } from 'stream';
export declare const defaultLogDestination: Writable;
interface LogWritable<T> extends Writable {
    write: (chunk: T) => boolean;
}
export declare type LoggerLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';
export declare type LoggerEvent = 'debug' | 'info' | 'warn' | 'error';
export interface LogOptions {
    dest?: LogWritable<LogMessage>;
    level?: LoggerLevel;
}
export declare const defaultLogOptions: Required<LogOptions>;
export interface LogMessage {
    type: string | null;
    level: LoggerLevel;
    message: string;
    args: Array<any>;
}
/** Full logging API */
export declare function log(opts: LogOptions | undefined, level: LoggerLevel, type: string | null, ...args: Array<any>): void;
/** Emit a message only shown in debug mode */
export declare function debug(opts: LogOptions, type: string | null, ...messages: Array<any>): void;
/** Emit a general info message (be careful using this too much!) */
export declare function info(opts: LogOptions, type: string | null, ...messages: Array<any>): void;
/** Emit a warning a user should be aware of */
export declare function warn(opts: LogOptions, type: string | null, ...messages: Array<any>): void;
/** Emit a fatal error message the user should address. */
export declare function error(opts: LogOptions, type: string | null, ...messages: Array<any>): void;
declare type LogFn = typeof debug | typeof info | typeof warn | typeof error;
export declare function table(opts: LogOptions, columns: number[]): (logFn: LogFn, ...input: Array<any>) => void;
/** Pretty format error for display */
export declare function parseError(opts: LogOptions, err: CompileError): void;
export declare const logger: {
    debug: (type: string | null, ...messages: any[]) => void;
    info: (type: string | null, ...messages: any[]) => void;
    warn: (type: string | null, ...messages: any[]) => void;
    error: (type: string | null, ...messages: any[]) => void;
};
export declare let defaultLogLevel: LoggerLevel;
export {};
