import React from "react";

function ShapeSelector({ onSelect }) {
  return (
    <div className="ShapeButtonContainer" data-testid="ShapeSelector">
      <button
        className="ShapeButton rect"
        data-testid="btnRect"
        onClick={() => onSelect("rect")}
      >
        {/* 
          renders the Button Rectangle and the function onSelect is called with the argument "rect". 
          The onSelect function is a passed function that was passed as a prop when the ShapeSelector component was rendered.
          Calling onSelect("rect") signals that the rectangle has been selected. 
      */}
        Rectangle
      </button>
      <button
        className="ShapeButton circle"
        data-testid="btnCircle"
        onClick={() => onSelect("circle")}
      >
        Circle
      </button>
      <button
        className="ShapeButton ellipse"
        data-testid="btnEllipse"
        onClick={() => onSelect("ellipse")}
      >
        Ellipse
      </button>
      <button
        className="ShapeButton triangle"
        data-testid="btnTriangle"
        onClick={() => onSelect("triangle")}
      >
        Triangle
      </button>
      <button
        className="ShapeButton arrow"
        data-testid="btnArrow"
        onClick={() => onSelect("arrow")}
      >
        Arrow
      </button>
      <button
        className="ShapeButton arrow"
        data-testid="btnTextfield"
        onClick={() => onSelect("textfield")}
      >
        Textfield
      </button>
    </div>
  );

}

export default ShapeSelector;
