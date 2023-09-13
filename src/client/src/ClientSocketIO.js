import { useEffect, useState } from "react";
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = "http://localhost:1337";

export const ClientSocketIO = ({
  boardToken,
  handleAddShape,
  handleChangeShape,
  deleteShape,
  setShapes,
  setLines
}) => {
  const [socket, setSocket] = useState(null); //React state, that stores the socket

  //Routine that establishes the Socket.IO connnection with the remote server
  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    //Cleanup routine
    return () => {
      newSocket.disconnect();
    };
  }, []);

  //Routine that initializes the event handlers (after the socket initialized by the first effect hook)
  useEffect(() => {
    if (socket) {
      //Handle onConnect event
      socket.on("connect", () => {
        //Request join board event
        socket.emit("join-board", boardToken);
      });

      //Handle createShape event
      socket.on("createShape", (shape) => handleShapeCreateServer(shape));

      //Handle deleteShape event
      socket.on("deleteShape", (shapeKey) => handleShapeDeleteServer(shapeKey));

      //Handle boardData event
      socket.on("boardData", ({ shapes, lines }) =>
        handleSetBoardData(shapes, lines)
      );

      //Handle changeShape event
      socket.on("changeShape", (changedShape) =>
        handleShapeChangeServer(changedShape)
      );

      //Handle deleteShape event

      socket.on("disconnect", () => {
        //...
      });
    }
  }, [socket]);

  const handleSetBoardData = (shapesArray, linesArray) => {
    setShapes(shapesArray);
    setLines(linesArray);
  };

  const handleShapeDeleteServer = (shapeKey) => {
    deleteShape(shapeKey);
  };

  //Handles the shape creation from server side
  const handleShapeCreateServer = (shape) => {
    console.log("handleShapeCreateServer");
    handleAddShape(shape);
  };

  //Handles the shape creation from client side (called from WhiteboardShapeContainer)
  const handleShapeCreateClient = (shape) => {
    socket.emit("createShape", { boardToken, shape }); //Trigger createShape event with shape on the server-side
  };

  const handleShapeChangeServer = (changedShape) => {
    handleChangeShape(changedShape);
  };

  const handleShapeChangeClient = (changedShape) => {
    socket.emit("changeShape", { boardToken, changedShape });
  };

  const handleShapeDeleteClient = (shapeKey) => {
    socket.emit("deleteShape", { boardToken, shapeKey });
  };

  //Return functionality, so that events can be triggered from outside
  return {
    handleShapeCreateClient,
    handleShapeChangeClient,
    handleShapeDeleteClient,
  };
};