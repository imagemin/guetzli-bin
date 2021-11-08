import {fileURLToPath} from 'node:url';
import {promises as fs} from 'node:fs';
import binBuild from 'bin-build';
import bin from './index.js';

const src = fileURLToPath(new URL('../test/fixtures/test.jpg', import.meta.url));
const dest = fileURLToPath(new URL('../test/fixtures/dest.jpg', import.meta.url));

// This should not be checked this way, but the `--verbose` flag ends with 1
bin.run([src, dest]).then(() => {
	console.log('guetzli pre-build test passed successfully');
}).catch(async error => {
	console.warn(error.message);
	console.warn('guetzli pre-build test failed');
	console.info('compiling from source');

	await fs.mkdir(bin.dest(), {recursive: true});

	try {
		const source = fileURLToPath(new URL('../vendor/source/guetzli-1.0.1.tar.gz', import.meta.url));
		binBuild.file(source, [
			`make && mv bin/Release/${bin.use()} ${bin.path()}`,
		]);

		console.log('guetzli built successfully');
	} catch (error) {
		console.error(error.stack);
	}
});
