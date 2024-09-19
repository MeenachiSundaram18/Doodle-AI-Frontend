import { useState } from "react";
// import axios from "axios";

function DocumentUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
        headers: {
          // 'Content-Type': 'multipart/form-data' is not needed for fetch method;
        },
      });

      if (!response.ok) {
        throw new Error("Error uploading file");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch("http://localhost:3000/download");

      if (!response.ok) {
        throw new Error("Error downloading file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "features.txt";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div>
      <h2>Upload a Document</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      <button onClick={handleDownload}>Download Features as Text File</button>

      {result && (
        <div>
          <h3>Document Analysis Result</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default DocumentUpload;
