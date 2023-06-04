import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  const [randomWords, setRandomWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRandomWords = async () => {
      const MerriamWebKey = "98a198a3-a200-490a-ad48-98ac95b46d80";
      const MerriamWebUrl = `https://dictionaryapi.com/api/v3/references/collegiate/json/ass?key=${MerriamWebKey}`;
      const response = await fetch(MerriamWebUrl);
      const data = await response.json();
      setRandomWords(data);

      // Store randomWords in localStorage
      localStorage.setItem("randomWords", JSON.stringify(data));

      setIsLoading(false);
    };

    // Check if randomWords is stored in localStorage
    const storedRandomWords = localStorage.getItem("randomWords");
    if (storedRandomWords) {
      setRandomWords(JSON.parse(storedRandomWords));
      setIsLoading(false);
    } else {
      fetchRandomWords();
    }
  }, []);

  const WordCard = ({ word }) => {
    const [imageData, setImageData] = useState(null);

    useEffect(() => {
      const fetchImage = async () => {
        const UnsplashKey = "gVfJPtlmzZ4XoaVB4p5SdGe0ILjssdLMcDqR3FH5gn0";
        const UnsplashUrl = `https://api.unsplash.com/photos/random?query=${word}&client_id=${UnsplashKey}`;
        const response = await fetch(UnsplashUrl);
        const data = await response.json();
        setImageData(data.urls.regular);
      };

      fetchImage();
    }, [word]);

    return (
      <div className="max-w-sm mx-auto bg-white rounded-lg shadow-xl p-4 mb-4">
        <div className="mb-2">
          <img
            src={imageData}
            alt={word}
            className="w-full rounded object-cover"
            style={{ maxHeight: "200px", minHeight: "200px" }}
          />
        </div>
        <h2 className="text-xl font-bold mb-2">{word}</h2>
        {word.definition && <p className="text-gray-600">{word.definition}</p>}
      </div>
    );
  };

  return (
    <div className="bg-blue-500 py-20 text-white">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-bold mb-8">Discover New Words</h1>
        <p className="text-xl mb-8">
          Expand your vocabulary and explore their definitions
        </p>
        <Link
          to="/dictionary"
          className="bg-white text-blue-500 py-2 px-6 rounded-lg font-bold hover:bg-blue-100 hover:text-blue-700 transition duration-300"
        >
          Learn New Words Now
        </Link>
      </div>
      <div className="container mx-auto mt-20">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {randomWords.slice(0, 2).map((word, index) => (
              <WordCard key={index} word={word.hwi?.hw || ""} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
