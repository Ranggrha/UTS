<?php

namespace App\Http\Controllers;

use App\Models\Chord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChordController extends Controller
{
    /**
     * Create a new ChordController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $chords = auth('api')->user()->chords()->latest()->get();
        return response()->json($chords);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'artist' => 'required|string|max:255',
            'chords_lyrics' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $chord = auth('api')->user()->chords()->create($request->all());

        return response()->json($chord, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $chord = auth('api')->user()->chords()->find($id);

        if (!$chord) {
            return response()->json(['message' => 'Chord not found'], 404);
        }

        return response()->json($chord);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $chord = auth('api')->user()->chords()->find($id);

        if (!$chord) {
            return response()->json(['message' => 'Chord not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'artist' => 'sometimes|required|string|max:255',
            'chords_lyrics' => 'sometimes|required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $chord->update($request->all());

        return response()->json($chord);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $chord = auth('api')->user()->chords()->find($id);

        if (!$chord) {
            return response()->json(['message' => 'Chord not found'], 404);
        }

        $chord->delete();

        return response()->json(['message' => 'Chord deleted successfully']);
    }
}
