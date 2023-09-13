const Whiteboard = require("./Whiteboard");

class ServerSocketIO {
  constructor(server, supabase) {
    //Stores active whiteboard in a Map
    this.whiteboards = new Map();

    this.supabase = supabase;

    this.io = require("socket.io")(server, {
      cors: {
        origin: "*",
      },
    });

    this.activeSockets = new Map();

    //Register socket io event handlers

    this.io.on("connection", (socket) => {
      this.handleConnection(socket);

      //Register client specific handlers

      socket.on("join-board", async (boardToken) => { //callback
        await this.handleJoinBoard(socket, boardToken);
        //callback("Joined the board successfully");
      });

      socket.on("disconnect", () => {
        this.handleDisconnect(socket);
      });

      socket.on(
        "createShape",
        async ({ boardToken, shape }) =>
          await this.handleCreateShape(socket, boardToken, shape)
      );

      socket.on(
        "deleteShape",
        async ({ boardToken, shapeKey }) =>
          await this.handleDeleteShape(boardToken, shapeKey)
      );

      socket.on(
        "changeShape",
        async ({ boardToken, changedShape }) =>
          await this.handleChangeShape(socket, boardToken, changedShape)
      );
    });
  }

  async handleChangeShape(socket, boardToken, changedShape) {
    console.log("handleChangeShape");
    const targetBoard = this.whiteboards.get(boardToken);
    if (!targetBoard) return;

    if (targetBoard.updateShape(changedShape)) {
      //Persist current shapes data in db
      await this.supabase.insertShapes(boardToken, targetBoard.shapes);

      //this.io.to(boardToken).emit("changeShape", changedShape);
      socket.broadcast.emit("changeShape", changedShape);
    }
  }

  async handleDeleteShape(boardToken, shapeKey) {
    const targetBoard = this.whiteboards.get(boardToken);
    if (!targetBoard) return;

    if (targetBoard.deleteShape(shapeKey)) {
      //Persist current shapes data in db
      await this.supabase.insertShapes(boardToken, targetBoard.shapes);

      this.io.to(boardToken).emit("deleteShape", shapeKey);
    }
  }

  async handleCreateShape(socket, boardToken, shape) {
    console.log("handleCreateShape");
    console.log(shape);
    console.log(boardToken);
    //Create shape in server's witeboard
    const targetBoard = this.whiteboards.get(boardToken);
    if (!targetBoard) return;

    // Add the shape to the target board
    const createdShape = targetBoard.createShape(shape);

    //Persist shapes in db
    await this.supabase.insertShapes(boardToken, targetBoard.shapes);

    // Broadcast createShape event to all clients (including the trigger client, to signal success)
    this.io.to(boardToken).emit("createShape", createdShape);
  }

  handleConnection(socket) {
    console.log("New socket connection:", socket.id);
  }

  //Create board
  async handleAddWhiteboard(boardToken) {
    //Retrive board data from db
    const boardData = await this.supabase.lookupBoardByToken(boardToken);
    if (!boardData) return;

    //Create whiteboard in map with persistated data (shapes and lines)
    this.whiteboards.set(
      boardToken,
      new Whiteboard(boardData.shapes, boardData.lines)
    );
  }

  async handleJoinBoard(socket, boardToken) {
    console.log(`${socket.id} is joining board ${boardToken}`);

    //Check if board already exits in our map datastructure
    if (!this.whiteboards.get(boardToken)) {
      await this.handleAddWhiteboard(boardToken);
    }

    const currBoard = this.whiteboards.get(boardToken);

    //Add socket to the corresponding board's group
    socket.join(boardToken);

    //Transfer current whiteboard data to new joined client
    socket.emit("boardData", {
      shapes: currBoard.shapes,
      lines: currBoard.lines,
    });

    //Add socket to our map with the board's token as key
    this.activeSockets.set(socket.id, boardToken);
  }

  handleDisconnect(socket) {
    console.log("Socket disconnected: ", socket.id);

    //Remove board from map if last client disconnected from it

    //Remove socket from map
    this.activeSockets.delete(socket.id);
  }

  //...
}

module.exports = ServerSocketIO;