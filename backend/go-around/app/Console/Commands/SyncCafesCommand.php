<?php

namespace App\Console\Commands;

use App\Services\CafeScraperService;
use Illuminate\Console\Command;

class SyncCafesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cafes:sync 
                            {--source=all : Sumber sinkronisasi (all, osm, curated)} 
                            {--limit=50 : Batas jumlah data scraping dari Overpass API}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sinkronisasi dan scraping real-time data kafe Kota Bogor dari OpenStreetMap & kurasi spasial';

    /**
     * Execute the console command.
     */
    public function handle(CafeScraperService $scraperService): int
    {
        $source = (string) $this->option('source');
        $limit = (int) $this->option('limit');

        $this->info("Memulai sinkronisasi data kafe Kota Bogor (Sumber: {$source}, Limit: {$limit})...");

        $result = $scraperService->syncAll($source, $limit);

        $this->newLine();
        $this->info("=== Hasil Sinkronisasi Kafe ===");
        $this->line("Kafe Baru Ditambahkan : <info>{$result['added']}</info>");
        $this->line("Kafe Diperbarui       : <comment>{$result['updated']}</comment>");
        $this->line("Kafe Sudah Ada/Skip   : {$result['skipped']}");
        $this->line("Total Kafe di Master  : <info>{$result['total_places']}</info>");

        if (!empty($result['samples'])) {
            $this->newLine();
            $this->info("Contoh Kafe yang Baru Ditambahkan:");
            $this->table(['Kode', 'Nama Kafe', 'Wilayah'], $result['samples']);
        }

        $this->info("Sinkronisasi selesai dengan sukses!");
        return Command::SUCCESS;
    }
}
