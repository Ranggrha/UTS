<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreChordRequest;
use App\Http\Requests\UpdateChordRequest;
use App\Http\Resources\ChordResource;
use App\Models\Chord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChordController extends Controller
{
    public function index()
    {
        $chords = Auth::guard('api')->user()->chords()->latest()->get();
        return ChordResource::collection($chords);
    }

    public function store(StoreChordRequest $request)
    {
        $chord = Auth::guard('api')->user()->chords()->create($request->validated());
        return new ChordResource($chord);
    }

    public function show(Chord $chord)
    {
        if ($chord->user_id !== Auth::guard('api')->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return new ChordResource($chord);
    }

    public function update(UpdateChordRequest $request, Chord $chord)
    {
        if ($chord->user_id !== Auth::guard('api')->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $chord->update($request->validated());
        return new ChordResource($chord);
    }

    public function destroy(Chord $chord)
    {
        if ($chord->user_id !== Auth::guard('api')->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $chord->delete();
        return response()->json(['message' => 'Chord deleted successfully']);
    }
}
