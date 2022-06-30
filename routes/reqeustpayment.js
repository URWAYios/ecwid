import express from 'express';
import { EncryptionHelper, decryptData } from '../controller/decode.js';

const router = express.Router();

router.post('/', (req, res) => {
	if (req.body) {
		let data = decryptData(process.env.CLIENT_SECRET, req.body.data);
		console.log(data);
		res.send(data).status(200);
	}
});
router.post('/print', (req, res) => {
	console.log(req.body);
	res.status(200);
});

export default router;
