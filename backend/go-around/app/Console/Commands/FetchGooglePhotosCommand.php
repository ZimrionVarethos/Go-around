<?php

namespace App\Console\Commands;

use App\Models\Place;
use App\Services\CafeScraperService;
use Illuminate\Console\Command;

class FetchGooglePhotosCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cafes:google-photos 
                            {--force : Timpa foto yang sudah ada dengan pencarian baru} 
                            {--limit=0 : Batas jumlah kafe yang diproses (0 untuk semua)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ambil foto tempat asli dari Google Maps preview untuk kafe-kafe di Kota Bogor (jika tidak ada, dikosongkan null)';

    /**
     * Execute the console command.
     */
    public function handle(CafeScraperService $scraperService): int
    {
        $force = (bool) $this->option('force');
        $limit = (int) $this->option('limit');

        $query = Place::where('status', 'active');
        if (!$force) {
            // Hanya proses yang belum memiliki foto atau masih menggunakan foto unsplash
            $query->where(function ($q) {
                $q->whereNull('image_url')
                  ->orWhere('image_url', '')
                  ->orWhere('image_url', 'LIKE', '%unsplash%');
            });
        }

        if ($limit > 0) {
            $query->take($limit);
        }

        $places = $query->get();
        $total = $places->count();

        if ($total === 0) {
            $this->info("Semua kafe sudah memiliki foto Google atau tidak ada kafe yang perlu diproses.");
            return Command::SUCCESS;
        }

        $this->info("Memulai pengambilan foto Google Maps preview untuk {$total} kafe...");
        $this->info("Prinsip: Jika ada di Google -> gunakan URL foto asli; jika tidak ada -> dikosongkan (null).");
        $this->newLine();

        $updatedCount = 0;
        $emptyCount = 0;
        $summary = [];

        $bar = $this->output->createProgressBar($total);
        $bar->start();

        foreach ($places as $place) {
            $photoUrl = $scraperService->fetchGooglePhoto($place->name, $place->address);

            if ($photoUrl) {
                $place->update(['image_url' => $photoUrl]);
                $updatedCount++;
                $status = 'Foto Google Ditemukan';
            } else {
                // Sesuai permintaan user: jika tidak ada di Google, kosongkan saja (null)
                $place->update(['image_url' => null]);
                $emptyCount++;
                $status = 'Dikosongkan (null)';
            }

            if (count($summary) < 15) {
                $summary[] = [
                    'Nama Kafe' => $place->name,
                    'Wilayah' => $place->subdistrict,
                    'Status Foto' => $status,
                ];
            }

            $bar->advance();
            // Jeda singkat agar tidak terkena rate-limiting Google
            usleep(250000);
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("=== Ringkasan Pembaruan Foto Google ===");
        $this->line("Foto Google Ditemukan : <info>{$updatedCount}</info>");
        $this->line("Dikosongkan (Tanpa Foto): <comment>{$emptyCount}</comment>");
        $this->line("Total Diproses        : {$total}");

        if (!empty($summary)) {
            $this->newLine();
            $this->info("Sampel Status Foto Kafe:");
            $this->table(['Nama Kafe', 'Wilayah', 'Status Foto'], $summary);
        }

        $this->info("Selesai! Tampilan antarmuka otomatis menyesuaikan kafe yang memiliki foto maupun yang kosong.");
        return Command::SUCCESS;
    }
}
