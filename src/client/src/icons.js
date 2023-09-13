/* file for saving icons as svg
    * at this point, this icons are used in the floating toolbar
*/
// import { handleIcon1Click, handleIcon2Click, handleIcon3Click } from './App.js';
// feather icon
export const DrawButton = ({ handleDrawClick }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    data-testid="DrawButton"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-pen-tool"
    onClick={handleDrawClick}
  >
    <path d="m12 19 7-7 3 3-7 7-3-3z"></path>
    <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
    <path d="m2 2 7.586 7.586"></path>
    <circle cx="11" cy="11" r="2"></circle>
  </svg>
);

// eraser icon
export const EraserButton = ({ handleEraser }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    data-testid="EraserButton"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-eraser"
    onClick={handleEraser}
  >
    <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path>
    <path d="M22 21H7"></path>
    <path d="m5 11 9 9"></path>
  </svg>
);

// shape icon
export const ShapeButton = ({ handleShape }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    data-testid="ShapeButton"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-hexagon"
    onClick={handleShape}
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
  </svg>
);

export const DividingLine = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-minus">
        <line x1="5" x2="19" y1="12" y2="12"></line>
    </svg>
);
export const ExportButton = ({ onClick }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-download"
      data-testid="ExportButton"
      onClick={onClick}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
  


/*
SelectonButton is used to select konva shapes on the stage (for transformations etc.).
*/
export const SelectionButton = ({ handleSelection }) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="lucide lucide-hexagon"
    viewBox="0 0 24 24"
    height="24"
    width="24"
    onClick={handleSelection}
    data-testid="SelectionButton"
  >
    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3zM13 13l6 6" />
  </svg>
);
