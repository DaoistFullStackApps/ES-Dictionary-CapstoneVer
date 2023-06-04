import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const RANDOMWORD_API_KEY = "MaRBdB4b4g4k02ApBzvHjQ==q3vVu09pSG8zMPmR";
const MERRIAM_API_KEY = "98a198a3-a200-490a-ad48-98ac95b46d80";
const UNSPLASH_ACCESS_KEY = "";
const RANDOMWORD_API_URL = "https://api.api-ninjas.com/v1/randomword";
const MERRIAM_API_URL =
  "https://dictionaryapi.com/api/v3/references/collegiate/json/";
const UNSPLASH_API_URL = "https://api.unsplash.com/photos/random";

export default function Hero() {
  const [randomWord, setRandomWord] = useState("");
  const [definitionData, setDefinitionData] = useState([]);
  const [imageData, setImageData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;

  useEffect(() => {
    fetchRandomWord();
  }, []);

  const fetchRandomWord = async () => {
    try {
      const response = await fetch(RANDOMWORD_API_URL, {
        headers: {
          "X-Api-Key": RANDOMWORD_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch random word");
      }

      const data = await response.json();
      const word = data.word;
      setRandomWord(word);

      fetchWordData(word);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchWordData = async (word) => {
    try {
      const definitionResponse = await fetch(
        `${MERRIAM_API_URL}${word}?key=${MERRIAM_API_KEY}`
      );

      if (!definitionResponse.ok) {
        throw new Error("Failed to fetch word definition");
      }

      const definitionData = await definitionResponse.json();
      setDefinitionData(definitionData);

      const imageResponse = await fetch(
        `${UNSPLASH_API_URL}?query=${word}&client_id=${UNSPLASH_ACCESS_KEY}`
      );

      if (!imageResponse.ok) {
        throw new Error("Failed to fetch image data");
      }

      const imageData = await imageResponse.json();
      setImageData(imageData.urls.regular);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderDefinitions = () => {
    if (!definitionData) return null;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const definitions = definitionData.slice(startIndex, endIndex);

    return definitions.map((entry, index) => (
      <div key={index} className="mb-4">
        <div className="mb-2">
          <span className="bg-blue-200 text-blue-800 py-1 px-2 rounded mr-2">
            {entry.hwi && entry.hwi.hw}
          </span>
          <span className="bg-blue-200 text-blue-800 py-1 px-2 rounded mr-2">
            {entry.fl}
          </span>
        </div>
        {entry.shortdef && entry.shortdef.length > 0 && (
          <p>{entry.shortdef[0]}</p>
        )}
      </div>
    ));
  };

  const renderPagination = () => {
    if (!definitionData || definitionData.length <= itemsPerPage) return null;

    const totalPages = Math.ceil(definitionData.length / itemsPerPage);

    return (
      <div className="flex justify-center items-center mt-4">
        <button
          className={`${
            currentPage === 1
              ? "bg-gray-300 text-gray-500"
              : "bg-blue-500 text-white"
          } py-1 px-3 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500`}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Prev
        </button>
        <span className="px-3">{currentPage}</span>
        <button
          className={`${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500"
              : "bg-blue-500 text-white"
          } py-1 px-3 rounded-r focus:outline-none focus:ring-2 focus:ring-blue-500`}
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="bg-blue-400 min-h-screen justify-center py-20 ">
      <div className="flex-1 min-w-0">
        <h1 className="text-5xl font-bold text-white mb-8 text-center">
          Discover New Words
        </h1>
        <h2 className="text-3xl text-white mb-8 text-center">
          Expand Your Vocabulary
        </h2>
        <div className="flex justify-center">
          <Link
            to="/dictionary"
            className="bg-white text-blue-500 py-2 px-6 rounded-full text-2xl font-semibold transition duration-300 hover:bg-blue-500 hover:text-white"
          >
            Explore
          </Link>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-16">
        <h2 className="max-w-md mx-auto text-3xl font-bold text-white mb-8 ">
          Featured Word
        </h2>
        {randomWord ? (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-4">
            <h1 className="text-3xl font-bold mb-4">{randomWord}</h1>
            <div className="mb-4">
              {imageData && (
                <img
                  src={imageData}
                  alt={randomWord}
                  className="w-full rounded object-cover"
                  style={{ maxHeight: "200px", minHeight: "200px" }}
                />
              )}
            </div>
            <div
              className="flex flex-col"
              style={{ maxHeight: "140px", minHeight: "140px" }}
            >
              <div className="flex-1 overflow-y-auto">
                {renderDefinitions()}
              </div>
              <div className="mt-4">{renderPagination()}</div>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-4">
            <h1 className="text-3xl font-bold m-auto flex justify-center">
              Loading
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
