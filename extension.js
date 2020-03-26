'use strict';
const {OBSUtility} = require('nodecg-utility-obs');
module.exports = function (nodecg) {
	const obs = new OBSUtility(nodecg);
	nodecg.log.info('Connected.');
};
