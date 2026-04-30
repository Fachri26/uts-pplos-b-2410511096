<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    // LIST + PAGINATION + FILTER
    public function index(Request $request)
    {
        $query = Complaint::with(['category', 'status', 'rating']);

        if ($request->has('category')) {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('name', $request->category);
            });
        }

        $perPage = $request->get('per_page', 10);

        return response()->json(
            $query->paginate($perPage)
        );
    }

    // CREATE
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required',
            'title' => 'required',
            'description' => 'required',
            'category_id' => 'required',
            'status_id' => 'required'
        ]);

        $complaint = Complaint::create($request->all());

        return response()->json($complaint, 201);
    }

    // DETAIL
    public function show($id)
    {
        $complaint = Complaint::with(['category','status','rating'])->find($id);

        if (!$complaint) {
            return response()->json(['message'=>'Not found'], 404);
        }

        return response()->json($complaint);
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $complaint = Complaint::find($id);

        if (!$complaint) {
            return response()->json(['message'=>'Not found'], 404);
        }

        $complaint->update($request->all());

        return response()->json($complaint);
    }

    // DELETE
    public function destroy($id)
    {
        $complaint = Complaint::find($id);

        if (!$complaint) {
            return response()->json(['message'=>'Not found'], 404);
        }

        $complaint->delete();

        return response()->json(null, 204);
    }
}
