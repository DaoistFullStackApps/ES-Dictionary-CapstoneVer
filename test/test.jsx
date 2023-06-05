import React, { useRef, useState } from "react";
import axiosClient from "../axios-client.js";

// Component for the Dictionary functionality
export default function Dictionary() {
    // State variables
    const [searchTerm, setSearchTerm] = useState(""); // Input search term
    const [searchTermHeading, setSearchTermHeading] = useState(""); // Heading for the search term
    const [dictionaryData, setDictionaryData] = useState(null); // Dictionary data
    const [imageData, setImageData] = useState(null); // Image data
    const [currentPage, setCurrentPage] = useState(1); // Current page number
    const itemsPerPage = 1; // Number of items to display per page

    // References for DOM elements
    const wordRef = useRef(null);
    const definitionRef = useRef(null);
    const posRef = useRef(null);
    const imgURLRef = useRef(null);

    // Function to handle the search action
    const handleSearch = async () => {
        setSearchTermHeading(searchTerm); // Update the search term heading
        setSearchTerm(""); // Clear the search term input

        try {
            // Send a POST request to check if the word exists in the database
            const { data } = await axiosClient.post("/check", {
                word: searchTerm,
            });

            if (data.exists) {
                // If the word exists in the database, update the dictionary data and go to the first page
                console.log(`You have searched the word ${data.word}!`);
                setDictionaryData(data.dictionaryData);
                setCurrentPage(1);
                return;
            }

            // If the word is not found in the database, fetch image and dictionary data
            await Promise.all([fetchImage(), fetchDictionary()]);

            // Create the payload for storing the word in the database
            const payload = await createPayload();
            console.log(payload);

            // Send a POST request to store the word in the database
            axiosClient
                .post("/store", payload)
                .then(({ data }) => {
                    console.log(`You have searched the word ${data.word}!`);
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

    // Function to handle the "Enter" key press
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // Function to create the payload for storing the word in the database
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

    // Function to fetch the image data from the Unsplash API
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

    // Function to fetch the dictionary data from the Merriam-Webster API
    const fetchDictionary = async () => {
        const MerriamWebKey = "98a198a3-a200-490a-ad48-98ac95b46d80";
        const MerriamWebUrl = `https://dictionaryapi.com/api/v3/references/collegiate/json/${searchTerm}?key=${MerriamWebKey}`;

        try {
            const response = await fetch(MerriamWebUrl);
            const data = await response.json();
            setDictionaryData(data);
            setCurrentPage(1);
        } catch (error) {
            console.log("Error fetching dictionary data:", error);
        }
    };

    // Function to handle page changes
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Function to render the definitions
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
                        <span
                            className="bg-coffeeBrown text-black italic py-1 px-2 rounded mr-2"
                            ref={posRef}
                        >
                            {entry.fl}
                        </span>
                    )}
                </div>
                {entry.shortdef && entry.shortdef.length > 0 && (
                    <p ref={definitionRef}>{entry.shortdef[0]}</p>
                )}
            </div>
        ));
    };

    // Function to render the pagination
    const renderPagination = () => {
        if (!dictionaryData || dictionaryData.length <= itemsPerPage)
            return null;

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

    // JSX code for rendering the Dictionary component
    return (
        <div
            className="bg-coffee flex min-h-screen justify-center items-center"
            style={{ paddingTop: "50px", paddingBottom: "50px" }}
        >
            <div className="w-96">
                <h1 className="text-4xl font-bold text-center mb-6">
                    Dictionary
                </h1>
                <div className="flex items-center mb-6">
                    <input
                        type="text"
                        className="border border-gray-300 py-2 px-3 w-full rounded-l focus:outline-none focus:ring-2 focus:ring-coffeeBrown"
                        placeholder="Enter a word"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button
                        className="bg-coffeeBrown text-white py-2 px-4 rounded-r focus:outline-none focus:ring-2 focus:ring-coffeeBrown"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
                <h2 className="text-xl font-semibold text-center mb-4">
                    {searchTermHeading}
                </h2>
                {renderDefinitions()}
                {renderPagination()}
            </div>
        </div>
    );
}

// The `Dictionary` component is a functional React component that provides dictionary functionality.
// It allows users to search for a word and displays its definitions along with pagination.
// The component uses hooks to manage state variables and effect hooks for making API requests.
// It also includes event handlers for user interactions such as searching and pagination.
// The component structure is as follows:
// - State Variables:
//   - searchTerm: Stores the input search term.
//   - searchTermHeading: Stores the heading for the search term.
//   - dictionaryData: Stores the fetched dictionary data.
//   - imageData: Stores the fetched image data.
//   - currentPage: Stores the current page number.
//   - itemsPerPage: Defines the number of items to display per page.
// - Refs:
//   - wordRef: Reference for the word DOM element.
//   - definitionRef: Reference for the definition DOM element.
//   - posRef: Reference for the part of speech DOM element.
//   - imgURLRef: Reference for the image URL DOM element.
// - Event Handlers:
//   - handleSearch: Handles the search action.
//   - handleKeyPress: Handles the "Enter" key press event.
//   - createPayload: Creates the payload for storing the word in the database.
//   - fetchImage: Fetches the image data from the Unsplash API.
//   - fetchDictionary: Fetches the dictionary data from the Merriam-Webster API.
//   - handlePageChange: Handles page changes.
// - Rendering Functions:
//   - renderDefinitions: Renders the definitions based on the current page and items per page.
//   - renderPagination: Renders the pagination buttons.
// - JSX code: Renders the Dictionary component with its input field, search button, definitions, and pagination.
