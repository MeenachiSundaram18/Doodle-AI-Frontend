import { useState } from "react";

const PdfUploader = () => {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");

  // Function to handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Function to handle prompt input change
  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("prompt", prompt);

    try {
      const response = await fetch("http://localhost:5002/process-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error("Error:", error);
      setResult("An error occurred while processing the PDF.");
    }
  };

  return (
    <div>
      <h1>PDF Document Uploader</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          required
        />
        <input
          type="text"
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Enter your prompt"
          required
        />
        <button type="submit">Upload and Process</button>
      </form>
      {result && (
        <div>
          <h2>Result:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default PdfUploader;
