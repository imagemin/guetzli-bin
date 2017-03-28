'use strict';
const fs = require('fs');
const path = require('path');
const execFile = require('child_process').execFile;
const test = require('ava');
const binCheck = require('bin-check');
const BinBuild = require('bin-build');
const compareSize = require('compare-size');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const pkg = require('../package.json');

const tmp = path.join(__dirname, 'tmp');

test.cb.beforeEach(t => {
	mkdirp(tmp, t.end);
});

test.cb.afterEach(t => {
	rimraf(tmp, {disableGlob: true}, t.end);
});

test.cb('rebuild the guetzli binaries', t => {
	new BinBuild()
		.src(`https://github.com/google/guetzli/archive/v${pkg.version}.tar.gz`)
		.cmd('make')
		.run(err => {
			if (err) {
				t.fail(err);
			} else {
				t.pass();
			}
			t.end();
		});
});

test.cb('return path to binary and verify that it is working', t => {
	const args = [
		'-- quality 90',
		path.join(__dirname, 'fixtures/test.jpg'),
		path.join(tmp, 'test.jpg')
	];

	binCheck(require('../'), args, (err, works) => {
		if (err) {
			t.fail(err);
			t.end();
			return;
		}

		console.log('return path to binary and verify that it is working');
		t.pass(works);
		t.end();
	});
});

test.cb('minify a JPG', t => {
	const src = path.join(__dirname, 'fixtures/test.jpg');
	const dest = path.join(tmp, 'test.jpg');
	const args = [
		'--quality 90',
		src,
		dest
	];

	execFile(require('../'), args, err => {
		if (err) {
			t.fail(err);
			t.end();
			return;
		}

		compareSize(src, dest, (err, res) => {
			if (err) {
				t.fail(err);
				t.end();
				return;
			}

			console.log('minify a JPG');
			t.true(res[dest] < res[src]);
			t.end();
		});
	});
});
