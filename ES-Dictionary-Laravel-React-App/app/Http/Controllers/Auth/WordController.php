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
            'message' => 'Word stored successfully.'
        ]);
    }
    
    public function check($word)
    {
        // Check if the word exists in the database
        $word = Word::where('word', $word)->first();

        if ($word) {
            // Word exists, create a payload and bundle it in a JSON response
            $payload = [
                'word' => $word,
                'message' => 'Word found in the database.'
            ];
        } else {
            // Word doesn't exist
            $payload = [
                'message' => 'Word not found in the database.'
            ];
        }

        return response()->json($payload);
    }



    public function update(UpdateRequest $request)
    {
        $credentials = $request->validated();
        if (!Auth::attempt($credentials)) {
            return response([
                'message' => 'Searched word does not exist, initiation fetchData() now...'
            ], 422);
            $word = Auth::word();
            $definitionData = $word->create();
        }
        return response([
            'message' => 'Searched word already exist, initiation localhost get() now...',
            compact('definitionData')
        ], 204);
    }
    public function destroy(Request $request)
    {
        /** @var Word $word */
        $word = $request->word();
        $word->definitionData()->delete();
        return response('word succesfully deleted', status: 204);
    }
}
