import ts from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import istanbul from 'rollup-plugin-istanbul';

export default [
	{
		plugins: [
			nodeResolve(),
			json(),
			ts(),
			terser({
				output: {
					comments: false
				}
			})
		],
		input: 'src/kiosk-mode.ts',
		output: {
			file: 'dist/kiosk-mode.js',
			format: 'iife'
		}
	},
	{
		plugins: [
			nodeResolve(),
			json(),
			ts(),
			babel({
				babelHelpers: 'bundled',
				extensions: ['.js', '.mjs', '.ts'],
				exclude: /core-js/,
				presets: [
					[
						'@babel/preset-env',
						{
							targets: {
								ie: '11'
							},
							modules: false,
							bugfixes: true
						}
					]
				]
			}),
			terser({
				output: {
					comments: false
				}
			})
		],
		input: 'src/kiosk-mode.ts',
		output: {
			file: 'dist/kiosk-mode-es5.js',
			format: 'iife'
		}
	},
	{
		plugins: [
			nodeResolve(),
			json(),
			ts({
				compilerOptions: {
                    outDir: undefined,
                    removeComments: false
                }
			}),
			istanbul({
				exclude: [
					'node_modules/**/*',
					'package.json'
				]
			})
		],
		input: 'src/kiosk-mode.ts',
		output: {
			file: '.hass/config/www/kiosk-mode.js',
			format: 'iife'
		}
	}
];