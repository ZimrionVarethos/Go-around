<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\FacilityReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminTicketController extends Controller
{
    /**
     * Transform a FacilityReport model to AdminTicketItem
     */
    private function transformReport(FacilityReport $report): array
    {
        return [
            'id' => $report->ticket_code ?: 'TK-' . $report->id,
            'priority' => $report->priority ?: 'medium',
            'category' => $report->category ?: 'Laporan Fasilitas',
            'cafeName' => $report->cafe_name,
            'location' => $report->location ?: 'Kota Bogor',
            'timeAgo' => $report->created_at ? $report->created_at->diffForHumans() : 'Baru saja',
            'reportedBy' => $report->reported_by ?: 'Mahasiswa (Anonim)',
            'description' => $report->description,
            'status' => $report->status ?: 'open',
            'isUnread' => (bool) $report->is_unread,
            'internalNote' => $report->internal_note,
        ];
    }

    /**
     * List all facility tickets with filters
     */
    public function index(Request $request): JsonResponse
    {
        $query = FacilityReport::query();

        if ($request->filled('search')) {
            $kw = "%{$request->search}%";
            $query->where(function ($q) use ($kw) {
                $q->where('cafe_name', 'LIKE', $kw)
                  ->orWhere('description', 'LIKE', $kw)
                  ->orWhere('ticket_code', 'LIKE', $kw)
                  ->orWhere('location', 'LIKE', $kw);
            });
        }

        if ($request->filled('category')) {
            $query->where('category', 'LIKE', "%{$request->category}%");
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $reports = $query->orderBy('id', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $reports->map(fn ($r) => $this->transformReport($r))->values(),
        ]);
    }

    /**
     * Resolve a ticket with optional internal note
     */
    public function resolve(Request $request, $id): JsonResponse
    {
        $report = FacilityReport::where('ticket_code', $id)->orWhere('id', $id)->firstOrFail();
        $report->status = 'resolved';
        $report->is_unread = false;
        if ($request->filled('internal_note')) {
            $report->internal_note = $request->internal_note;
        }
        $report->save();

        return response()->json([
            'success' => true,
            'message' => 'Tiket berhasil ditandai selesai',
        ]);
    }

    /**
     * Dismiss a ticket
     */
    public function dismiss(Request $request, $id): JsonResponse
    {
        $report = FacilityReport::where('ticket_code', $id)->orWhere('id', $id)->firstOrFail();
        $report->status = 'dismissed';
        $report->is_unread = false;
        $report->save();

        return response()->json([
            'success' => true,
            'message' => 'Tiket berhasil diabaikan',
        ]);
    }
}
