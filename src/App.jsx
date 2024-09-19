import { useState } from "react";
import { useDropzone } from "react-dropzone";

function MainUploader() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

  const onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const errorMsg = rejectedFiles[0].errors[0].message;
      setError(`Error: ${errorMsg}`);
    } else {
      setFile(acceptedFiles[0]);
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    setIsUploading(true); // Disable upload button
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error uploading file");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload the file. Please try again.");
    } finally {
      setIsUploading(false);
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

  const handleViewFile = () => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank");
    }
  };

  const handleDeleteFile = () => {
    setFile(null);
    setResult(null);
    setError("");
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [],
    },
  });

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>Doodle Doc Analyser</h2>
        <div
          {...getRootProps({ className: "dropzone" })}
          style={styles.dropzone}
        >
          <input {...getInputProps()} />
          <p>Drag {`n`} drop a document here, or click to select a file</p>
        </div>
        {file && (
          <div>
            <p style={styles.fileName}>Selected file: {file.name}</p>
            <button
              onClick={handleViewFile}
              style={styles.viewButton}
              disabled={isUploading}
            >
              View File
            </button>
            <button
              onClick={handleDeleteFile}
              style={styles.deleteButton}
              disabled={isUploading}
            >
              Delete File
            </button>
          </div>
        )}
        {error && <p style={styles.error}>{error}</p>}
        <button
          type="submit"
          style={styles.uploadButton}
          onClick={handleSubmit}
          disabled={!file || isUploading}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
        <button
          onClick={handleDownload}
          style={styles.downloadButton}
          disabled={!result}
        >
          Download OCR Data as Text File
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    flexDirection: "column",
    width: "100vw",
    backgroundColor: "#fff",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    maxWidth: "600px",
    margin: "50px auto",
    padding: "32px",
    width: "60%",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  title: {
    color: "#000",
    fontSize: "24px",
    marginBottom: "20px",
  },
  dropzone: {
    border: "2px dashed #ccc",
    padding: "20px",
    borderRadius: "10px",
    cursor: "pointer",
    color: "#000",
    marginBottom: "20px",
    backgroundColor: "#f9f9f9",
  },
  fileName: {
    fontSize: "16px",
    margin: "10px 0",
    color: "#000",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
  },
  uploadButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
    marginTop: "10px",
  },
  downloadButton: {
    backgroundColor: "#2196F3",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  viewButton: {
    backgroundColor: "#FFC107",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
    marginTop: "10px",
  },
  deleteButton: {
    backgroundColor: "#F44336",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default MainUploader;
