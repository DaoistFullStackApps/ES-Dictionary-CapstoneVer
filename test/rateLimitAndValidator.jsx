const handleSearch = async () => {
	clearSearchTerm();
	setIsLoading(true);

	try {
		// Validate the word field
		if (!searchTerm.trim()) {
			// Word is empty or contains only spaces, throw an error
			throw new Error("Please enter a word!");
		}

		// Make the API request to check the word
		const { data } = await axiosClient.post("/check", {
			word: searchTerm,
		});
		const response = { data };

		if (data.exists) {
			// Word exists, update the dictionary data and image
			const {
				word: { image_url, part_of_speech, definition, pronunciation },
			} = data;

			setDictionaryData({
				hwi: { hw: [pronunciation] },
				fl: [part_of_speech],
				shortdef: [definition],
			});

			setImageData(image_url);
		} else {
			// Word doesn't exist, handle the validation error
			throw new Error("The word was not found in the database!");
		}

		// Fetch additional data
		const payload = await fetchData();

		if (payload) {
			setDictionaryData({
				hwi: { hw: [payload.pronunciation] },
				fl: [payload.part_of_speech],
				shortdef: [payload.definition],
			});

			setImageData(payload.image_url);
		}

		console.log(searchTerm);
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
		// Handle the validation error
		handleValidationError(error.message);
	}

	setIsLoading(false);
};
