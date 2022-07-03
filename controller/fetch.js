import fetch from 'node-fetch';

const makeRequest = async (url, type, body) => {
	let res = await fetch(url, {
		method: type,
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
		body: JSON.stringify(body),
	});
	if (res.status !== 200) {
		return {
			error: 'err',
			code: res.status,
		};
	} else {
		if (type != 'GET') {
			let result = await res.json();
			console.log(result);
			return result;
		} else {
			return 'sucess';
		}
	}
};

export { makeRequest };
