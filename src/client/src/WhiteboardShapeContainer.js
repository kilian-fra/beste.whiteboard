import React, { forwardRef, useState, useRef, useImperativeHandle, useEffect } from 'react';
import "./styles/WhiteboardPage.css"
import { Stage, Layer, Line } from 'react-konva';
import ShapeSelector from './ShapeSelector';
import {DrawButton, SelectionButton, EraserButton, ShapeButton, DividingLine, ExportButton} from './icons.js';   //import for needed icons
import { GetShape } from './components/figures/ShapeCollector';
import { ShapeContextMenu } from './components/ShapeContextMenu';
import { ShapeColorPicker } from './components/ShapeColorPicker';
import {handleExportClick} from './Export';
import { ClientSocketIO } from "./ClientSocketIO";

export const WhiteboardShapeContainer = forwardRef(({boardToken}, ref) => {
  const [selectedShape, setSelectedShape] = useState(null); // The state varibale selectedShape is created, set to null per default and will contain the selceted shape
  const [shapes, setShapes] = useState([]); // The state variable shapes is per default an empty array and will contain the placed forms
  const [isDrawing, setIsDrawing] = useState(false); // The state varibale isDrawing is per default false and tells you if the left mouse is clicked
  const [tool, setTool] = useState("pen"); // The state varibale tool contains the information about the selected tool (pen and eraser)
  const [strokeWidth, setStrokeWidth] = useState(5); // The state varibale strokeWidth contains the information how pig the line of the pen is
  const [eraserWidth, setEraserWidth] = useState(5); // similar to strokewidth but for eraser
  const [lines, setLines] = useState([]); //Declares a state variable "lines" and the function "setLines" and is used to store a list of drawn lines.
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State of the shape menu
  const [selectedTargetKey, setSelectedTargetKey] = useState(null); //State for the currently selected shape (needed to apply transformations or open context menu)
  const [isDrawinEnabled, setDrawinEnabled] = useState(false);
  const [shapeContextMenu, setShapeContextMenu] = useState({
    x: 0,
    y: 0,
    isVisible: false,
    shapeKey: null,
  });
  const [colorPicker, setColorPicker] = useState({
    x: 0,
    y: 0,
    isVisible: false,
    shapeKey: null,
  });

  const handleAddShape = (newShape) => {
    setShapes((prevShapes) => [...prevShapes, newShape]);
  };

  //onChange triggered from server
  const handleChangeShape = (changedShape) => {
    setShapes((prevShapes) =>
      prevShapes.map((shape) => {
        return shape.key === changedShape.key ? changedShape : shape;
      })
    );
  };

  const deleteShape = (shapeKey) => {
    setShapes((prevShapes) =>
      prevShapes.filter((shape) => shape.key !== shapeKey)
    );
  };

  //Initialize ClientSocketIO, to enable multiple access on the whiteboard given by it's token
  const {
    handleShapeCreateClient,
    handleShapeChangeClient,
    handleShapeDeleteClient,
  } = ClientSocketIO({
    boardToken,
    handleAddShape,
    handleChangeShape,
    deleteShape,
    setShapes,
    setLines,
  });

  //Testing
  const stageRef = useRef(null); //Reference of the Konva-Stage (needed for testing purpose)

  // Expose stageRef.current as a ref to the parent component
  useImperativeHandle(ref, () => ({
    getStage: () => stageRef.current,
  }));

  //onChange triggered from client
  const handleOnChange = (changedShape) => {
    //Test
    handleChangeShape(changedShape); //Change directly on the client (faster)

    handleShapeChangeClient(changedShape);
  };

  const handleShapeSelect = (shapeType) => {
    if (shapeType !== selectedShape) {
      setSelectedShape(shapeType); // if the shapetype that is selected dosent fit the current shapetype in selcted shapeType, the selectedShape is set to shapeType
    } else {
      setSelectedShape(null); // otherweise it is set to null
    }
  };

  //This function handles the deselection of elements
  const handleDeselectTarget = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedTargetKey(null); //Set selectedId to null (no object is now selected)
      setShapeContextMenu({
        ...shapeContextMenu,
        isVisible: false,
        shapeKey: null,
      }); //Reset context menue
      setColorPicker({ ...colorPicker, isVisible: false, shapeKey: null }); //Reset color picker
    }
  };

  const handleContextMenu = (e) => {
    e.evt.preventDefault(); //Prevent the opening of the default context menu
    //If no shape is selected, the context menu should not be shown
    if (selectedTargetKey === null) return;

    const stage = e.target.getStage();
    const x = stage.getPointerPosition().x;
    const y = stage.getPointerPosition().y;

    //Set context menu data
    setShapeContextMenu({
      x: x,
      y: y,
      isVisible: true,
      shapeKey: selectedTargetKey,
    });
  };

  const handleShapeColorPicker = () => {
    setShapeContextMenu({ ...shapeContextMenu, isVisible: false }); //Hide context menu
    setColorPicker({
      x: shapeContextMenu.x + 50,
      y: shapeContextMenu.y,
      isVisible: true,
      shapeKey: shapeContextMenu.shapeKey,
    }); //Setup color picker
  };

  //Called from the color picker menu, to update the selected shapes color
  const handleShapeColorChange = (newColor) => {
    const targetShape = {...shapes.find(shape => shape.key === colorPicker.shapeKey)};
    targetShape.color = newColor;
    handleChangeShape(targetShape);
    handleShapeChangeClient(targetShape);
  };

  //handles the selection of shapes (for transformation)
  const handleShapeTargetSelection = (shapeKey) => {
    if (!isDrawing) {
      setSelectedTargetKey(shapeKey);
      //Reset context menue and color picker if another shape is selected
      setShapeContextMenu({
        ...shapeContextMenu,
        isVisible: false,
        shapeKey: null,
      });
      setColorPicker({ ...colorPicker, isVisible: false, shapeKey: null });
    }
  };

  const handleStageClick = (event) => {
    if (selectedShape) {
      // selectedShape != null ?
      const { offsetX, offsetY } = event.evt; // The coordinates of the click on the stage are extracted from the click event.
      // offsetX represents the horizontal offset and offsetY the vertical offset of the click

      const newShape = {
        key: 0,
        type: selectedShape,
        x: offsetX,
        y: offsetY,
        color: "black",
        width: 0,
        height: 0,
        rotation: 0,
        ...(selectedShape === "textfield" && {
          fontSize: 12,
          text: "Double click to edit text",
        }),
      }; // A new object newShape is created containing the selected shape type (selectedShape) and the coordinates (x and y) of the click on the stage.

      //handleAddShape(newShape); // a new shapes array is set with all old shapes and the new one
      handleShapeCreateClient(newShape); //Signal server, to create new shape
      setSelectedShape(null); // SelectedShape is set to null, to prevent from placing more then one shape with only one click on the selector button
    }

    if (!isDrawinEnabled) handleDeselectTarget(event);
  };

  //Called from ShapeContextMenu, to delete a shape
  const handleShapeDelete = () => {
    //Send delete request to server
    handleShapeDeleteClient(shapeContextMenu.shapeKey);

    //Shape is deleted, so it can't be seleteced anymore and the context menu wil be hidden
    setSelectedTargetKey(null);
    setShapeContextMenu({ x: 0, y: 0, isVisible: false, shapeKey: null });
  };

  const handleMouseClick = (event) => {
    if (isDrawinEnabled) {
      setIsDrawing(true); // if mouseDown is triggered isDrawing is set true
      const pos = event.target.getStage().getPointerPosition(); // the varibale pos safes the position of the mouse on the current stage
      const newWidth = tool === "eraser" ? eraserWidth : strokeWidth; // the varibale newWidth safes the currently selected tool
      setLines([
        ...lines,
        { points: [pos.x, pos.y], tool, strokeWidth: newWidth },
      ]);
    }
    /* A new array is created consisting of the existing lines plus a new object
      points": An array with the coordinates [x, y] of the current point of the drawn line.
      "tool": The current drawing tool type.
      "strokeWidth": The current stroke width of the drawn line (either eraserWidth or strokeWidth)
      The spread operator ...lines is used to insert all existing lines into the new array and retain them 
    */
  };

  const handleMouseMovement = (event) => {
    if (!isDrawing) {
      return; // if you are not currently drwaing you leave the function without something happening
    }
    const stage = event.target.getStage(); //event.target refers to the DOM element on which the event occurred and getStage() gets the actual konva stage that refers to the DOM element
    // and the value is assigned to the variable stage. This variable can then be used to access the stage and its methods
    const point = stage.getPointerPosition(); // getPointerPosition() gets the current mouse position on the current konva stage
    let lastLine = lines[lines.length - 1]; // in lastline the last line of drawn lines is assigned
    lastLine.points = lastLine.points.concat([point.x, point.y]); // the points in the lastLine are extended by the current mouse position
    setLines([...lines.slice(0, lines.length - 1), lastLine]); // A lines new array is created consisting of the existing lines, with the last one replaced by the updated version in lastLine
  };

  const handleMouseUnClick = () => {
    setIsDrawing(false); // if mouseUp is triggered isDrawing is set to false
  };

  const handleEraserClick = () => {
    setDrawinEnabled(true);
    setTool("eraser"); // if the Eraser btn is pressed the tool is changed to eraser
  };

  const handlePenClick = () => {
    setDrawinEnabled(true);
    setTool("pen"); // if the pen btn is pressed the tool is changed to eraser
  };

  //If selection button is clicked, drawing is disabled, so shapes can be selected and transformed
  const handleSelectionClick = () => {
    setIsDrawing(false);
    setDrawinEnabled(false);
  };

  const handleIcon3Click = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle den Wert von isMenuOpen
  };

  return (
    <div className="whiteboard-container">
      <h1 className="whiteboard-title">Whiteboard</h1>
      {/*floating-bar for tools that the user can use*/}
      <div className="floating-bar">
        {/*Draw button to select available shapes*/}
        <SelectionButton handleSelection={handleSelectionClick} />

        <DividingLine />

        {/*Draw Button and strokeWidth*/}
        <DrawButton handleDrawClick={handlePenClick} />
        <select //the select Element creates a drop down menu with the option values a the chooseble strokewidths
          value={strokeWidth} //value gets connected with storkewidth and is the current choosed value
          onChange={(e) => setStrokeWidth(e.target.value)}
          //if the value is changed an anonymous function is used that extracts the selected value (e.target.value)
          //and assigns it to the state variable strokeWidth via the setStrokeWidth function. This updates the state and saves the selected stroke width
        >
          <option value="1">1</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <DividingLine />
        {/*Icon 2 for later use*/}
        <EraserButton handleEraser={handleEraserClick} />
        <select
          value={eraserWidth}
          onChange={(e) => setEraserWidth(e.target.value)}
        >
          <option value="1">1</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <DividingLine />
        {/*Shape Button for chosing shape*/}
        <ShapeButton handleShape={handleIcon3Click} />
        {isMenuOpen && <ShapeSelector onSelect={handleShapeSelect} />}
        <DividingLine />
        <ExportButton
          onClick={() => handleExportClick(stageRef.current.getStage())}
        >
          {" "}
        </ExportButton>
      </div>
      {/*<div className="tools-container">*/}
      {/*  <div>*/}
      {/*    <button onClick={handlePenClick}>Pen</button>       /!*the button Pen is created and if the button is clicked the handlePenClick function is triggered*!/*/}
      {/*    <select                                              //the select Element creates a drop down menu with the option values a the chooseble strokewidths*/}
      {/*      value={strokeWidth}                                //value gets connected with storkewidth and is the current choosed value*/}
      {/*      onChange={(e) => setStrokeWidth(e.target.value)}   */}
      {/*      //if the value is changed an anonymous function is used that extracts the selected value (e.target.value) */}
      {/*      //and assigns it to the state variable strokeWidth via the setStrokeWidth function. This updates the state and saves the selected stroke width*/}
      {/*    >*/}
      {/*      <option value="1">1</option>*/}
      {/*      <option value="5">5</option>*/}
      {/*      <option value="10">10</option>*/}
      {/*      <option value="20">20</option>*/}
      {/*      <option value="50">50</option>*/}
      {/*      <option value="100">100</option>*/}
      {/*    </select>*/}
      {/*  </div>*/}
      {/*  <div>*/}
      {/*    <button onClick={handleEraserClick}>Eraser</button> /!* works similar to the previous pen button, but with eraser*!/*/}
      {/*    <select*/}
      {/*      value={eraserWidth}*/}
      {/*      onChange={(e) => setEraserWidth(e.target.value)}*/}
      {/*    >*/}
      {/*      <option value="1">1</option>*/}
      {/*      <option value="5">5</option>*/}
      {/*      <option value="10">10</option>*/}
      {/*      <option value="20">20</option>*/}
      {/*      <option value="50">50</option>*/}
      {/*      <option value="100">100</option>*/}
      {/*    </select>*/}
      {/*  </div>*/}
      {/*</div>*/}
      <div
        className="testID"
        data-testid="current-tool"
      >{`Current tool: ${tool}`}</div>
      {/* data-testid="current-tool attributes the <div> element with a custom attribute called "data-testid" and the value "current-tool". 
        The custom attributes are used to identify specific elements in the tests */}
      <br />
      {/*<ShapeSelector onSelect={handleShapeSelect} />    */}
      {/* the ShapeSelector.js gets rendered and transmits the function "handleShapeSelect" to the "ShapeSelector" component as a prop with the name "onSelect". 
      The prop "onSelect" is used by the "ShapeSelector" component to pass on the selected shape to the parent component   */}
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={handleStageClick}
        onMouseDown={handleMouseClick} //left mouse btn clicking is connected with handlemouseclick
        onMousemove={handleMouseMovement} // mouse movement is connected with handleMouseMovement
        onMouseup={handleMouseUnClick} // if left mouse button isent clicked anymore it is connected with handleMouseUnClick
        onContextMenu={handleContextMenu} //Handle context menu for stage
        data-testid="whiteboard-stage" // another test id but currently not working
      >
        <Layer>
          {/*renders the lines and with map iterates over every element in lines and every line gets an index i*/}
          {lines.map((line, i) => (
            <Line
              key={i} // key = index ix
              points={line.points} // the line koordinates come from points of every line in lines
              stroke={line.tool === "eraser" ? "#FFFFFF" : "#FF0000"} // the color of the line depends on the tool, pen is red and eraser is the backround color(white)
              strokeWidth={line.strokeWidth} // the stroke width is gathered from srokewidth in lines
              tension={0.5} // standard value for tension
              lineCap="round" // the end of the line is rounded
              globalCompositeOperation={
                line.tool === "eraser" ? "destination-out" : "source-over"
              } // If tool has the value "eraser", the setting is set to "destination-out" to allow the line to be erased.
              // Otherwise, the setting is set to "source-over" to render the line normally.
              data-testid="drawn-line" // another testid. Does not work at the moment either
            />
          ))}

          {/*renders the shapes and with map iterates over every element in shapes and every shape gets an index*/}
          {shapes.map((shape) => {
            return (
              /*
              GetShape will return the shape specified by the type prop.
              and handles selection and transformation of the shape
              */
              <GetShape
                key={shape.key} //Used internally by react
                shapeProps={shape}
                isSelected={shape.key === selectedTargetKey}
                onSelect={() => handleShapeTargetSelection(shape.key)}
                onChange={handleOnChange}
              />
            );
          })}
        </Layer>
      </Stage>

      {/*Render context menu for shape if selected*/}
      <ShapeContextMenu
        x={shapeContextMenu.x}
        y={shapeContextMenu.y}
        isVisible={shapeContextMenu.isVisible}
        handleShapeDelete={handleShapeDelete}
        handleShapeColorPicker={handleShapeColorPicker}
      />

      {/*Render color picker if selected via context menu*/}
      <ShapeColorPicker
        x={colorPicker.x}
        y={colorPicker.y}
        isVisible={colorPicker.isVisible}
        handleShapeColorChange={handleShapeColorChange}
        initialColor={
          !colorPicker.shapeKey
            ? "black"
            : shapes.find((shape) => shape.key === colorPicker.shapeKey).color
        }
      />
    </div>
  );
});
