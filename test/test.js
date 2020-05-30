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
	const temporary = tempy.directory();

	await binBuild.file(path.resolve(__dirname, '../vendor/source/guetzli-1.0.1.tar.gz'), [
		`mkdir -p ${temporary}`,
		`make && mv bin/Release/guetzli ${temporary}`
	]);

	t.true(executable.sync(path.join(temporary, 'guetzli')));
});

test('return path to binary and verify that it is working', async t => {
	const src = path.join(__dirname, 'fixtures/test.jpg');
	t.true(await binCheck(guetzli, [src, '/dev/null']));
});

test('minify a JPG', async t => {
	const temporary = tempy.directory();
	const src = path.join(__dirname, 'fixtures/test.jpg');
	const dest = path.join(temporary, 'test.jpg');
	const args = [
		src,
		dest
	];

	await execa(guetzli, args);
	const result = await compareSize(src, dest);

	t.true(result[dest] < result[src]);
});
