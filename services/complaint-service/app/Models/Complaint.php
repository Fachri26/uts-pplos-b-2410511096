<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Category;
use App\Models\Status;
use App\Models\Rating;

class Complaint extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'category_id',
        'status_id'
    ];

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function status() {
        return $this->belongsTo(Status::class);
    }

    public function rating() {
        return $this->hasOne(Rating::class);
    }
}