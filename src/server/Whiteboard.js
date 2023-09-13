
class Whiteboard {

  constructor(shapesArray, linesArray) {
    this._shapes = shapesArray && shapesArray.length !== 0 ? [...shapesArray] : [];
    this._lines = linesArray && linesArray.length !== 0 ? [...linesArray] : [];

    this.shapeIdCount = 0;
    this.linesIdCount = 0;
  }

  // Returns a new unique key, that can be used for new shapes
  findUniqueKey() {
    let index = 0;
    let found = false;
    let key = "";

    while (!found) {
      key = `shape${index}`;
      const existingShape = this._shapes.find(shape => shape.key === key);
      if (!existingShape) {
        found = true;
      } else {
        index++;
      }
    }

    return key;
  }

  updateShape(changedShape) {
    const index = this._shapes.findIndex((shape) => shape.key === changedShape.key);
    if (index === -1) return false;
    this._shapes[index] = changedShape;
    return true;
  }

  //Create the shape for the target whiteboard and returns it with the corect key
  createShape(shape) {
    shape.key = this.findUniqueKey();
    console.log("shape created with id: ", shape.key);
    this._shapes.push(shape);
    return shape;
  }

  deleteShape(shapeKey) {
    const index = this._shapes.findIndex((shape) => shape.key === shapeKey);
    if (index !== -1) {
      this._shapes.splice(index, 1);
      return true;
    }
    return false;
  }

  // Getter for shapes
  get shapes() {
    // Return a shallow copy of the shapes map
    return [...this._shapes];
  }

  // Getter for lines
  get lines() {
    // Return a shallow copy of the lines map
    return [...this._lines];
  }
}

module.exports = Whiteboard;