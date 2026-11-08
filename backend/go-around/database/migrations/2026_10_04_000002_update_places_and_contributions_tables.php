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
        Schema::table('places', function (Blueprint $table) {
            if (!Schema::hasColumn('places', 'code')) {
                $table->string('code', 20)->nullable()->after('id')->index();
            }
        });

        Schema::table('contributions', function (Blueprint $table) {
            if (!Schema::hasColumn('contributions', 'image_url')) {
                $table->string('image_url')->nullable()->after('status');
            }
            if (!Schema::hasColumn('contributions', 'category_name')) {
                $table->string('category_name')->nullable()->after('image_url');
            }
            if (!Schema::hasColumn('contributions', 'evidence_photos')) {
                $table->text('evidence_photos')->nullable()->after('category_name');
            }
            if (!Schema::hasColumn('contributions', 'code')) {
                $table->string('code', 20)->nullable()->after('id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('places', function (Blueprint $table) {
            if (Schema::hasColumn('places', 'code')) {
                $table->dropColumn('code');
            }
        });

        Schema::table('contributions', function (Blueprint $table) {
            if (Schema::hasColumn('contributions', 'image_url')) {
                $table->dropColumn('image_url');
            }
            if (Schema::hasColumn('contributions', 'category_name')) {
                $table->dropColumn('category_name');
            }
            if (Schema::hasColumn('contributions', 'evidence_photos')) {
                $table->dropColumn('evidence_photos');
            }
            if (Schema::hasColumn('contributions', 'code')) {
                $table->dropColumn('code');
            }
        });
    }
};
