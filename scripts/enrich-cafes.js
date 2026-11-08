const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://xtcozobptgwetdnvqedp.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'sb_publishable_Lz-KGUMtaP6ROODL2TbP1g_hspSwPFq'
);

// Curated high-res authentic cafe photography mapped by cafe name or style
const CAFE_PHOTOS = {
  'Daily Brew & Coworking Hub': 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&auto=format&fit=crop&q=80',
  'Bumi Aki Space & Study Lounge': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
  'Raindear Coffee & Kitchen Baranangsiang': 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&auto=format&fit=crop&q=80',
  'Warkop Modern Margajaya 24 Jam': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
  'Popolo Coffee Taman Kencana': 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&auto=format&fit=crop&q=80',
  'Coffee Toffee Pajajaran 24 Jam': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80',
  'Kopi Daong Heritage Space Batutulis': 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&auto=format&fit=crop&q=80',
  'Warkop Modern Yasmin Corner': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
  'Kopi Baru - Vokasi IPB (Jl. Lodaya)': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
  'Point Coffee - Indomaret Fresh Kumbang Vokasi': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
  'Tomoro Coffee - Pajajaran Vokasi': 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop&q=80',
  'Kopi Janji Jiwa - Jilid 188 Lodaya Vokasi': 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&auto=format&fit=crop&q=80',
  'Warkop Berkah Nusantara 24 Jam': 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=80',
  'Third Wave Coffee & Creative Lab': 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=800&auto=format&fit=crop&q=80',
  'Code & Coffee Worklab Tanah Sareal': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80',
  'Maraca Books and Coffee': 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80',
  'Uncle Jo X Bar Babakan': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
  'Dimitree Coffee & Eatery Pangrango': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
  'Baked & Brewed Coffee Taman Kencana': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80',
  'Titik Temu Coffee Bogor': 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&auto=format&fit=crop&q=80',
  'Kemenady Coffee & Coworking': 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&auto=format&fit=crop&q=80',
  'Cohere Coffee Ciwaringin': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
  'Starbucks Reserve Bogor': 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&auto=format&fit=crop&q=80',
  'Tanamera Coffee & Roastery Bogor': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
  'Filosofi Kopi Bogor': 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=800&auto=format&fit=crop&q=80',
  'Kopi Toko Djawa Bogor': 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop&q=80',
  'Korte Chocolate & Craft Suryakencana': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
  'Kopi Kenangan - Stasiun Bogor': 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&auto=format&fit=crop&q=80',
  'Fore Coffee - Botani Square': 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=800&auto=format&fit=crop&q=80',
  'Kopi Kenangan - Lippo Plaza Ekalokasari': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
  'Raindear Coffee & Kitchen Bina Marga': 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&auto=format&fit=crop&q=80',
  'Awal Mula Coffee': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
  'Two Stories': 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&auto=format&fit=crop&q=80',
  'Tanmu Coffee Pajajaran': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80',
  'Anomali Coffee Bogor': 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&auto=format&fit=crop&q=80',
  'Tomoro Coffee - Pajajaran Sukasari': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
  'Point Coffee - Indomaret Hybrid Pajajaran': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
  'Warkop Modern Sukasari 24 Jam': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
  'Kopi Kenangan - Pandu Raya': 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop&q=80',
  'Kolaborato Coworking & Coffee': 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&auto=format&fit=crop&q=80',
  'Daily Brew Coffee Bangbarung': 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&auto=format&fit=crop&q=80',
  'Imah Nini Coffee Bangbarung': 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=800&auto=format&fit=crop&q=80',
  'Foresthree Coffee Adnawijaya': 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=80',
  'Fore Coffee - Pajajaran': 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=800&auto=format&fit=crop&q=80',
  'Starbucks Coffee - Pajajaran': 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&auto=format&fit=crop&q=80',
  'Tomoro Coffee - Bangbarung Raya': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
  'Kopi Janji Jiwa - Jilid 248 Pandu Raya': 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&auto=format&fit=crop&q=80',
  'Raindear Coffee Pandu Raya': 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&auto=format&fit=crop&q=80',
  'Miru Coffee Pandu Raya': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
  'Lemongrass Resto & Cafe': 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&auto=format&fit=crop&q=80',
  'Warkop Modern Pandu Raya 24 Jam': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
  'Kopi Nako - Rumah Sangrai Kebon Pedes': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
  'Warkop Berkah Air Mancur 24 Jam': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
  'Point Coffee - Indomaret Fresh Sholeh Iskandar': 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop&q=80',
  'Fore Coffee - Sholeh Iskandar': 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=800&auto=format&fit=crop&q=80',
  'Kopi Kenangan - Ruko Taman Yasmin': 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&auto=format&fit=crop&q=80',
  'Tomoro Coffee - Taman Yasmin': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
  'Point Coffee - Indomaret Fresh Sindangbarang': 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop&q=80',
  'Popolo Coffee Lolongok': 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&auto=format&fit=crop&q=80',
  'Foresthree Coffee Cipaku': 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=80',
  'Kedai Kopi Liong Bulan Batutulis': 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=800&auto=format&fit=crop&q=80',
  'Coffee Time Bondongan': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80',
  'Futura Cafe': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
  'Harinny Resto & Cafe': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'
};

async function run() {
  const { data: places, error } = await supabase.from('places').select('id, name, image_url, google_maps_url');
  if (error) {
    console.error('Error fetching places:', error);
    return;
  }

  console.log(`Checking ${places.length} places for enrichment...`);

  let updated = 0;
  for (const p of places) {
    const photo = CAFE_PHOTOS[p.name] || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80';
    const gMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.name + ', Kota Bogor')}`;

    const updatePayload = {
      google_maps_url: gMapsUrl,
    };

    if (!p.image_url || p.image_url.trim() === '') {
      updatePayload.image_url = photo;
    }

    const { error: updErr } = await supabase
      .from('places')
      .update(updatePayload)
      .eq('id', p.id);

    if (updErr) {
      console.error(`Failed to update ${p.name}:`, updErr);
    } else {
      updated++;
    }
  }

  console.log(`Successfully enriched ${updated} places in Supabase!`);
}

run();

