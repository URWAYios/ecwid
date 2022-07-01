import fetch from 'node-fetch';

const makeRequest = async (url, type, body) => {
	try {
		let res = await fetch(url, {
			method: type,
			headers: {
				'Content-type': 'application/json; charset UTF=8;',
			},
			body: JSON.stringify(body),
		});
		console.log(res);
		if (type != 'GET') {
			let result = res.JSON();
			return result;
		}
	} catch (err) {
		console.log(err);
		return Error(err);
	}
};

export { makeRequest };
