<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('places', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('address');
            $table->string('subdistrict'); // Bogor Tengah, Bogor Timur, Bogor Utara, Bogor Selatan, Bogor Barat, Tanah Sareal
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->string('google_maps_url')->nullable();
            $table->string('instagram_handle')->nullable();
            
            // Economical (Ramah Kantong)
            $table->unsignedInteger('price_min_drink')->default(10000);
            $table->unsignedInteger('price_max_drink')->default(25000);
            $table->unsignedInteger('price_avg_food')->default(20000);
            $table->tinyInteger('price_tier')->default(1); // 1: Budget/Hemat, 2: Standard/Sedang, 3: Premium/Coworking
            $table->unsignedInteger('parking_fee_motor')->default(2000);
            $table->boolean('has_student_discount')->default(false);

            // Workspace & Nugas Amenities
            $table->unsignedSmallInteger('wifi_speed_mbps')->default(20);
            $table->enum('wifi_quality', ['low', 'medium', 'fast', 'ultra'])->default('medium');
            $table->enum('plug_availability', ['none', 'limited', 'moderate', 'abundant'])->default('moderate'); // Colokan
            $table->enum('noise_level', ['quiet', 'moderate', 'lively'])->default('moderate'); // Kebisingan
            $table->boolean('is_24_hours')->default(false);
            $table->time('open_time')->nullable();
            $table->time('close_time')->nullable();

            // Ratings & Scoring
            $table->decimal('google_rating', 3, 2)->default(4.00);
            $table->unsignedInteger('total_google_reviews')->default(0);
            $table->decimal('nugas_score', 4, 1)->default(75.0); // 0 - 100
            $table->decimal('budget_score', 4, 1)->default(75.0); // 0 - 100
            $table->decimal('facility_score', 4, 1)->default(75.0); // 0 - 100
            
            // Media & Description
            $table->string('image_url')->nullable();
            $table->text('description')->nullable();
            $table->string('vibe_tags')->nullable(); // e.g. "Minimalis, Adem, Banyak Colokan, Outdoor Estetik"
            
            // Operational Status
            $table->enum('status', ['active', 'pending', 'inactive'])->default('active');
            $table->timestamps();

            // Indexes for fast spatial & filter lookup
            $table->index(['latitude', 'longitude']);
            $table->index('subdistrict');
            $table->index('price_tier');
            $table->index('nugas_score');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('places');
    }
};
