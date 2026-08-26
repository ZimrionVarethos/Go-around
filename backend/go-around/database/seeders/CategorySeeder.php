<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Warkop Modern / Budget Spot',
                'slug' => 'warkop-modern',
                'icon' => 'coffee',
                'description' => 'Tempat nongkrong santai super hemat dengan colokan dan Wi-Fi bersahabat bagi kantong akhir bulan.',
            ],
            [
                'name' => 'Cozy Coffee Shop',
                'slug' => 'cozy-coffee-shop',
                'icon' => 'mug-hot',
                'description' => 'Cafe nyaman ber-AC dengan variasi kopi dan makanan, cocok untuk nugas solo maupun diskusi santai.',
            ],
            [
                'name' => 'Coworking & Study Space',
                'slug' => 'coworking-study-space',
                'icon' => 'laptop',
                'description' => 'Ruang kerja dan belajar khusus dengan internet super cepat, kursi ergonomis, dan suasana fokus hening.',
            ],
            [
                'name' => 'Library & Quiet Cafe',
                'slug' => 'library-quiet-cafe',
                'icon' => 'book-open',
                'description' => 'Cafe bernuansa tenang dan hening, sangat ideal untuk skripsi, baca buku, atau coding mendalam.',
            ],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}
