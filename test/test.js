'use strict';
const fs = require('fs');
const path = require('path');
const test = require('ava');
const execa = require('execa');
const tempy = require('tempy');
const binCheck = require('bin-check');
const BinBuild = require('bin-build');
const compareSize = require('compare-size');
const guetzli = require('..');

test.cb('rebuild the guetzli binaries', t => {
	const tmp = tempy.directory();

	new BinBuild()
		.src('https://github.com/google/guetzli/archive/v1.0.1.tar.gz')
		.cmd(`mkdir -p ${tmp}`)
		.cmd(`make && mv guetzli ${tmp}`)
		.run(err => {
			t.ifError(err);
			t.true(fs.existsSync(path.join(tmp, 'guetzli')));
			t.end();
		});
});

test.cb('return path to binary and verify that it is working', t => {
	binCheck(guetzli, ['--version']).then(result => {
		t.true(result);
	});
	t.end();
});

test('minify a JPG', async t => {
	const tmp = tempy.directory();
	const src = path.join(__dirname, 'fixtures/test.jpg');
	const dest = path.join(tmp, 'test.jpg');
	const args = [
		src,
		dest
	];

	await execa(guetzli, args);
	const res = await compareSize(src, dest);

	t.true(res[dest] < res[src]);
});
