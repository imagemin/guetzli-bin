'use strict';
var path = require('path');
var BinWrapper = require('bin-wrapper');
var pkg = require('../package.json');

var url = 'https://raw.githubusercontent.com/imagemin/guetzli-bin/v' + pkg.version + '/vendor/';

module.exports = new BinWrapper()
	.src(url + 'macos/guetzli', 'darwin')
	.src(url + 'linux/guetzli', 'linux')
	.src(url + 'win/guetzli.exe', 'win32')
	.dest(path.join(__dirname, '../vendor'))
	.use(process.platform === 'win32' ? 'guetzli.exe' : 'guetzli');
