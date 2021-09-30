/// <reference types="node" />
import http from 'http';
import type { AstroConfig } from './@types/astro';
/** The primary dev action */
export declare function preview(astroConfig: AstroConfig): Promise<http.Server>;
