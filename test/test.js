import path from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'ava';
import execa from 'execa';
import tempy from 'tempy';
import binCheck from 'bin-check';
import binBuild from 'bin-build';
import compareSize from 'compare-size';
import executable from 'executable';
import guetzli from '../index.js';

test('rebuild the guetzli binaries', async t => {
	const temporary = tempy.directory();

	const source = fileURLToPath(new URL('../vendor/source/guetzli-1.0.1.tar.gz', import.meta.url));
	await binBuild.file(source, [
		`mkdir -p ${temporary}`,
		`make && mv bin/Release/guetzli ${temporary}`,
	]);

	t.true(executable.sync(path.join(temporary, 'guetzli')));
});

test('return path to binary and verify that it is working', async t => {
	const src = fileURLToPath(new URL('fixtures/test.jpg', import.meta.url));
	t.true(await binCheck(guetzli, [src, '/dev/null']));
});

test('minify a JPG', async t => {
	const temporary = tempy.directory();
	const src = fileURLToPath(new URL('fixtures/test.jpg', import.meta.url));
	const dest = path.join(temporary, 'test.jpg');
	const args = [
		src,
		dest,
	];

	await execa(guetzli, args);
	const result = await compareSize(src, dest);

	t.true(result[dest] < result[src]);
});
