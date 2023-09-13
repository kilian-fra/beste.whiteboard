import { ChromePicker } from 'react-color';

/*
ShapeColorPicker uses the react-color libary for creating the color picker
*/

export const ShapeColorPicker = ({x, y, isVisible, handleShapeColorChange, initialColor}) => {

    const handleColorChange = (color) => {
      handleShapeColorChange(color.hex);
    };

    const menuStyles = {
      position: "absolute",
      left: x,
      top: y,
      display: "block"
    };

    if (!isVisible) return null;

    return (
      <div style={menuStyles}>
        <ChromePicker color={initialColor} onChange={handleColorChange} />
      </div>
    );
};