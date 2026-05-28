import { FiUploadCloud } from "react-icons/fi";
import { useState } from "react";
import axios from "axios";

function App() {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {

    if (!file) {
      alert("Please upload a PDF");
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("pdf", file);

      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData
      );

      setResult(response.data.result);

      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-800">

        <h1 className="text-3xl font-bold text-purple-500">
          EasyLawAI
        </h1>

        <button className="bg-purple-600 hover:bg-purple-700 transition px-5 py-2 rounded-lg font-medium">
          Upload PDF
        </button>

      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20">

        <h2 className="text-5xl md:text-6xl font-bold leading-tight max-w-4xl">
          Understand Legal Documents
          <span className="text-purple-500"> Instantly</span>
        </h2>

        <p className="text-slate-400 text-lg mt-6 max-w-2xl">
          Upload agreements, contracts, or legal PDFs and let AI
          summarize, simplify, and detect risky clauses for you.
        </p>

        {/* Upload Box */}
        <div className="mt-14 w-full max-w-2xl">

          <div className="border-2 border-dashed border-purple-500/40 rounded-3xl p-12 bg-slate-900 hover:border-purple-500 transition cursor-pointer">

            <div className="flex flex-col items-center">

              <FiUploadCloud className="text-6xl text-purple-500" />

              <h3 className="text-2xl font-semibold mt-6">
                Drag & Drop PDF
              </h3>

              <p className="text-slate-400 mt-3">
                or click to upload your legal document
              </p>

              {
                file && (
                  <p className="mt-4 text-purple-400">
                    Uploaded: {file.name}
                  </p>
                )
              }

              <label className="mt-8 bg-purple-600 hover:bg-purple-700 transition px-8 py-3 rounded-xl font-semibold cursor-pointer">

                Choose PDF

                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />

              </label>

            </div>

          </div>

          {/* Analyze Button */}
          <button
            onClick={handleUpload}
            className="mt-8 w-full bg-white text-slate-900 hover:bg-slate-200 transition py-4 rounded-2xl font-bold text-lg"
          >

            {loading ? "Analyzing..." : "Analyze Document"}

          </button>

          {
            result && (
              <div className="mt-10 bg-slate-900 p-6 rounded-2xl border border-slate-800 text-left">

                <h2 className="text-2xl font-bold text-purple-400 mb-4">
                  Extracted Text
                </h2>

                <p className="text-slate-300 whitespace-pre-wrap">
                  {result}
                </p>

              </div>
            )
          }

        </div>

      </section>

    </div>
  );
}

export default App;