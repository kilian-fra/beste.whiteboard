const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const Supabase = require("./Supabase");
const ServerSocketIO = require("./ServerSocketIO");

const app = express();
const port = 1337;
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());

//Create an instance of Supabase
const supabase = new Supabase();

// Create an instance of ServerSocketIO and pass the server object
const serverSocketIO = new ServerSocketIO(server, supabase);

//Handle whiteboard join and create request
app.post("/api/whiteboard", async (req, res) => {

    //Extract form data from request body
    const { token, name, pin } = req.body;

    //Get requested whiteboard data (if exists)
    const board = await supabase.lookupBoardByToken(token)

    //Board exsist, so we return either ok (if the pin matches) or an error
    if (board) {
        parseInt(pin) === board.pin ? res.status(200).json({action: "join", token: board.token})
            : res.status(400).json({message: "PIN is invalid for the requested whiteboard"});
        return;
    }

    //Create board from user's data
    const createdBoard = await supabase.createBoard(pin);
    createdBoard ? res.status(200).json({action: "create", token: createdBoard.token})
        : res.status(500).json({error: "Failed to create whiteboard"});
});

//Start the server
server.listen(port, () => {
    console.log(`server is running on port ${port}`);
});