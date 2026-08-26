<?php

namespace App\Console\Commands;

use App\Models\Place;
use Illuminate\Console\Command;

class CalculateNugasScores extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'places:calculate-scores {--id= : Hitung hanya untuk spesifik place ID}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Kalkulasi skor agregat nugas, budget, dan fasilitas untuk coffee shop & working space';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $query = Place::query();

        if ($id = $this->option('id')) {
            $query->where('id', $id);
        }

        $places = $query->with('amenities')->get();
        $this->info("Menghitung skor untuk {$places->count()} tempat di Kota Bogor...");

        $bar = $this->output->createProgressBar($places->count());

        foreach ($places as $place) {
            // 1. Budget Score (0 - 100)
            $drinkPrice = $place->price_min_drink ?: 20000;
            if ($drinkPrice <= 10000) {
                $budgetScore = 98.0;
            } elseif ($drinkPrice <= 15000) {
                $budgetScore = 90.0;
            } elseif ($drinkPrice <= 20000) {
                $budgetScore = 80.0;
            } elseif ($drinkPrice <= 28000) {
                $budgetScore = 68.0;
            } else {
                $budgetScore = 50.0;
            }

            if ($place->has_student_discount) {
                $budgetScore = min(100.0, $budgetScore + 5.0);
            }
            if ($place->parking_fee_motor === 0) {
                $budgetScore = min(100.0, $budgetScore + 2.0);
            }

            // 2. Facility Score (0 - 100)
            $wifiScore = match(true) {
                $place->wifi_speed_mbps >= 75 => 100.0,
                $place->wifi_speed_mbps >= 40 => 85.0,
                $place->wifi_speed_mbps >= 20 => 70.0,
                $place->wifi_speed_mbps >= 10 => 50.0,
                default => 30.0,
            };

            $plugScore = match($place->plug_availability) {
                'abundant' => 100.0,
                'moderate' => 75.0,
                'limited' => 45.0,
                default => 15.0,
            };

            $noiseScore = match($place->noise_level) {
                'quiet' => 95.0,
                'moderate' => 80.0,
                'lively' => 55.0,
                default => 70.0,
            };

            $facilityScore = ($wifiScore * 0.40) + ($plugScore * 0.40) + ($noiseScore * 0.20);
            if ($place->is_24_hours) {
                $facilityScore = min(100.0, $facilityScore + 5.0);
            }

            // 3. Composite Nugas Score (0 - 100)
            $ratingScore = min(100.0, ($place->google_rating / 5.0) * 100);
            $nugasScore = ($budgetScore * 0.40) + ($facilityScore * 0.45) + ($ratingScore * 0.15);

            $place->update([
                'budget_score' => round($budgetScore, 1),
                'facility_score' => round($facilityScore, 1),
                'nugas_score' => round($nugasScore, 1),
            ]);

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Kalkulasi skor agregat nugas selesai!');

        return Command::SUCCESS;
    }
}
