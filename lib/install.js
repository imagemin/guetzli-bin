import {fileURLToPath} from 'node:url';
import binBuild from 'bin-build';
import bin from './index.js';

bin.run(['--verbose']).then(() => {
	console.log('guetzli pre-build test passed successfully');
}).catch(async error => {
	console.warn(error.message);
	console.warn('guetzli pre-build test failed');
	console.info('compiling from source');

	try {
		const source = fileURLToPath(new URL('../vendor/source/guetzli-1.0.1.tar.gz', import.meta.url));
		binBuild.file(source, [
			`mkdir -p ${bin.dest()}`,
			`make && mv bin/Release/${bin.use()} ${bin.path()}`,
		]);

		console.log('guetzli built successfully');
	} catch (error) {
		console.error(error.stack);
	}
});
