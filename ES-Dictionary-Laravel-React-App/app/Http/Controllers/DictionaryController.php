<?php

namespace App\Http\Controllers;

use App\Models\Word;
use Illuminate\Http\Request;

class DictionaryController extends Controller
{
    public function index()
    {
        $words = Word::all();
        return response()->json($words);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'word' => 'required|unique:words',
            'definition' => 'required',
            'part_of_speech' => 'required',
            'image_url' => 'nullable|url',
        ]);

        $word = Word::create($data);
        return response()->json($word, 201);
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
