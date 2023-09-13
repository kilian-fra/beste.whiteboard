import React, { useState } from "react";
import { WhiteboardShapeContainer } from "./WhiteboardShapeContainer";
import { MainPage } from "./pages/MainPage"

function App() {
  const [showWhiteboard, setShowWhiteboard] = useState(false);  // The state variable showWhiteboard is created with the set setWhiteboard and false as
  const [boardToken, setBoardToken] = useState(null);

  const handleCreateOrJoinWhiteboard = async (e) => {
    e.preventDefault();

    // Extract form data from event object
    const { token, name, pin } = e.target.elements;

    // Create form data payload
    const formData = {
      token: token.value,
      name: name.value,
      pin: pin.value,
    };

    try {
      //Send the form data to the backend
      const response = await fetch("http:/localhost:1337/api/whiteboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 200) {
        data.action === "create"
          ? alert(`Whiteboard successfully created with token ${data.token}`)
          : alert(`Whiteboard successfully joined with token ${data.token}`);

        setBoardToken(data.token);
        setShowWhiteboard(true); //Redirect to whiteboard
      } else if (response.status === 400) {
        //Client error
        alert(data.message);
      } else {
        //500 (server error)
        alert(data.error);
      }
    } catch (ex) {
      console.log("exception");
    }
  };

  return (
    <div className="App">
      {showWhiteboard && boardToken ? ( // is showWhiteboard true ?
        <WhiteboardShapeContainer boardToken={boardToken}/> // if it is true, the WhiteboardShapeContainer.js gets rendered
      ) : (
        // if showWhiteboard is false then the following is shown
        <MainPage handleSumbit={handleCreateOrJoinWhiteboard} />
      )}
    </div>
  );
}

/*
import React, { useState } from 'react';
import './App.css';
import { MainPage } from "./pages/MainPage"
import { WhiteboardPage } from './pages/WhiteboardPage';
*/

/*
Description:
- This is the entry point of our application.
*/

/*
function App() {

  const [currentPage, setCurrentPage] = useState('main'); //State for handeling the redirection to the WhiteboardPage

  const handleRedirectToWhiteboard = () => {
    setCurrentPage('whiteboard'); //Redirect to the WhiteboardPage
  };

  return (
    <>
      {currentPage === 'main' ? (
        <MainPage redirectToWhiteboard={handleRedirectToWhiteboard} />
      ) : (
        <WhiteboardPage />
      )}
    </>
*/

export default App;