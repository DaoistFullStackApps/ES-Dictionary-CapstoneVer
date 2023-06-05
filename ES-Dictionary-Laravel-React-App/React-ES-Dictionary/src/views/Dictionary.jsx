import React, { useRef, useState } from "react";
import axiosClient from "../axios-client.js";

export default function Dictionary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermHeading, setSearchTermHeading] = useState("");
  const [dictionaryData, setDictionaryData] = useState(null);
  const [imageData, setImageData] = useState(null);
  const wordRef = useRef(null);
  const definitionRef = useRef(null);
  const posRef = useRef(null);
  const imgURLRef = useRef(null);

  const handleSearch = async () => {
    setSearchTermHeading(searchTerm);
    setSearchTerm("");

    try {
      const { data } = await axiosClient.post("/check", {
        word: searchTerm,
      });
      const response = { data };

      if (data.exists) {
        console.log(response);
        const { exists, word } = data;
        const { id, word: searchWord, image_url, part_of_speech, definition } = word;
      
        const dictionaryData = {
          hwi: { hw: [searchWord] },
          fl: [part_of_speech],
          shortdef: [definition],
        };
        
        setDictionaryData(dictionaryData);
        setImageData(image_url);
      
        console.log(`word is : ${searchWord}`);
        console.log(`definition is : ${definition}`);
        console.log(`part_of_speech is : ${part_of_speech}`);
      
        // console.log(`You have searched the word ${data.word.word}!`);
        return;
      }
      

      await Promise.all([fetchImage(), fetchDictionary()]);

      const payload = await createPayload();
      console.log(payload);

      axiosClient
        .post("/store", payload)
        .then(({ word }) => {
          console.log(`You have searched the word ${word.word}!`);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            console.log(response.data.errors);
          }
        });
    } catch (error) {
      console.log("Error checking word:", error);
    }
  };

  const decompiler = () => {};

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const createPayload = async () => {
    await Promise.all([fetchImage(), fetchDictionary()]);

    return {
      word: wordRef.current.textContent,
      definition: definitionRef.current
        ? definitionRef.current.textContent
        : "",
      part_of_speech: posRef.current ? posRef.current.textContent : "",
      image_url: imgURLRef.current ? imgURLRef.current.src : "",
    };
  };

  const fetchImage = async () => {
    const UnsplashKey = "Fj2N2fNmwFAPuSC_agE73Mfy0Sv9bqtXS3XhGEcCWSY";
    const UnsplashUrl = `https://api.unsplash.com/photos/random?query=${searchTerm}&client_id=${UnsplashKey}`;

    try {
      const response = await fetch(UnsplashUrl);
      const data = await response.json();
      setImageData(data.urls.regular);
    } catch (error) {
      console.log("Error fetching image:", error);
    }
  };

  const fetchDictionary = async () => {
    const MerriamWebKey = "98a198a3-a200-490a-ad48-98ac95b46d80";
    const MerriamWebUrl = `https://dictionaryapi.com/api/v3/references/collegiate/json/${searchTerm}?key=${MerriamWebKey}`;

    try {
      const response = await fetch(MerriamWebUrl);
      const data = await response.json();

      // Filter the JSON data to include only the relevant entries
      const filteredData = data.filter(
        (entry) => entry.shortdef && entry.shortdef.length > 0
      );

      setDictionaryData(filteredData.length > 0 ? filteredData[0] : null);
    } catch (error) {
      console.log("Error fetching dictionary data:", error);
    }
  };

  const renderDefinitions = () => {
    if (!dictionaryData) return null;

    const { hwi, fl, shortdef } = dictionaryData;

    return (
      <div className="mb-4">
        <div className="mb-2">
          <span className="bg-coffeeBrown text-black font-semibold py-1 px-2 rounded mr-2">
            {hwi && hwi.hw}
          </span>
          {fl && (
            <span
              className="bg-coffeeBrown text-black italic py-1 px-2 rounded mr-2"
              ref={posRef}
            >
              {fl}
            </span>
          )}
        </div>
        {shortdef && shortdef.length > 0 && (
          <p ref={definitionRef}>{shortdef[0]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-coffee flex min-h-screen justify-center items-center">
      <div className="w-2/4 mx-auto min-w-full">
        <div className="max-w-md mx-auto mb-4 flex justify-evenly space-x-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter a word"
            className="w-3/4 px-4 py-2 font-semibold border-2 border-coffeeBrown rounded-md  focus:outline-double focus:ring-coffeeDark focus:border-coffeeDark"
            onKeyDown={handleKeyPress}
          />

          <button
            onClick={handleSearch}
            className="bg-coffeeBrown text-white text-lg font-semibold italic py-2 px-4 rounded shadow-sm shadow-coffeeDark hover:bg-coffeeDark  focus:ring-coffeeDark"
          >
            Search
          </button>
        </div>
        {dictionaryData && imageData && (
          <div className="max-w-md mx-auto bg-coffeeMate rounded-lg border-4 border-solid border-coffeeBrown shadow-coffeeDark shadow-sm p-4">
            <h1
              className="text-3xl text-coffeeDark font-bold italic mb-4"
              ref={wordRef}
            >
              {searchTermHeading}
            </h1>
            <div className="mb-4">
              <img
                ref={imgURLRef}
                src={imageData}
                alt={searchTerm}
                className="w-full rounded object-cover border-2 border-coffeeDark"
                style={{
                  maxHeight: "200px",
                  minHeight: "200px",
                }}
              />
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
        )}
      </div>
    </div>
  );
}
