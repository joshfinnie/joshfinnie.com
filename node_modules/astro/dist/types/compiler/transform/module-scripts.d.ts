import type { Transformer } from '../../@types/transformer';
import type { CompileOptions } from '../../@types/compiler';
/** Transform <script type="module"> */
export default function ({ compileOptions, filename }: {
    compileOptions: CompileOptions;
    filename: string;
    fileID: string;
}): Transformer;
