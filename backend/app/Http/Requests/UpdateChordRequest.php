<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateChordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'artist' => 'sometimes|required|string|max:255',
            'chords_lyrics' => 'sometimes|required|string',
        ];
    }
}
