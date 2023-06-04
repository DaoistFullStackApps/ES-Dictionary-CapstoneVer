import React, { useEffect, useState } from "react";

// description : The first code base you provided seems to be working fine. It is a React component called "Dictionary" that allows users to search for a term and displays the definition and an image related to that term. When the user enters a search term and clicks the "Search" button or presses Enter, it triggers the handleSearch function. This function calls fetchImage and fetchDictionary functions using Promise.all to fetch data from the Unsplash API and Merriam-Webster API respectively. Once the data is fetched, it updates the state variables searchTermHeading, dictionaryData, and imageData. The component then renders the search results, including the term heading, image, definitions, and pagination.

export default function Dictionary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermHeading, setSearchTermHeading] = useState(""); // New state for the fixed search term
  const [dictionaryData, setDictionaryData] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;

  const handleSearch = async () => {
    await Promise.all([fetchImage(), fetchDictionary()]);
    setSearchTermHeading(searchTerm); // Update the fixed search term heading
    setSearchTerm(""); // Clear the search term input
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const fetchImage = async () => {
    const UnsplashKey = "gVfJPtlmzZ4XoaVB4p5SdGe0ILjssdLMcDqR3FH5gn0";
    const UnsplashUrl = `https://api.unsplash.com/photos/random?query=${searchTerm}&client_id=${UnsplashKey}`;
    const response = await fetch(UnsplashUrl);
    const data = await response.json();
    setImageData(data.urls.regular);
  };

  const fetchDictionary = async () => {
    const MerriamWebKey = "98a198a3-a200-490a-ad48-98ac95b46d80";
    const MerriamWebUrl = `https://dictionaryapi.com/api/v3/references/collegiate/json/${searchTerm}?key=${MerriamWebKey}`;
    const response = await fetch(MerriamWebUrl);
    const data = await response.json();
    setDictionaryData(data);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderDefinitions = () => {
    if (!dictionaryData) return null;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const definitions = dictionaryData.slice(startIndex, endIndex);

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
    if (!dictionaryData || dictionaryData.length <= itemsPerPage) return null;

    const totalPages = Math.ceil(dictionaryData.length / itemsPerPage);

    return (
      <div className="flex justify-center items-center mt-4">
        <button
          className={`${
            currentPage === 1
              ? "bg-gray-300 text-gray-500"
              : "bg-coffeeBrown text-gray-800 "
          }shadow-md shadow-coffeeDark py-1 px-3 rounded-l focus:outline-none focus:ring-2 focus:ring-coffeeBrown`}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Prev
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
          Next
        </button>
      </div>
    );
  };

  return (
    <div
      className="bg-coffee flex min-h-screen justify-center items-center"
      style={{ paddingTop: "50px", paddingBottom: "50px" }}
    >
      <div className="w-2/4 mx-auto min-w-full">
        <div className="max-w-md mx-auto mb-4 flex justify-evenly space-x-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="enter a word"
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
            <h1 className="text-3xl text-coffeeDark font-bold italic mb-4">
              {searchTermHeading}
            </h1>{" "}
            {/* Use the fixed search term heading */}
            <div className="mb-4">
              <img
                src={imageData}
                alt={searchTerm}
                className="w-full rounded object-cover border-2 border-coffeeDark"
                style={{ maxHeight: "200px", minHeight: "200px" }}
              />
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
        )}
      </div>
    </div>
  );
}
