import React, { useState } from "react";
import axios from "axios";

interface Prediction {
  className: string;
  probability: number;
}

const NSFWScanner: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"SAFE" | "NSFW" | null>(null);

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    setImageSrc(URL.createObjectURL(file));
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData);
      setPredictions(res.data.predictions);
      setStatus(res.data.status);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlCheck = async () => {
    if (!url) return;
    setImageSrc(url);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/check-url", { imageUrl: url });
      setPredictions(res.data.predictions);
      setStatus(res.data.status);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getColor = (prob: number) => {
    if (prob > 0.7) return "bg-red-500";
    if (prob > 0.4) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">🔍 NSFW Scanner</h1>

      {/* File Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition mb-4">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="fileInput"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
        />
        <label htmlFor="fileInput" className="text-gray-600 cursor-pointer">Click or drag & drop to upload</label>
      </div>

      {/* URL Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Paste image URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleUrlCheck}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Scan
        </button>
      </div>

      {/* Image Preview */}
      {imageSrc && <img src={imageSrc} alt="Preview" className="w-full h-64 object-contain rounded-lg shadow-md mb-4" />}

      {/* Loading */}
      {loading && <p className="text-blue-500 text-center font-medium">Analyzing image...</p>}

      {/* Results */}
      {predictions.length > 0 && !loading && (
        <div>
          <h2 className="font-semibold mb-2">Results: <span className={status === "NSFW" ? "text-red-600" : "text-green-600"}>{status}</span></h2>
          <ul className="space-y-2">
            {predictions.map((p, idx) => (
              <li key={idx}>
                <div className="flex justify-between">
                  <span>{p.className}</span>
                  <span>{(p.probability * 100).toFixed(2)}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div className={`h-2 rounded ${getColor(p.probability)}`} style={{ width: `${p.probability * 100}%` }}></div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NSFWScanner;
