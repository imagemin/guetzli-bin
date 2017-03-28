'use strict';
var BinBuild = require('bin-build');
var log = require('logalot');
const pkg = require('../package.json');
var bin = require('./');

bin.run(['-version'], function (err) {
	if (err) {
		log.warn(err.message);
		log.warn('guetzli pre-build test failed');
		log.info('compiling from source');

		var builder = new BinBuild()
			.src(`https://github.com/google/guetzli/archive/v${pkg.version}.tar.gz`)
			.cmd('make');

		return builder.run(function (err) {
			if (err) {
				log.error(err.stack);
				return;
			}

			log.success('guetzli built successfully');
		});
	}

	log.success('guetzli pre-build test passed successfully');
});
