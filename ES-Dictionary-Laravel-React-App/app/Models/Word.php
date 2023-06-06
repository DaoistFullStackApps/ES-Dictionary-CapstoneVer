<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Word extends Model
{
    use HasFactory;

    protected $fillable = [
        'word',
        'definition',
        'pronunciation',
        'part_of_speech',
        'image_url',
    ];

    // Additional model logic, relationships, etc.
}
