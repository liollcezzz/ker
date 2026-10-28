<?php

namespace App\Http\Controllers\Seeker;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function index()
    {
        $documents = Auth::user()->documents()->latest()->get();
        return view('seeker.documents.index', compact('documents'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:resume,cover_letter,portfolio,certificate',
            'file' => 'required|file|mimes:pdf,doc,docx|max:5120', // Max 5MB
            'is_primary' => 'nullable|boolean',
        ]);

        $file = $request->file('file');
        $fileName = time() . '_' . $file->getClientOriginalName();
        // Simpan ke disk lokal privat (bukan folder public!)
        $filePath = $file->storeAs('private_documents/' . Auth::id(), $fileName, 'local');

        $isPrimary = $request->boolean('is_primary');
        if ($isPrimary) {
            Auth::user()->documents()->update(['is_primary_resume' => false]);
        }

        Auth::user()->documents()->create([
            'title' => $request->title,
            'type' => $request->type,
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $filePath,
            'file_size_kb' => round($file->getSize() / 1024),
            'is_primary_resume' => $isPrimary,
        ]);

        return redirect()->back()->with('success', 'Dokumen berhasil diunggah secara aman.');
    }

    public function setPrimary(int $id)
    {
        $document = Auth::user()->documents()->findOrFail($id);

        Auth::user()->documents()->where('type', 'resume')->update(['is_primary_resume' => false]);
        $document->update(['is_primary_resume' => true]);

        return redirect()->back()->with('success', 'CV Utama berhasil diperbarui.');
    }

    public function download(int $id)
    {
        $document = Auth::user()->documents()->findOrFail($id);

        if (!Storage::disk('local')->exists($document->file_path)) {
            abort(404, 'Berkas dokumen tidak ditemukan di storage server.');
        }

        return Storage::disk('local')->download($document->file_path, $document->file_name);
    }

    public function destroy(int $id)
    {
        $document = Auth::user()->documents()->findOrFail($id);

        Storage::disk('local')->delete($document->file_path);
        $document->delete();

        return redirect()->back()->with('success', 'Dokumen telah dihapus.');
    }
}
