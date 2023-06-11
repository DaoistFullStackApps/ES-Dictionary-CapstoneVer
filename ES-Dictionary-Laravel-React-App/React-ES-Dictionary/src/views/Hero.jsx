import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import Draggable from "react-draggable";
import axiosClient from "../axios-client.js";
import { debounce } from "lodash";

export default function Hero() {
  const [randomWord, setRandomWord] = useState("");
  const [dictionaryData, setDictionaryData] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    debouncedFetchRandomWord();
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
      await fetchDataFromDatabase(word);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const debouncedFetchRandomWord = debounce(fetchRandomWord, 700);

  const fetchDataFromDatabase = async (word) => {
    try {
      const { data } = await axiosClient.post("/check", {
        word: word.toLowerCase(),
      });

      if (data.exists) {
        const {
          exists,
          word: {
            id,
            word: searchWord,
            image_url,
            part_of_speech,
            definition,
            pronunciation,
          },
        } = data;

        setDictionaryData({
          hwi: { hw: [pronunciation] },
          fl: [part_of_speech],
          shortdef: [definition],
        });

        setImageData(image_url);
        setIsLoading(false);
        return;
      }

      const payload = await fetchData(word);
      if (!payload) {
        const errorMessage = `The word ${word} is invalid!`;
        console.log(errorMessage);
        //prototype to MAKE sure if the RandomWord generated didn't return a result, it will be triggered again
        debouncedFetchRandomWord();
        return;
      } else {
        setDictionaryData({
          hwi: { hw: [payload.pronunciation] },
          fl: [payload.part_of_speech],
          shortdef: [payload.definition],
        });

        setImageData(payload.image_url);
      }

      axiosClient
        .post("/store", payload)
        .then(
          ({
            data: {
              word: { word: storedWord },
            },
          }) => {
            console.log(`The word you stored is ${storedWord}`);
          }
        )
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 404) {
            console.log("Axios POST Error:", response.data.errors);
          }
        });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const errorMessage = error.response.data.message;
        console.log("Validation Error:", errorMessage);
        setDictionaryData("");
        setImageData("");
      } else {
        console.log("Error checking word:", error);
      }
    }
    setIsLoading(false);
  };


   const imageApiKeys = [
    "gVfJPtlmzZ4XoaVB4p5SdGe0ILjssdLMcDqR3FH5gn0",
    "Fj2N2fNmwFAPuSC_agE73Mfy0Sv9bqtXS3XhGEcCWSY"
   ]


  const fetchData = async (searchTerm) => {
    const cleanedSearchTerm = searchTerm.toLowerCase();

    const UnsplashKey = "Fj2N2fNmwFAPuSC_agE73Mfy0Sv9bqtXS3XhGEcCWSY";
    const UnsplashUrl = `https://api.unsplash.com/photos/random?query=${cleanedSearchTerm}&client_id=${UnsplashKey}`;
    const MerriamWebKey = "98a198a3-a200-490a-ad48-98ac95b46d80";
    const MerriamWebUrl = `https://dictionaryapi.com/api/v3/references/collegiate/json/${cleanedSearchTerm}?key=${MerriamWebKey}`;

    try {
      const [imageResponse, dictionaryResponse] = await Promise.all([
        fetch(UnsplashUrl),
        fetch(MerriamWebUrl),
      ]);

      const imageData = await imageResponse.json();
      // console.log("imageData:", imageData);

      const dictionaryData = await dictionaryResponse.json();

      const filteredData = dictionaryData.filter(
        (entry) => entry.shortdef && entry.shortdef.length > 0
      );

      const dictionaryDataToSet =
        filteredData.length > 0 ? filteredData[0] : null;

      //prototype
      // Extract the id and remove non-letter characters
      const id = dictionaryDataToSet?.meta?.id || "";
      const cleanedKeyword = id.replace(/[^a-zA-Z]/g, "");

      console.log("cleanedKeyword:", cleanedKeyword);
      console.log("searchedKeyword:", searchTerm);

      // Create the payload using the response data
      let payload = null;

      if (
        imageData &&
        imageData.urls &&
        imageData.urls.small &&
        cleanedKeyword === cleanedSearchTerm
      ) {
        payload = createPayload(
          imageData.urls.small,
          dictionaryDataToSet,
          searchTerm
        );
      } else {
        console.log(`FetchData 404 Error: ${searchTerm} IS NOT FOUND`);
      }

      return payload;
    } catch (error) {
      console.log("Error fetching data:", error);
      return null;
    }
  };

  const createPayload = (imageData, dictionaryData, searchTerm) => {
    if (!dictionaryData) {
      return null;
    }

    const { hwi, fl, shortdef } = dictionaryData;

    const pronunciation = hwi?.hw || "";
    const part_of_speech = fl || "";
    const definition = shortdef?.[0] || "";
    const image_url = imageData;
    const word = searchTerm.toLowerCase();

    return {
      word,
      pronunciation,
      definition,
      part_of_speech,
      image_url,
    };
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
            <span className="bg-coffeeBrown text-black italic py-1 px-2 rounded mr-2">
              {fl}
            </span>
          )}
        </div>
        {shortdef && shortdef.length > 0 && <p>{shortdef[0]}</p>}
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
            // <Draggable>
              <div className="max-w-md mx-auto bg-coffeeMate rounded-lg shadow-coffeeDark shadow-sm p-4 border-4 border-solid border-coffeeBrown">
                <h1 className="text-3xl text-coffeeDark font-bold italic mb-4">
                  {randomWord.toLowerCase()}
                </h1>
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
                </div>
              </div>
            // </Draggable>
          )}
        </div>
      </div>
    </div>
  );
}
