const router = require("express").Router();
const Message = require("../models/message");

// Create a new message document
router.post("/", function (req, res) {
	Message.create(req.body)
		.then(function (message) {
			res.status(200).send({ "result": "success" });
		})
		.catch(function (err) {
			if (err.code == 11000) {
				res.status(400).send({ "result": "fail" });
			}
			else {
				res.status(500).send(err);
			}
		});
});

// Find one by messageId
router.get("/", function (req, res) {
	Message.findOneByMessageId(req.query.messageId)
		.then((message) => {
			if (!message) return res.status(400).send({ "result": "fail" });
			res.status(200).send({
				result: "success",
				message: message.message
			});
			console.log(message);
		})
		.catch((err) => res.status(500).send(err));
});

// update message
router.put("/", function (req, res) {
	Message.updateOneByMessageId(req.body.messageId, req.body.message)
		.then(function (message) {
			res.status(200).send({ "result": "success" });
		})
		.catch(function (err) {
			if (err.code == 11000) {
				res.status(400).send({ "result": "fail" });
			}
			else {
				res.status(500).send(err);
			}
		});
});

module.exports = router;
