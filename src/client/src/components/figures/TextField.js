import React, { useState, useRef, useEffect } from 'react';
import { Text, Transformer } from 'react-konva';
import { EditableFigure } from './EditableFigure';

export const TextField = ({ isSelected, onSelect, textFieldProps, onChange }) => {
  const [isEditing, setEditing] = useState(false); //State for editing mode

  //const [text, setText] = useState("Double click to edit text");

  //Transformer related refs
  const shapeRef = useRef();
  const trRef = useRef();

  //Effect for text-Object (if isSelected is true)
  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  //If the textfield is being left double clicked the editing mode will be enabled
  const handleDblClick = () => {
    setEditing(true);
  };

  const handleDrag = (e) => {
    onChange({
      ...textFieldProps,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  if (!isEditing) {
    //If the textfield is not in editing mode "ResizeableTextField" is rendered
    return (
      <React.Fragment>
        <Text
          key={textFieldProps.shapeKey}
          rotation={textFieldProps.rotation}
          id={textFieldProps.shapeKey}
          x={textFieldProps.x}
          y={textFieldProps.y}
          fontSize={textFieldProps.fontSize}
          text={textFieldProps.text}
          onClick={onSelect}
          onTap={onSelect}
          ref={shapeRef}
          onSelect={onSelect}
          fill={textFieldProps.color}
          draggable
          onDblClick={handleDblClick}
          //Update the position after the textfield is not being dragged anymore
          onDragMove={handleDrag}
          onTransformEnd={(e) => {
            const node = shapeRef.current;

            //Scaling-factors for x and y
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            const fontSize = node.fontSize() * scaleX;

            node.scaleX(1);
            node.scaleY(1);

            //Update position, rotation and font size
            onChange({
              ...textFieldProps,
              x: node.x(),
              y: node.y(),
              rotation: e.target.rotation(),
              // set minimal value
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(node.height() * scaleY),
              fontSize: fontSize,
            });
          }}
        />
        {isSelected && ( //If the text is being selected a konva-transformer object is being applied to the object
          <Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              // limit resize
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
        )}
      </React.Fragment>
    );
  } else {
    return (
      //If the textfield is in editing mode EditableFigure is rendered (HTML textarea)
      <EditableFigure
        onChange={onChange} //Assign our onChange-Function for text-updates
        setEditing={setEditing} //setEditing needs to be passed, so the editing mode can be exited
        shapeProps={textFieldProps}
      />
    );
  }
};