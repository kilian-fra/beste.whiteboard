import jsPDF from "jspdf";

// Function to handle the export button click
export const handleExportClick = (stage) => {
  console.log(stage);

  // Create a custom modal for format selection
  const modal = createModal();

  // Create text field for file name input
  const fileNameInput = createFileNameInput();

  // Create buttons for format selection in
  const pngButton = createButton("PNG", () => {
    // Add correct extension to filename
    const fileName = getFileName(fileNameInput.value, "png");

    // Convert the stage to PNG data URL
    const pngDataUrl = stage.toDataURL({ mimeType: "image/png" });

    // Download the PNG image
    downloadImage(pngDataUrl, fileName, "image/png");

    // Close the modal
    closeModal(modal);
  });

  const jpegButton = createButton("JPEG", () => {
    // Add correct extension to filename
    const fileName = getFileName(fileNameInput.value, "jpg");

    // Create a temporary canvas to draw the stage image
    const tempCanvas = document.createElement("canvas");
    const tempContext = tempCanvas.getContext("2d");
    tempCanvas.width = stage.width();
    tempCanvas.height = stage.height();

    // Fill the canvas with white color
    tempContext.fillStyle = "white";
    tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Create an image element for the stage
    const stageImage = new Image();
    stageImage.src = stage.toDataURL();

    // Wait for the stage image to load
    stageImage.onload = () => {
      // Draw the stage image on the temporary canvas
      tempContext.drawImage(stageImage, 0, 0);

      // Convert the temporary canvas to JPEG data URL
      const jpegDataUrl = tempCanvas.toDataURL("image/jpeg", 0.8);

      // Download the JPEG image
      downloadImage(jpegDataUrl, fileName, "image/jpeg");

      // Close the modal
      closeModal(modal);
    };
  });

  const svgButton = createButton("SVG", () => {
    // Add correct extension to filename
    const fileName = getFileName(fileNameInput.value, "svg");

    // Get the SVG content from the stage
    const stageElement = stage.content;
    const svgData = new XMLSerializer().serializeToString(stageElement);

    // Create a data URL for the SVG content
    const dataUrl =
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);

    // Create a link element to trigger the download
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = fileName;
    link.click();

    // Close the modal
    closeModal(modal);
  });

  const pdfButton = createButton("PDF", () => {
    // Add correct extension to filename
    const fileName = getFileName(fileNameInput.value, "pdf");

    // Generate the PDF document from the stage
    const pdf = generatePdf(stage, fileName);

    // Download the PDF document
    downloadPdf(pdf, fileName);

    // Close the modal
    closeModal(modal);
  });

  const cancelButton = createButton("Cancel", () => {
    // Close the modal
    closeModal(modal);
  });

  // Create modal content
  const modalContent = createModalContent();

  // Add elements to the modal content
  modalContent.appendChild(fileNameInput);
  modalContent.appendChild(pngButton);
  modalContent.appendChild(jpegButton);
  //modalContent.appendChild(svgButton); // Deactivated, because it doesn't work properly
  modalContent.appendChild(pdfButton);
  modalContent.appendChild(cancelButton);

  // Add the modal content to the modal
  modal.appendChild(modalContent);
};

// Function to generate a PDF document from the stage
const generatePdf = (stage, fileName) => {
  const width = stage.width();
  const height = stage.height();

  // Create a temporary canvas to draw the stage image
  const tempCanvas = document.createElement("canvas");
  const tempContext = tempCanvas.getContext("2d");
  tempCanvas.width = width;
  tempCanvas.height = height;

  // Fill the canvas with white color
  tempContext.fillStyle = "white";
  tempContext.fillRect(0, 0, width, height);

  // Create an image element for the stage
  const stageImage = new Image();
  stageImage.src = stage.toDataURL();

  return new Promise((resolve, reject) => {
    stageImage.onload = () => {
      // Draw the stage image on the temporary canvas
      tempContext.drawImage(stageImage, 0, 0);

      // Convert the temporary canvas to JPEG data URL
      const imageDataUrl = tempCanvas.toDataURL("image/jpeg");

      // Create a new jsPDF instance
      const pdf = new jsPDF({
        orientation: width > height ? "l" : "p",
        unit: "pt",
        format: [width, height],
      });

      // Add the image to the PDF document
      pdf.addImage(imageDataUrl, "JPEG", 0, 0, width, height);

      resolve(pdf);
    };

    stageImage.onerror = (error) => {
      reject(error);
    };
  });
};

// Function to download the PDF document
const downloadPdf = async (pdf, fileName) => {
  // async, so that the download is not accidently done twice
  try {
    const generatedPdf = await pdf;
    generatedPdf.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

// Function to create a modal for user input
const createModal = () => {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.setAttribute("data-testid", "ExportModal");

  document.body.appendChild(modal);

  return modal;
};

// Function to create the modal content
const createModalContent = () => {
  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";
  return modalContent;
};

// Function to create a button element with given text
const createButton = (text, onClick) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = "format-button";
  button.addEventListener("click", onClick);
  return button;
};

// Function to create an input field, to enter a file name
const createFileNameInput = () => {
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Enter file name";
  input.className = "file-name-input";
  return input;
};

// Function to close the modal
const closeModal = (modal) => {
  document.body.removeChild(modal);
};

// Function to download the whiteboard
const downloadImage = (dataUrl, fileName, mimeType) => {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  link.type = mimeType;

  // Revoke the object URL after a delay to clean up resources
  link.addEventListener("click", () => {
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
  });

  link.click();
};

// Function to get the file name with extension
export const getFileName = (input, extension) => {
  const fileName = input.trim();
  if (fileName) {
    return `${fileName}.${extension}`;
  } else {
    return `whiteboard.${extension}`;
  }
};
