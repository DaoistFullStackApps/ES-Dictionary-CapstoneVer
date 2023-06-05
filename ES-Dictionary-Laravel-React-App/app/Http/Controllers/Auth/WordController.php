<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRequest;
use App\Http\Requests\UpdateRequest;
use App\Models\Word;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WordController extends Controller
{
    public function store(StoreRequest $request)
    {
        $data = $request->validated();
        $word = Word::create([
            'word' => $data['word'],
            'definition' => $data['definition'],
            'part_of_speech' => $data['part_of_speech'],
            'image_url' => $data['image_url'],
        ]);
        return response()->json([
            'word' => $word,
            'message' => $word->word . ' word was stored successfully!'
        ]);
    }

    public function check(Request $request)
    {
        $word = $request->input('word');

        // Check if the word exists in the database
        $wordExists = Word::where('word', $word)->first();

        if ($wordExists) {
            // Word exists, return the word data
            return response()->json([
                'exists' => true,
                'word' => $wordExists,
                // 'message' => 'The word ' .  $word . ' was found in the database!'
            ]);
        } else {
            // Word doesn't exist, return a response indicating that
            return response()->json([
                'exists' => false,
                'message' => 'The word ' .  $word . ' was  not found in the database!'
            ]);
        }
    }



}
