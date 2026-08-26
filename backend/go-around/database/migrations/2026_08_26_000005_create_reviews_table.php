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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('place_id')->constrained('places')->cascadeOnDelete();
            $table->string('source')->default('google'); // google, twitter, instagram, user
            $table->string('reviewer_name')->nullable();
            $table->decimal('rating', 2, 1)->default(5.0);
            $table->text('comment');
            $table->string('extracted_keywords')->nullable(); // e.g. "colokan banyak, wifi lancar, es kopi susu murah"
            $table->enum('sentiment', ['positive', 'neutral', 'negative'])->default('positive');
            $table->timestamps();

            $table->index('place_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
