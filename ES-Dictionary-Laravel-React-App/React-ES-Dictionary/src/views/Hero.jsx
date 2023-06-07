import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Draggable from 'react-draggable';

const MERRIAM_API_KEY = "98a198a3-a200-490a-ad48-98ac95b46d80";
const UNSPLASH_ACCESS_KEY = "";
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
      const response = await fetch(
        "https://random-word-api.vercel.app/api?words=1"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch random word");
      }

      const data = await response.json();
      const word = data[0];
      setRandomWord(word);
      await fetchWordData(word);
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

      // const imageResponse = await fetch(
      //   `${UNSPLASH_API_URL}?query=${word}&client_id=${UNSPLASH_ACCESS_KEY}`
      // );

      // if (!imageResponse.ok) {
      //   throw new Error("Failed to fetch image data");
      // }

      // const imageData = await imageResponse.json();
      // setImageData(imageData.urls.regular);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderDefinitions = () => {
    if (!definitionData || definitionData.length === 0) {
      return <p>No definitions available</p>;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const definitions = definitionData.slice(startIndex, endIndex);

    return definitions.map((entry, index) => (
      <div key={index} className="mb-4">
        <div className="mb-2">
          <span className="bg-coffeeBrown text-black font-semibold py-1 px-2 rounded mr-2">
            {entry.hwi && entry.hwi.hw}
          </span>
          {entry.fl && (
            <span className="bg-coffeeBrown text-black italic py-1 px-2 rounded mr-2">
              {entry.fl}
            </span>
          )}
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
              : "bg-coffeeBrown text-gray-800"
          }font-semibold shadow-md shadow-coffeeDark py-1 px-3 rounded-l focus:outline-none focus:ring-2 focus:ring-coffeeBrown`}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          prev
        </button>
        <span className="px-3 font-semibold underline text-coffeeDark">
          {currentPage}
        </span>
        <button
          className={`${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500"
              : "bg-coffeeBrown text-gray-800"
          }font-semibold shadow-md shadow-coffeeDark py-1 px-3 rounded-r focus:outline-none focus:ring-2 focus:ring-coffeeBrown`}
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          more
        </button>
      </div>
    );
  };

  return (
    <div className="bg-coffee flex min-h-screen justify-center items-center">
      <div className="min-w-max "   id="hero_content">
        <div className="flex-1 px-2" id="hero_text">
          <h1 className="text-5xl font-bold text-coffeeDark mb-8 text-center">
            Expand Your Vocabulary
          </h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
            Discover words and definitions
          </h2>
          <div className="flex justify-center">
            <Link
              to="/dictionary"
              className="bg-coffeeMateB text-coffeeDark py-2 px-6 rounded-full text-2xl font-bold border-2 border-solid shadow-md shadow-coffeeDark border-coffeeDark transition duration-300 hover:bg-coffeeBrown hover:text-gray-800 "
            >
              Learn a New Word Now!
            </Link>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16">
          <h2 className="max-w-md mx-auto text-3xl font-bold text-gray-800 mb-4 ">
            Featured Word
          </h2>
          {definitionData.length > 0 ? (
            <Draggable>
            <div className="max-w-md mx-auto bg-coffeeMate rounded-lg shadow-coffeeDark shadow-sm p-4 border-4 border-solid border-coffeeBrown">
              <h1 className="text-3xl text-coffeeDark font-bold italic mb-4">
                {randomWord}
              </h1>
              {/* <div className="mb-4">
                {imageData && (
                  <img
                    src={imageData}
                    alt={randomWord}
                    className="w-full rounded object-cover"
                    style={{ maxHeight: "200px", minHeight: "200px" }}
                  />
                )}
              </div> */}
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
            </Draggable>
          ) : (
            <div className="max-w-md mx-auto bg-coffeeMate rounded-lg border-4 border-solid border-coffeeBrown shadow-coffeeDark shadow-sm p-4">
              <h1 className="text-3xl font-bold m-auto flex justify-center">
                Loading...
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
