import crypto from 'crypto';
const EncryptionHelper = (function () {
	function decryptText(cipher_alg, key, text, encoding) {
		var bText = Buffer.from(text, encoding);
		var iv = bText.slice(0, 16);
		var payload = bText.slice(16);
		var decipher = crypto.createDecipheriv(cipher_alg, key, iv);
		return Buffer.concat([decipher.update(payload, encoding), decipher.final()]);
	}
	return {
		CIPHERS: {
			AES_128: 'aes128', //requires 16 byte key
			AES_128_CBC: 'aes-128-cbc', //requires 16 byte key
			AES_192: 'aes192', //requires 24 byte key
			AES_256: 'aes256', //requires 32 byte key
		},
		decryptText: decryptText,
	};
})();

const decryptData = (client_sec, payload) => {
	let encryption_key = client_sec.slice(0, 16);
	let originalBase64 = payload.replace(/-/g, '+').replace(/_/g, '/');
	let algorithm = EncryptionHelper.CIPHERS.AES_128_CBC;
	let decrypted = EncryptionHelper.decryptText(algorithm, encryption_key, originalBase64, 'base64');
	if (typeof payload == 'object') {
		let payloadObject = JSON.parse(decrypted);
		return payloadObject;
	} else {
		return decrypted;
	}
};

export { EncryptionHelper, decryptData };
