import React, { useState, useEffect } from "react";
import axiosClient from "../axios-client.js";
import HeroContent from "./HeroContent.jsx";

export default function Hero() {
  const [dictionaryData, setDictionaryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRandomWord();
  }, []);

  const fetchRandomWord = async () => {
    try {
      const { data } = await axiosClient.get("/random");

      if (!data.word) {
        throw new Error("Failed to fetch random word");
      }

      const { word, image_url, part_of_speech, definition, pronunciation } =
        data.word;

      setDictionaryData({
        word,
        part_of_speech,
        image_url,
        definition,
        pronunciation,
      });
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <HeroContent isLoading={isLoading} dictionaryData={dictionaryData} />
    </div>
  );
}
