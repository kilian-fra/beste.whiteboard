import "../styles/ShapeContextMenu.css"

export const ShapeContextMenu = ({x, y, isVisible, handleShapeDelete, handleShapeColorPicker}) => {

    if (!isVisible) return null;

    return (
        <div className="shapeContextMenu" style={{top: y, left: x}}>
            <div className="shapeContextMenuItem" onClick={() => handleShapeColorPicker()}>Change Color</div>
            <div className="shapeContextMenuItem" id="shapeContextMenuDel" onClick={() => handleShapeDelete()}>Delete</div>
        </div>
    );
};