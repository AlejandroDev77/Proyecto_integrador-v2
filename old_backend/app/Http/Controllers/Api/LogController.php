<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Logs;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class LogController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 20);
        
        // Retorna logs paginados ordenados por fecha de creación descendente
        return Logs::orderBy('created_at', 'desc')->paginate($perPage);
    }
    

    

    public function show($id)
    {
        return logs::with('Log')->findOrFail($id);
    }

 
}
