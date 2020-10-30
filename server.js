const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const welcomeMessage = {
	id: 0,
	from: "Bart",
	text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
let messages = [welcomeMessage];

app.get("/", function (request, response) {
	response.sendFile(__dirname + "/index.html");
});

// read all the messages
app.get("/messages", function (request, response) {
	response.json(messages);
});
app.get("/messages/latest", function (request, response) {
	if (messages.length < 10) {
		response.json(messages);
	} else {
		const lastTenMessages = messages.slice(
			messages.length - 10,
			messages.length
		);
		response.json(lastTenMessages);
	}
});

app.get("/messages/search", function (req, res) {
	let searchedWord = req.query;

	let searchedText = req.query.text;

	const searchResults = messages.filter((m) => {
		return m.text.toLowerCase().includes(searchedText.toLowerCase());
	});
	if (searchResults.length > 0) {
		res.json(searchResults);
	} else {
		res.json(`search was not found!`);
	}
});

//add a message
app.post("/messages", function (request, response) {
	let newMessage = request.body;
	console.log(newMessage);
	if (
		typeof newMessage.text == "string" &&
		newMessage.text.length > 0 &&
		typeof newMessage.from == "string" &&
		newMessage.from.length > 0
	) {
		newMessage.id = messages.length;
		messages.push(newMessage);
		response.json("message added");
	} else {
		response.status(400).send("The request had bad syntax ! ");
	}
});

//read a message by Id
app.get("/messages/:id", function (request, response) {
	let messageId = request.params.id;
	let foundMessage = messages.find((message) => message.id == messageId);
	response.json(foundMessage);
});

app.delete("/messages/deleteMessage/:id", function (request, response) {
	let messageId = request.params.id;

	messages = messages.filter((m) => m.id != messageId);
	response.json("message deleted");
});

app.listen(3030, () => {
	console.log(`Server is listening on port 3030. Ready to accept requests!`);
});
//process.env.PORT
/*const listener = app.listen(process.env.PORT, () => {
	console.log("Your app is listening on port " + listener.address().port);
});*/
