<?php

namespace App\Http\Controllers;

use App\Models\Word;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class DictionaryController extends Controller
{
    public function index()
    {
        $words = Word::all();
        return response()->json($words);
    }

    public function store(Request $request)
    {
        $searchTerm = $request->input('searchTerm');

        // Check if the word already exists in the Word model
        $existingWord = Word::where('word', $searchTerm)->first();

        if ($existingWord) {
            // Word already exists, fetch its data
            $data = [
                'word' => $existingWord->word,
                'definition' => $existingWord->definition,
                'part_of_speech' => $existingWord->part_of_speech,
                'image_url' => $existingWord->image_url,
            ];
        } else {
            // Word does not exist, fetch data from external APIs
            $data = $this->fetchDataFromAPIs($searchTerm);

            // Save the new word to the database
            $newWord = new Word();
            $newWord->word = $searchTerm;
            $newWord->definition = $data['definition'];
            $newWord->part_of_speech = $data['part_of_speech'];
            $newWord->image_url = $data['image_url'];
            $newWord->save();
        }

        return response()->json($data, 200);
    }

    private function fetchDataFromAPIs($searchTerm)
    {
        // Fetch data from the Merriam-Webster API
        $merriamWebsterKey = "98a198a3-a200-490a-ad48-98ac95b46d80";
        $merriamWebsterUrl = "https://dictionaryapi.com/api/v3/references/collegiate/json/{$searchTerm}?key={$merriamWebsterKey}";
        $merriamWebsterResponse = Http::get($merriamWebsterUrl);
        $merriamWebsterData = $merriamWebsterResponse->json();

        // Extract the definition and part of speech from the Merriam-Webster response
        $definition = $merriamWebsterData[0]['shortdef'][0] ?? null;
        $partOfSpeech = $merriamWebsterData[0]['fl'] ?? null;

        // Fetch data from the Unsplash API
        $unsplashKey = "gVfJPtlmzZ4XoaVB4p5SdGe0ILjssdLMcDqR3FH5gn0";
        $unsplashUrl = "https://api.unsplash.com/photos/random?query={$searchTerm}&client_id={$unsplashKey}";
        $unsplashResponse = Http::get($unsplashUrl);
        $unsplashData = $unsplashResponse->json();

        // Extract the image URL from the Unsplash response
        $imageUrl = $unsplashData['urls']['regular'] ?? null;

        // Prepare the data to be returned
        $data = [
            'word' => $searchTerm,
            'definition' => $definition,
            'part_of_speech' => $partOfSpeech,
            'image_url' => $imageUrl,
        ];

        return $data;
    }


    public function show($word)
    {
        $existingWord = Word::where('word', $word)->first();

        if ($existingWord) {
            return response()->json($existingWord);
        }

        // If the word doesn't exist in the database, you can handle it accordingly
        return response()->json(['error' => 'Word not found'], 404);
    }

    public function update(Request $request, $id)
    {
        $word = Word::findOrFail($id);

        $data = $request->validate([
            'word' => 'required|unique:words,word,' . $id,
            'definition' => 'required',
            'part_of_speech' => 'required',
            'image_url' => 'nullable|url',
        ]);

        $word->update($data);
        return response()->json($word);
    }

    public function destroy($id)
    {
        $word = Word::findOrFail($id);
        $word->delete();
        return response()->json(null, 204);
    }
}
