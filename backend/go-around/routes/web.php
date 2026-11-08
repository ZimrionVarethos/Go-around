<?php

use App\Http\Controllers\Web\AdminWebController;
use App\Http\Controllers\Web\ContributionWebController;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\ReportWebController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes (Go Around Bogor - Monolith Architecture)
|--------------------------------------------------------------------------
|
| All frontend views are rendered directly through Laravel Blade templates.
| The entire application runs on a single port via `php artisan serve`.
|
*/

// ── Public WebGIS Frontend Routes ──
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/tentang-riset', [HomeController::class, 'about'])->name('about');

Route::get('/lapor-fasilitas', [ReportWebController::class, 'create'])->name('reports.create');
Route::post('/lapor-fasilitas', [ReportWebController::class, 'store'])->name('reports.store');

Route::get('/tambah-tempat', [ContributionWebController::class, 'create'])->name('contributions.create');
Route::post('/tambah-tempat', [ContributionWebController::class, 'store'])->name('contributions.store');

// ── Admin Portal Routes ──
Route::prefix('admin')->name('admin.')->group(function () {
    // Auth
    Route::get('/login', [AdminWebController::class, 'loginView'])->name('login');
    Route::post('/login', [AdminWebController::class, 'login'])->name('login.post');
    Route::post('/logout', [AdminWebController::class, 'logout'])->name('logout');

    // Dashboard
    Route::get('/', [AdminWebController::class, 'dashboard'])->name('dashboard');

    // Places CRUD, moderation & real-time sync
    Route::get('/places', [AdminWebController::class, 'places'])->name('places');
    Route::post('/places', [AdminWebController::class, 'storePlace'])->name('places.store');
    Route::post('/places/sync', [AdminWebController::class, 'syncPlaces'])->name('places.sync');
    Route::match(['post', 'put'], '/places/{id}', [AdminWebController::class, 'updatePlace'])->name('places.update');
    Route::post('/places/{id}/verify', [AdminWebController::class, 'verifyPlace'])->name('places.verify');
    Route::post('/places/{id}/reject', [AdminWebController::class, 'rejectPlace'])->name('places.reject');
    Route::delete('/places/{id}', [AdminWebController::class, 'deletePlace'])->name('places.delete');

    // Tickets & Reports moderation
    Route::get('/reports', [AdminWebController::class, 'tickets'])->name('reports');
    Route::post('/reports/{id}/resolve', [AdminWebController::class, 'resolveTicket'])->name('reports.resolve');
    Route::post('/reports/{id}/dismiss', [AdminWebController::class, 'dismissTicket'])->name('reports.dismiss');

    // Analytics & Spatial Insights
    Route::get('/analytics', [AdminWebController::class, 'analytics'])->name('analytics');

    // Settings
    Route::get('/settings', [AdminWebController::class, 'settings'])->name('settings');
    Route::post('/settings/profile', [AdminWebController::class, 'updateProfile'])->name('settings.profile');
    Route::post('/settings/password', [AdminWebController::class, 'updatePassword'])->name('settings.password');
});
