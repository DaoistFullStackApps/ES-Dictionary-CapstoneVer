<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class CheckRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'word' => [
                'required',
                'string',
                'max:12',
                'regex:/^[a-zA-Z]+$/',
            ],
        ];
    }

    public function messages()
    {
        return [
            'word.required' => 'Please enter a word!',
            'word.string' => 'Please enter a valid word!',
            'word.max' => 'Please dont enter a sentence!',
            'word.regex' => 'Please enter a valid word!',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $response = [
            'word' => $this->input('word'),
            'exists' => null,
            'message' => $validator->errors()->first(),
        ];

        throw new HttpResponseException(response()->json($response, 422));
    }
}
