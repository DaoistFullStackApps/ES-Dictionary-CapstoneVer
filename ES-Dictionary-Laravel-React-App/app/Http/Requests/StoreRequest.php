<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'word' => 'required|string|max:12|unique:words,word',
            'pronunciation' => 'required|string',
            'definition' => 'required|string|max:400',
            'part_of_speech'=> 'required|string',
            'image_url' => 'required|url|unique:words,image_url',
        ];
    }
}
