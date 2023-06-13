import React from "react";
import { Link } from "react-router-dom";
import Loading from "../helper_functions/Loading.jsx";
import {
  RenderImage,
  RenderDefinitions,
} from "../helper_functions/HeroRender.jsx";

export default function HeroContent({ isLoading, dictionaryData }) {
  return (
    <div className="bg-coffee flex min-h-screen justify-center items-top">
      <div className="min-w-max" id="hero_content">
        <div className="flex-1 px-2" id="hero_text">
          <h1 className="text-5xl font-bold text-coffeeDark mb-8 text-center">
            Expand Your Vocabulary
          </h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-3 text-center">
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
        <div className="container mx-auto px-4 mt-7">
          <h2 className="max-w-30px text-6xl font-bold text-gray-800 mb-6 text-center" id="feature_word">
            Featured Word
          </h2>
          {isLoading ? (
            <div className="max-w-md mx-auto bg-coffeeMate rounded-lg border-4 border-solid border-coffeeBrown shadow-coffeeDark shadow-sm p-4" id="dictionary_hero">
              <h1 className="font-bold m-auto flex justify-center">
                <Loading className="text-sm" />
              </h1>
            </div>
          ) : (
            dictionaryData && (
              <div className="max-w-md mx-auto bg-coffeeMate rounded-lg shadow-coffeeDark shadow-sm p-4 border-4 border-solid border-coffeeBrown" id="dictionary_hero">
                <h1 className="text-3xl text-coffeeDark font-bold italic mb-4 text-left">
                  {dictionaryData.word}
                </h1>
                <div className="mb-4">
                  <RenderImage dictionaryData={dictionaryData} />
                </div>
                <div
                  className="flex flex-col"
                  style={{ maxHeight: "100px", minHeight: "100px", width: "100%" }}
                >
                  <div className="flex-1 overflow-y-auto text-left">
                    <RenderDefinitions dictionaryData={dictionaryData} />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
