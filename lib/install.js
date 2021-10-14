'use strict';
const path = require('path');
const binBuild = require('bin-build');
const bin = require('.');

bin.run(['--verbose']).then(() => {
	console.log('guetzli pre-build test passed successfully');
}).catch(async error => {
	console.warn(error.message);
	console.warn('guetzli pre-build test failed');
	console.info('compiling from source');

	try {
		binBuild.file(path.resolve(__dirname, '../vendor/source/guetzli-1.0.1.tar.gz'), [
			`mkdir -p ${bin.dest()}`,
			`make && mv bin/Release/${bin.use()} ${bin.path()}`
		]);

		console.log('guetzli built successfully');
	} catch (error) {
		console.error(error.stack);
	}
});
