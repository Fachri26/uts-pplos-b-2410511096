<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rating;

class RatingController extends Controller
{
    public function store(Request $request, $complaint_id)
    {
        $request->validate([
            'rating' => 'required|min:1|max:5'
        ]);

        $rating = Rating::create([
            'complaint_id' => $complaint_id,
            'rating' => $request->rating,
            'feedback' => $request->feedback
        ]);

        return response()->json($rating, 201);
    }
}