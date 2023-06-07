<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\CheckRequest;
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
            'pronunciation' => $data['pronunciation'],
            'part_of_speech' => $data['part_of_speech'],
            'image_url' => $data['image_url'],
        ]);
        return response()->json([
            'word' => $word,
            'message' => $word->word . ' word was stored successfully!'
        ]);
    }

    public function check(CheckRequest $request)
    {
        // Validates the request
        $validatedData = $request->validated();

        $word = $validatedData['word'];

        // Check if the word exists in the database
        $wordExists = Word::where('word', $word)->first();

        $response = [
            'word' => $word,
            'exists' => $wordExists ? true : false,
            'message' => null,
        ];

        if ($wordExists) {
            $response['word'] = $wordExists;
            $response['message'] = $wordExists->word . ' was found in the database!';
        } else {
            $response['message'] = $word . ' was not found in the database!';
        }

        return response()->json($response);
    }

    // public function check(CheckRequest $request)
    // {   
    //     // Validates the request
    //     $validatedData = $request->validated();
    //     $word = $validatedData['word'];

    //     // Check if the word exists in the database
    //     $wordExists = Word::where('word', $word)->first();

    //     if ($wordExists) {
    //         // Word exists, return the word data
    //         return response()->json([
    //             'exists' => true,
    //             'word' => $wordExists,
    //             // 'message' => 'The word ' .  $word . ' was found in the database!'
    //         ]);
    //     } else {
    //         // Word doesn't exist, return a response indicating that
    //         return response()->json([
    //             'exists' => false,
    //             'message' => 'The word ' .  $word . ' was  not found in the database!'
    //         ]);
    //     }
    // }
}
