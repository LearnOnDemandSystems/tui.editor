import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import path from 'path';
import { fileURLToPath } from 'url';
import postcss from 'rollup-plugin-postcss';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    entryFileNames: 'esm/[name].js',
    format: 'es',
    sourcemap: false,
  },
  external: ['@toast-ui/editor', 'prismjs'],
  plugins: [
    alias({
      entries: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        { find: '@t', replacement: path.resolve(__dirname, 'types') },
      ],
    }),
    typescript({ tsconfig: './tsconfig.json' }),
    commonjs(),
    nodeResolve(),
    postcss({
      extract: path.resolve(__dirname, 'dist/toastui-editor-plugin-code-syntax-highlight.css'),
      minimize: false,
    }),
  ],
};
