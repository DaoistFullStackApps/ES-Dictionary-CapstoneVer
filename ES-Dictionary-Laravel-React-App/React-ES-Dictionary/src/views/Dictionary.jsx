import React, { useState } from "react";

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
    const UnsplashKey = "Fj2N2fNmwFAPuSC_agE73Mfy0Sv9bqtXS3XhGEcCWSY";
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
    if (!dictionaryData || dictionaryData.length <= itemsPerPage) return null;

    const totalPages = Math.ceil(dictionaryData.length / itemsPerPage);

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
    <div
      className="bg-gray-100 min-h-screen justify-center"
      style={{ paddingTop: "50px", paddingBottom: "50px" }}
    >
      <div className="mx-auto w-3/5 mb-4 flex justify-evenly">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="w-3/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={handleKeyPress}
        />

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </div>
      {dictionaryData && imageData && (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-4">
          <h1 className="text-3xl font-bold mb-4">{searchTermHeading}</h1>{" "}
          {/* Use the fixed search term heading */}
          <div className="mb-4">
            <img
              src={imageData}
              alt={searchTerm}
              className="w-full rounded object-cover"
              style={{ maxHeight: "300px", minHeight: "300px" }}
            />
          </div>
          <div
            className="flex flex-col"
            style={{ maxHeight: "220px", minHeight: "220px" }}
          >
            <div className="flex-1 overflow-y-auto">{renderDefinitions()}</div>
            <div className="mt-4">{renderPagination()}</div>
          </div>
        </div>
      )}
    </div>
  );
}
