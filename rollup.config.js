import ts from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import istanbul from 'rollup-plugin-istanbul';

export default [
	{
		plugins: [
			nodeResolve(),
			json(),
			ts({
				tsconfig: 'tsconfig.modern.json'
			}),
			terser({
				output: {
					comments: false
				}
			})
		],
		input: 'src/kiosk-mode.ts',
		output: {
			file: 'dist/kiosk-mode-modern.js',
			format: 'iife'
		}
	},
	{
		plugins: [
			nodeResolve(),
			json(),
			ts({
				tsconfig: 'tsconfig.json'
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
				tsconfig: 'tsconfig.json',
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