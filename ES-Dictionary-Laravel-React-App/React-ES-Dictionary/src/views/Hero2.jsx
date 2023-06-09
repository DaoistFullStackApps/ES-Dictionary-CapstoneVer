import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Draggable from "react-draggable";
import axiosClient from "../axios-client.js";
import debounce from "lodash/debounce";

export default function Hero() {
  const [word, setRandomWord] = useState("");
  const [dictionaryData, setDictionaryData] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const debouncedFetchRandomWord = debounce(fetchRandomWord, 10);
    debouncedFetchRandomWord();

    return () => {
      debouncedFetchRandomWord.cancel();
    };
  }, []);

  const fetchRandomWord = async () => {
    try {
      const { data } = await axiosClient.get("/random");

      if (!data.word) {
        throw new Error("Failed to fetch random word");
      }

      const {
        word: searchWord,
        image_url,
        part_of_speech,
        definition,
        pronunciation,
      } = data.word;

      setRandomWord(searchWord);

      setDictionaryData({
        part_of_speech,
        image_url,
        definition,
        pronunciation,
      });

      setImageData(image_url);
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  const renderDefinitions = () => {
    if (!dictionaryData) return null;

    const { pronunciation, part_of_speech, definition } = dictionaryData;

    return (
      <div className="mb-4">
        <div className="mb-2">
          <span className="bg-coffeeBrown text-black font-semibold py-1 px-2 rounded mr-2">
            {pronunciation}
          </span>
          {part_of_speech && (
            <span className="bg-coffeeBrown text-black italic py-1 px-2 rounded mr-2">
              {part_of_speech}
            </span>
          )}
        </div>
        {definition && <p>{definition}</p>}
      </div>
    );
  };

  return (
    <div className="bg-coffee flex min-h-screen justify-center items-center">
      <div className="min-w-max" id="hero_content">
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
              className="bg-coffeeMateB text-coffeeDark py-2 px-6 rounded-full text-2xl font-bold border-2 border-solid shadow-md shadow-coffeeDark border-coffeeDark transition duration-300 hover:bg-coffeeBrown hover:text-gray-800"
            >
              Learn a New Word Now!
            </Link>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16">
          <h2 className="max-w-md mx-auto text-3xl font-bold text-gray-800 mb-4">
            Featured Word
          </h2>
          {isLoading ? (
            <div className="max-w-md mx-auto bg-coffeeMate rounded-lg border-4 border-solid border-coffeeBrown shadow-coffeeDark shadow-sm p-4">
              <h1 className="text-3xl font-bold m-auto flex justify-center">
                Loading...
              </h1>
            </div>
          ) : (
            <Draggable>
              <div className="max-w-md mx-auto bg-coffeeMate rounded-lg shadow-coffeeDark shadow-sm p-4 border-4 border-solid border-coffeeBrown">
                <h1 className="text-3xl text-coffeeDark font-bold italic mb-4">
                  {word}
                </h1>
                <div className="mb-4">
                  {imageData && (
                    <img
                      src={imageData}
                      alt={word}
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
                </div>
              </div>
            </Draggable>
          )}
        </div>
      </div>
    </div>
  );
}
