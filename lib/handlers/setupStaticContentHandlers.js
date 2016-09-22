'use strict';

const express = require('express');
const path = require('path');

module.exports = function setupStaticContentHandlers(expressApp) {
	expressApp.use(express.static(path.normalize(__dirname + '/../../public')));
};
