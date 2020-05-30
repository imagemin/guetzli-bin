'use strict';
const path = require('path');
const binBuild = require('bin-build');
const log = require('logalot');
const bin = require('.');

bin.run(['--verbose']).then(() => {
	log.success('guetzli pre-build test passed successfully');
}).catch(async error => {
	log.warn(error.message);
	log.warn('guetzli pre-build test failed');
	log.info('compiling from source');

	try {
		binBuild.file(path.resolve(__dirname, '../vendor/source/guetzli-1.0.1.tar.gz'), [
			`mkdir -p ${bin.dest()}`,
			`make && mv bin/Release/${bin.use()} ${bin.path()}`
		]);

		log.success('guetzli built successfully');
	} catch (error) {
		log.error(error.stack);
	}
});
