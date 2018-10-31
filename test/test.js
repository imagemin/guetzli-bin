'use strict';
const path = require('path');
const test = require('ava');
const execa = require('execa');
const tempy = require('tempy');
const binCheck = require('bin-check');
const binBuild = require('bin-build');
const compareSize = require('compare-size');
const executable = require('executable');
const guetzli = require('..');

test('rebuild the guetzli binaries', async t => {
	const tmp = tempy.directory();

	await binBuild.url('https://github.com/google/guetzli/archive/v1.0.1.tar.gz', [
		`mkdir -p ${tmp}`,
		`make && mv bin/Release/guetzli ${tmp}`
	]);

	t.true(executable.sync(path.join(tmp, 'guetzli')));
});

test('return path to binary and verify that it is working', async t => {
	const src = path.join(__dirname, 'fixtures/test.jpg');
	t.true(await binCheck(guetzli, [src, '/dev/null']));
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
