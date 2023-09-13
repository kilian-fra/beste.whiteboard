import React, { useState, useRef } from 'react';
import {Rect, Circle, Ellipse, Line, Transformer } from 'react-konva';
import { TextField } from './TextField';

export const GetShape = ({ isSelected, onSelect, shapeProps, onChange }) => {
  const shapeRef = useRef();

  //Handle transformation for all other shapes
  const handleTransformationChanges = (e) => {
    onChange({
      ...shapeProps,
      rotation: e.target.rotation(),
      x: e.target.x(),
      y: e.target.y(),
      width: e.target.scaleX() * e.target.width(),
      height: e.target.scaleY() * e.target.height(),
    });
  };

  //Handle transformation for dot-shapes
  const handlePointTransformation = (e) => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    //Transform each point in the shape
    const newPoints = node.points().map((coord, i) => {
      return i % 2 === 0
        ? node.x() + (coord - node.x()) * scaleX
        : node.y() + (coord - node.y()) * scaleY;
    });

    //Update props. for shape
    const newShapeProps = {
      ...shapeProps,
      rotation: e.target.rotation(),
      points: newPoints,
      x: scaleX,
      y: scaleY,
    };

    onChange(newShapeProps);
  };

  const handleDrag = (e) => {
    onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() });
  };

  //Returns the correct shape according to the given type prop.
  const getShapeFromType = () => {
    switch (shapeProps.type) {
      case "rect":
        return (
          <Rect
            ref={shapeRef}
            key={shapeProps.shapeKey}
            id={shapeProps.shapeKey}
            x={shapeProps.x}
            y={shapeProps.y}
            rotation={shapeProps.rotation}
            width={shapeProps.width === 0 ? 100 : shapeProps.width}
            height={shapeProps.height === 0 ? 50 : shapeProps.height}
            fill={shapeProps.color}
            draggable
            onClick={onSelect}
            onTransformEnd={handleTransformationChanges}
            onDragMove={handleDrag}
          />
        );
      case "ellipse":
        return (
          <Ellipse
            ref={shapeRef}
            key={shapeProps.key}
            id={shapeProps.shapeKey}
            x={shapeProps.x}
            y={shapeProps.y}
            rotation={shapeProps.rotation}
            width={shapeProps.width === 0 ? 75 : shapeProps.width}
            height={shapeProps.height === 0 ? 50 : shapeProps.height}
            fill={shapeProps.color}
            draggable
            onClick={onSelect}
            onTransformEnd={handleTransformationChanges}
            onDragMove={handleDrag}
          />
        );
      case "triangle":
        return (
          <Line
            ref={shapeRef}
            key={shapeRef.key}
            id={shapeProps.shapeKey}
            rotation={shapeProps.rotation}
            points={[
              shapeProps.x,
              shapeProps.y + 50,
              shapeProps.x + 50,
              shapeProps.y,
              shapeProps.x + 100,
              shapeProps.y + 50,
            ]}
            closed
            fill={shapeProps.color}
            draggable
            onClick={onSelect}
            onTransformEnd={handlePointTransformation}
            onDragMove={handleDrag}
          />
        );
      case "arrow":
        return (
          <Line
            ref={shapeRef}
            key={shapeProps.key}
            id={shapeProps.shapeKey}
            rotation={shapeProps.rotation}
            points={[
              shapeProps.x,
              shapeProps.y,
              shapeProps.x + 100,
              shapeProps.y,
              shapeProps.x + 90,
              shapeProps.y + 10,
              shapeProps.x + 90,
              shapeProps.y - 10,
              shapeProps.x + 100,
              shapeProps.y,
            ]}
            closed
            fill={shapeProps.color}
            stroke={shapeProps.color}
            strokeWidth={2}
            lineJoin="round"
            lineCap="round"
            draggable
            onClick={onSelect}
            onTransformEnd={handlePointTransformation}
            onDragMove={handleDrag}
          />
        );
      case "circle":
        return (
          <Circle
            ref={shapeRef}
            rotation={shapeProps.rotation}
            key={shapeProps.key}
            id={shapeProps.shapeKey}
            x={shapeProps.x}
            y={shapeProps.y}
            radius={25}
            fill={shapeProps.color}
            draggable
            onClick={onSelect}
            onTransformEnd={handleTransformationChanges}
            onDragMove={handleDrag}
          />
        );

      default:
        return null;
    }
  };

  if (shapeProps.type === "textfield") {
    return (
      <TextField
        textFieldProps={shapeProps}
        onChange={onChange}
        isSelected={isSelected}
        onSelect={onSelect}
      />
    );
  } else {
    return (
      <React.Fragment>
        {getShapeFromType()}
        {/*Assign transformer to the shape, if it is selected*/}
        {isSelected && <Transformer nodes={[shapeRef.current]} />}
      </React.Fragment>
    );
  }
};