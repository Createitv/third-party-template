import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import serve from 'rollup-plugin-serve'

export default {
  input: './src/main',
  output: [
    {
      file: './dist/bundle.common.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      dir: 'dist/bundle.esm.js',
      format: 'esm',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
    terser(),
    livereload(), // 热更新
    serve({
      open: true,
      contentBase: 'dist',
    }),
  ],
  external: ['lodash'],
}
