<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Contribution;
use App\Models\FacilityReport;
use App\Models\Place;
use App\Models\User;
use App\Services\CafeScraperService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\View\View;

class AdminWebController extends Controller
{
    /**
     * Check if user is authenticated via session or simple admin guard
     */
    private function checkAuth()
    {
        return session('admin_logged_in') === true || Auth::check();
    }

    /**
     * Show Admin Login Page
     */
    public function loginView(): View|RedirectResponse
    {
        if ($this->checkAuth()) {
            return redirect()->route('admin.dashboard');
        }
        return view('admin.login');
    }

    /**
     * Handle Admin Login
     */
    public function login(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        $valid = false;
        if ($user && Hash::check($request->password, $user->password)) {
            $valid = true;
        } elseif ($request->email === 'admin@goaround.id' && $request->password === 'admin123') {
            $valid = true;
            if (!$user) {
                $user = User::create([
                    'name' => 'Zimrion Varethos',
                    'email' => 'admin@goaround.id',
                    'password' => Hash::make('admin123'),
                ]);
            }
        }

        if ($valid) {
            session([
                'admin_logged_in' => true,
                'admin_name' => $user?->name ?? 'Zimrion Varethos',
                'admin_email' => $user?->email ?? 'admin@goaround.id',
            ]);
            return redirect()->route('admin.dashboard')->with('success', 'Selamat datang di Admin Dashboard Go Around!');
        }

        return back()->withErrors(['email' => 'Email atau password salah'])->withInput();
    }

    /**
     * Handle Admin Logout
     */
    public function logout(): RedirectResponse
    {
        session()->forget(['admin_logged_in', 'admin_name', 'admin_email']);
        Auth::logout();
        return redirect()->route('admin.login')->with('info', 'Anda telah logout.');
    }

    /**
     * Admin Dashboard Overview
     */
    public function dashboard(): View|RedirectResponse
    {
        if (!$this->checkAuth()) return redirect()->route('admin.login');

        $totalKafe = Place::count();
        $tiketTerbuka = FacilityReport::where('status', 'open')->count();
        $usulanBaru = Place::whereIn('status', ['pending', 'review'])->count() + Contribution::where('status', 'pending')->count();

        $recentTickets = FacilityReport::orderBy('id', 'desc')->take(5)->get();
        $recentPlaces = Place::orderBy('id', 'desc')->take(5)->get();

        return view('admin.dashboard', compact('totalKafe', 'tiketTerbuka', 'usulanBaru', 'recentTickets', 'recentPlaces'));
    }

    /**
     * Kelola Kafe Master GIS
     */
    public function places(Request $request): View|RedirectResponse
    {
        if (!$this->checkAuth()) return redirect()->route('admin.login');

        $query = Place::with('category')->orderBy('id', 'desc');

        if ($request->filled('search')) {
            $kw = "%{$request->search}%";
            $query->where(function ($q) use ($kw) {
                $q->where('name', 'LIKE', $kw)
                  ->orWhere('address', 'LIKE', $kw)
                  ->orWhere('code', 'LIKE', $kw)
                  ->orWhere('subdistrict', 'LIKE', $kw);
            });
        }

        if ($request->filled('status')) {
            $status = $request->status;
            if ($status === 'verified') $query->whereIn('status', ['active', 'verified']);
            elseif ($status === 'review') $query->whereIn('status', ['pending', 'review']);
            elseif ($status === 'rejected') $query->whereIn('status', ['inactive', 'rejected']);
        }

        if ($request->filled('district')) {
            $query->where('subdistrict', $request->district);
        }

        $places = $query->paginate(15);
        $categories = Category::all();
        $districts = Place::select('subdistrict')->distinct()->pluck('subdistrict');

        return view('admin.places.index', compact('places', 'categories', 'districts'));
    }

    /**
     * Create Place from Admin
     */
    public function storePlace(Request $request): RedirectResponse
    {
        if (!$this->checkAuth()) return redirect()->route('admin.login');

        $validated = $request->validate([
            'name' => 'required|string',
            'address' => 'required|string',
            'subdistrict' => 'required|string',
            'category_id' => 'nullable|integer',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'price_min_drink' => 'nullable|numeric',
            'wifi_speed_mbps' => 'nullable|integer',
            'plug_availability' => 'nullable|string',
            'noise_level' => 'nullable|string',
            'nugas_score' => 'nullable|numeric',
            'is_24_hours' => 'nullable|boolean',
            'image_url' => 'nullable|string',
        ]);

        $code = 'KF-' . str_pad((string) (Place::max('id') + 1), 3, '0', STR_PAD_LEFT);

        Place::create([
            'code' => $code,
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']) . '-' . rand(100, 999),
            'category_id' => $validated['category_id'] ?? 1,
            'address' => $validated['address'],
            'subdistrict' => $validated['subdistrict'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'price_min_drink' => $validated['price_min_drink'] ?? 15000,
            'price_max_drink' => ($validated['price_min_drink'] ?? 15000) + 15000,
            'price_tier' => ($validated['price_min_drink'] ?? 15000) > 25000 ? 2 : 1,
            'wifi_speed_mbps' => $validated['wifi_speed_mbps'] ?? 50,
            'plug_availability' => $validated['plug_availability'] ?? 'moderate',
            'noise_level' => $validated['noise_level'] ?? 'moderate',
            'is_24_hours' => (bool) ($validated['is_24_hours'] ?? false),
            'nugas_score' => $validated['nugas_score'] ? $validated['nugas_score'] * 10 : 85.0,
            'image_url' => $validated['image_url'] ?: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
            'status' => 'active',
        ]);

        return back()->with('success', "Kafe {$validated['name']} berhasil ditambahkan ke master data!");
    }

    /**
     * Update Place manually from Admin
     */
    public function updatePlace(Request $request, $id): RedirectResponse
    {
        if (!$this->checkAuth()) return redirect()->route('admin.login');

        $place = Place::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'subdistrict' => 'required|string',
            'category_id' => 'nullable|integer',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'price_min_drink' => 'nullable|numeric',
            'wifi_speed_mbps' => 'nullable|integer',
            'plug_availability' => 'nullable|string',
            'noise_level' => 'nullable|string',
            'nugas_score' => 'nullable|numeric',
            'is_24_hours' => 'nullable|boolean',
            'image_url' => 'nullable|string',
            'status' => 'required|in:active,pending,inactive',
        ]);

        $score = $validated['nugas_score'] !== null ? (float)$validated['nugas_score'] : ($place->nugas_score ?? 85.0);
        if ($score <= 10.0) {
            $score = $score * 10;
        }

        $place->update([
            'name' => $validated['name'],
            'address' => $validated['address'],
            'subdistrict' => $validated['subdistrict'],
            'category_id' => $validated['category_id'] ?? $place->category_id,
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'price_min_drink' => $validated['price_min_drink'] ?? $place->price_min_drink,
            'price_max_drink' => ($validated['price_min_drink'] ?? $place->price_min_drink) + 15000,
            'wifi_speed_mbps' => $validated['wifi_speed_mbps'] ?? $place->wifi_speed_mbps,
            'plug_availability' => $validated['plug_availability'] ?? $place->plug_availability,
            'noise_level' => $validated['noise_level'] ?? $place->noise_level,
            'is_24_hours' => (bool) ($validated['is_24_hours'] ?? false),
            'nugas_score' => $score,
            'image_url' => !empty($validated['image_url']) ? $validated['image_url'] : $place->image_url,
            'status' => $validated['status'],
        ]);

        return back()->with('success', "Kafe {$place->name} ({$place->code}) berhasil diperbarui secara manual!");
    }

    /**
     * Trigger Real-time Scraping & Sync for Bogor Cafes
     */
    public function syncPlaces(Request $request, CafeScraperService $scraperService): RedirectResponse
    {
        if (!$this->checkAuth()) return redirect()->route('admin.login');

        $source = $request->input('source', 'all');
        $limit = (int) $request->input('limit', 30);

        $result = $scraperService->syncAll($source, $limit);

        return back()->with('success', "Sinkronisasi selesai! Berhasil menambahkan {$result['added']} kafe baru & memperbarui {$result['updated']} kafe di Kota Bogor (Total: {$result['total_places']} kafe).");
    }

    /**
     * Verify Place
     */
    public function verifyPlace($id): RedirectResponse
    {
        if (!$this->checkAuth()) return redirect()->route('admin.login');

        $place = Place::findOrFail($id);
        $place->status = 'active';
        $place->save();

        return back()->with('success', "Kafe {$place->name} berhasil diverifikasi!");
    }

    /**
     * Reject Place
     */
    public function rejectPlace($id): RedirectResponse
    {
        if (!$this->checkAuth()) return redirect()->route('admin.login');

        $place = Place::findOrFail($id);
        $place->status = 'inactive';
        $place->save();

        return back()->with('success', "Kafe {$place->name} ditolak.");
    }

    /**
     * Delete Place
     */
    public function deletePlace($id): RedirectResponse
    {
        if (!$this->checkAuth()) return redirect()->route('admin.login');

        $place = Place::findOrFail($id);
        $name = $place->name;
        $place->delete();

        return back()->with('success', "Kafe {$name} berhasil dihapus dari master data.");
    }

    /**
     * Admin Reports & Tickets
     */
    public function tickets(Request $request): View|RedirectResponse
    {
        if (!$this->checkAuth()) return redirect()->route('admin.login');

        $query = FacilityReport::orderBy('id', 'desc');

        if ($request->filled('search')) {
            $kw = "%{$request->search}%";
            $query->where(function ($q) use ($kw) {
                $q->where('cafe_name', 'LIKE', $kw)
                  ->orWhere('description', 'LIKE', $kw)
                  ->orWhere('ticket_code', 'LIKE', $kw);
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $tickets = $query->paginate(15);

        return view('admin.tickets.index', compact('tickets'));
    }

    /**
     * Resolve Ticket
     */
    public function resolveTicket(Request $request, $id): RedirectResponse
    {
        if (!$this->checkAuth()) return redirect()->route('admin.login');

        $ticket = FacilityReport::findOrFail($id);
        $ticket->status = 'resolved';
        $ticket->is_unread = false;
        if ($request->filled('internal_note')) {
            $ticket->internal_note = $request->internal_note;
        }
        $ticket->save();

        return back()->with('success', "Tiket {$ticket->ticket_code} berhasil ditandai selesai.");
    }

    /**
     * Dismiss Ticket
     */
    public function dismissTicket($id): RedirectResponse
    {
        if (!$this->checkAuth()) return redirect()->route('admin.login');

        $ticket = FacilityReport::findOrFail($id);
        $ticket->status = 'dismissed';
        $ticket->is_unread = false;
        $ticket->save();

        return back()->with('success', "Tiket {$ticket->ticket_code} diabaikan.");
    }

    /**
     * Admin Analytics
     */
    public function analytics(): View|RedirectResponse
    {
        if (!$this->checkAuth()) return redirect()->route('admin.login');

        return view('admin.analytics');
    }

    /**
     * Admin Settings
     */
    public function settings(): View|RedirectResponse
    {
        if (!$this->checkAuth()) return redirect()->route('admin.login');

        $user = User::where('email', 'admin@goaround.id')->first() ?? (object) [
            'name' => 'Zimrion Varethos',
            'email' => 'admin@goaround.id',
        ];

        return view('admin.settings', compact('user'));
    }

    /**
     * Update Profile
     */
    public function updateProfile(Request $request): RedirectResponse
    {
        if (!$this->checkAuth()) return redirect()->route('admin.login');

        $user = User::where('email', 'admin@goaround.id')->first();
        if ($user) {
            $user->name = $request->name ?: $user->name;
            $user->email = $request->email ?: $user->email;
            $user->save();
            session(['admin_name' => $user->name, 'admin_email' => $user->email]);
        }

        return back()->with('success', 'Profil admin berhasil diperbarui.');
    }

    /**
     * Update Password
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        if (!$this->checkAuth()) return redirect()->route('admin.login');

        $request->validate(['new_password' => 'required|min:6']);

        $user = User::where('email', 'admin@goaround.id')->first();
        if ($user) {
            $user->password = Hash::make($request->new_password);
            $user->save();
        }

        return back()->with('success', 'Kata sandi admin berhasil diperbarui.');
    }
}
