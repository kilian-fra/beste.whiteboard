import React from 'react';
import { Html } from "react-konva-utils";

/*
EditableFigure take in the position (x, y) and the relevant functions 
(setEditing for updating the editing state and onChange to update text) of the editable figure.
*/

//Key defs
const RETURN_KEY = 13;
const ESCAPE_KEY = 27;

export const EditableFigure = ({ onChange, setEditing, shapeProps }) => {

    const handleEscapeKeys = (e) => {
        //Abort editing mode (if enter without shift or escape pressed)
        if ((e.keyCode === RETURN_KEY && !e.shiftKey) || e.keyCode === ESCAPE_KEY) {
            setEditing(false);
        }
    };

    //Update text (if needed)
      const handleTextChange = (e) => {
        onChange({...shapeProps, text: e.currentTarget.value});
    };

    return (
      <Html
        groupProps={{ x: shapeProps.x, y: shapeProps.y }}
        divProps={{ style: { opacity: 1 } }}
      >
        <textarea
          data-testid="editableText"
          value={shapeProps.text}
          onChange={handleTextChange}
          onKeyDown={handleEscapeKeys} //Assign to handleEscapeKeys, so that the editing-mode can be exited
        />
      </Html>
    );
}