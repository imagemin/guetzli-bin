'use strict';
const binBuild = require('bin-build');
const log = require('logalot');
const bin = require('.');

bin.run(['--verbose']).then(() => {
	log.success('guetzli pre-build test passed successfully');
}).catch(error => {
	log.warn(error.message);
	log.warn('guetzli pre-build test failed');
	log.info('compiling from source');

	binBuild.url('https://github.com/google/guetzli/archive/v1.0.1.tar.gz', [
		`mkdir -p ${bin.dest()}`,
		`make && mv bin/Release/${bin.use()} ${bin.path()}`
	]).then(() => {
		log.success('guetzli built successfully');
	}).catch(error => {
		log.error(error.stack);
	});
});
