const { createHash } = await import('node:crypto');

export default function createRequestHash(data) {
	const hash = createHash('sha256');
	hash.update(data);
	let finalHash = hash.digest('hex');
	return new Promise((res) => {
		res(finalHash);
	});
}
