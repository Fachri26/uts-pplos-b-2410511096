<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Complaint;

class Category extends Model
{
    protected $fillable = ['name'];

    public function complaints() {
        return $this->hasMany(Complaint::class);
    }
}