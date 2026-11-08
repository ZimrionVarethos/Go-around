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
        Schema::create('facility_reports', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_code')->unique(); // e.g. TK-802
            $table->foreignId('place_id')->nullable()->constrained('places')->nullOnDelete();
            $table->string('cafe_name');
            $table->string('location')->nullable();
            $table->string('category'); // e.g. colokan_rusak, wifi_lambat
            $table->string('reported_by')->default('Mahasiswa (Anonim)');
            $table->text('description');
            $table->string('priority')->default('medium'); // high, medium, suggestion, low
            $table->string('status')->default('open'); // open, resolved, dismissed
            $table->boolean('is_unread')->default(true);
            $table->text('internal_note')->nullable();
            $table->string('time_option')->nullable(); // hari_ini, kemarin, pekan_ini, lebih_7_hari
            $table->text('evidence_colokan')->nullable(); // Base64 or URL
            $table->text('evidence_speedtest')->nullable(); // Base64 or URL
            $table->text('evidence_menu')->nullable(); // Base64 or URL
            $table->timestamps();

            $table->index('status');
            $table->index('priority');
            $table->index('ticket_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facility_reports');
    }
};
