<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Complaint;

class Rating extends Model
{
    protected $fillable = [
        'complaint_id',
        'rating',
        'feedback'
    ];

    public function complaint() {
        return $this->belongsTo(Complaint::class);
    }
}