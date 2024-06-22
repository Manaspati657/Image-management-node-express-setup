const _ = require('lodash');

class RequestHandler {
	constructor() {
	}
	
	throwError(status, errorType, errorMessage) {
		return (e) => {
			if (!e) e = new Error(errorMessage || 'Default Error');
			e.status = status;
			e.errorType = errorType;
			throw e;
		};
	}
	sendSuccess(res, message, status) {
		return (data, globalData) => {
			if (_.isUndefined(status)) {
				status = 200;
			}
			res.status(status).json({
				status, type: 'success', message: message || 'Success result', data, ...globalData,
			});
		};
	}

	sendError(req, res, error) {
        return res.status(error.status || 500).json({
			type: 'error', message: error.message || error.message || 'Unhandled Error', error,
		});
	}
}
module.exports = RequestHandler;