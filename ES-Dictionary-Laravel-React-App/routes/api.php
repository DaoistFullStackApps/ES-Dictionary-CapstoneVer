<?php

use App\Http\Controllers\DictionaryController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/words', [DictionaryController::class, 'index']);
Route::post('/words', [DictionaryController::class, 'store']);
Route::get('/words/{word}', [DictionaryController::class, 'show']);
Route::put('/words/{id}', [DictionaryController::class, 'update']);
Route::delete('/words/{id}', [DictionaryController::class, 'destroy']);

