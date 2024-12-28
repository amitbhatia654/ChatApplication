import toast from "react-hot-toast";

export default function ShowToast() {
  toast("You have unsaved changes. Please save or cancel before proceeding !", {
    duration: 3000,
    style: {
      backgroundColor: "#f8d7da", // Example of background color
      color: "#721c24", // Example of text color
      border: "1px solid #f5c6cb", // Example of border
      padding: "10px", // Padding for the toast
      fontSize: "16px", // Font size
      borderRadius: "5px", // Rounded corners
    },
  });
}

export const handlePrint = (printRef, folderName, Topic) => {
  const printContent = printRef.current; // Access the content to print
  if (!printContent) {
    console.error("Print content not found");
    return;
  }

  // Create a hidden iframe for printing
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.top = "-10000px"; // Hide it off-screen
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

  // Write the content to the iframe
  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cloud NoteBook ${Topic ?? "---"}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .text-danger { color: blue; }
        </style>
      </head>
      <body>
        
   <h2 class="text-danger text-center">
  ${folderName ?? "Subject"}: ${Topic ?? "--"}
</h2>
        ${printContent.innerHTML}
      </body>
    </html>
  `);
  iframeDoc.close();

  // Trigger printing from the iframe
  iframe.contentWindow.focus();
  iframe.contentWindow.print();

  // Remove the iframe after printing
  iframe.addEventListener("afterprint", () => {
    document.body.removeChild(iframe);
  });
};
