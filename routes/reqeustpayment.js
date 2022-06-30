import express, { application } from 'express';
import { EncryptionHelper, decryptData } from '../controller/decode.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
	if (req.body) {
		try {
			let data = await decryptData(process.env.CLIENT_SECRET, req.body.data);
			console.log(data);
			res.send(data).status(200);
		} catch (err) {
			console.log('from route', err);
			next(err);
		}
	}
});
router.post('/print', (req, res) => {
	console.log(req.body);
	res.status(200).send(req.body);
});

export default router;
