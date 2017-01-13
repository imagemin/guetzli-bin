#!/usr/bin/env node
'use strict';
var spawn = require('child_process').spawn;
var guetzli = require('./');

var input = process.argv.slice(2);

spawn(guetzli, input, {stdio: 'inherit'})
	.on('exit', process.exit);
