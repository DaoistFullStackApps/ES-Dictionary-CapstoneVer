import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import Draggable from "react-draggable";
import axiosClient from "../axios-client.js";
import debounce from "lodash/debounce";

export default function Hero3() {
  const [words, setRandomWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const debouncedFetchRandomWords = debounce(fetchRandomWords, 200);
    debouncedFetchRandomWords();

    return () => {
      debouncedFetchRandomWords.cancel();
    };
  }, []);

  const fetchRandomWords = async () => {
    try {
      const { data } = await axiosClient.get("/random3");

      if (!data.words || data.words.length === 0) {
        throw new Error("Failed to fetch random words");
      }

      const randomWords = data.words.map((wordData) => {
        const { word, image_url, part_of_speech, definition, pronunciation } =
          wordData;
        return {
          word,
          dictionaryData: {
            part_of_speech,
            image_url,
            definition,
            pronunciation,
          },
        };
      });

      setRandomWords(randomWords);
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  const renderWords = () => {
    if (isLoading) {
      return (
        <div className="max-w-md mx-auto bg-coffeeMate rounded-lg border-4 border-solid border-coffeeBrown shadow-coffeeDark shadow-sm p-4">
          <h1 className="text-3xl font-bold m-auto flex justify-center">
            Loading...
          </h1>
        </div>
      );
    }

    return (
      <div className="flex space-x-4">
        {words.map((wordData, index) => (
          // <Draggable key={index}>
            <div className="max-w-md mx-auto bg-coffeeMate rounded-lg shadow-coffeeDark shadow-sm p-4 border-4 border-solid border-coffeeBrown">
              <h1 className="text-3xl text-coffeeDark font-bold italic mb-4">
                {wordData.word}
              </h1>
              <div className="mb-4">
                {wordData.dictionaryData.image_url && (
                  <img
                    src={wordData.dictionaryData.image_url}
                    alt={wordData.word}
                    className="w-full rounded object-cover"
                    style={{ maxHeight: "150px", minHeight: "150px", width: "300px" }}
                  />
                )}
              </div>
              <div
                className="flex flex-col"
                style={{ maxHeight: "150px", minHeight: "150px", width: "300px" }}
              >
                <div className="flex-1 overflow-y-auto">
                  {renderDefinitions(wordData.dictionaryData)}
                </div>
              </div>
            </div>
          // </Draggable>
        ))}
      </div>
    );
  };

  const renderDefinitions = (dictionaryData) => {
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
            Featured Words
          </h2>
          {renderWords()}
        </div>
      </div>
    </div>
  );
}
