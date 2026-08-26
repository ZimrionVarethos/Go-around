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
        Schema::create('contributions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('address');
            $table->string('subdistrict');
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->unsignedInteger('price_min_drink')->nullable();
            $table->unsignedSmallInteger('wifi_speed_mbps')->nullable();
            $table->enum('plug_availability', ['none', 'limited', 'moderate', 'abundant'])->default('moderate');
            $table->enum('noise_level', ['quiet', 'moderate', 'lively'])->default('moderate');
            $table->boolean('is_24_hours')->default(false);
            $table->text('notes')->nullable();
            $table->string('submitter_name')->nullable();
            $table->string('submitter_email')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contributions');
    }
};
