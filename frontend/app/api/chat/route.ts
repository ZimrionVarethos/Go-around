import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history = [], location } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Pesan tidak boleh kosong' },
        { status: 400 },
      );
    }

    // 1. Fetch Gemini API Key from Supabase settings table or fallback
    let apiKey: string | null = null;
    const { data: keyRecord } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'gemini_api_key')
      .maybeSingle();

    apiKey = keyRecord?.value || process.env.GEMINI_API_KEY || null;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'Layanan AI belum siap: Gemini API key belum dikonfigurasi di tabel settings.',
        },
        { status: 503 },
      );
    }

    // 2. Fetch all active cafes in Bogor for live context
    const { data: places, error: placesError } = await supabase
      .from('places')
      .select(
        'id, name, slug, address, subdistrict, latitude, longitude, wifi_speed_mbps, wifi_quality, plug_availability, noise_level, price_min_drink, price_max_drink, is_24_hours, open_time, close_time, google_rating, nugas_score',
      )
      .eq('status', 'active');

    if (placesError || !places) {
      console.error('Error fetching places for chatbot:', placesError);
    }

    // 3. If user location provided, attach distance to all places
    let placesList = (places || []).map((p: any) => {
      let distStr = '';
      if (
        location &&
        typeof location.latitude === 'number' &&
        typeof location.longitude === 'number'
      ) {
        const d = calculateDistanceKm(
          location.latitude,
          location.longitude,
          parseFloat(p.latitude),
          parseFloat(p.longitude),
        );
        distStr = `Jarak dari user: ${d} km | `;
      }

      return `- **${p.name}** (${p.subdistrict}): ${distStr}WiFi: ${p.wifi_speed_mbps || 30} Mbps (${p.wifi_quality || 'standar'}), Colokan: ${p.plug_availability || 'cukup'}, Suasana: ${p.noise_level || 'sedang'}, Rating: ⭐${p.google_rating || 4.5}, Harga Minuman: Rp${(p.price_min_drink || 15000).toLocaleString('id-ID')}, Jam: ${p.is_24_hours ? '24 Jam' : `${p.open_time || '08:00'} - ${p.close_time || '22:00'}`}, Skor Nugas: ${p.nugas_score || 80}/100. Alamat: ${p.address || p.subdistrict}`;
    });

    const userLocInfo =
      location &&
      typeof location.latitude === 'number' &&
      typeof location.longitude === 'number'
        ? `📍 Koordinat GPS Pengguna terdeteksi: Lintang ${location.latitude.toFixed(5)}, Bujur ${location.longitude.toFixed(5)}. Prioritaskan kafe dengan jarak km terdekat!`
        : `📍 Koordinat GPS Pengguna: Tidak aktif/belum diizinkan (berikan rekomendasi berdasarkan kriteria atau kecamatan Kota Bogor).`;

    // 4. Construct System Instruction with real Go-Around dataset
    const systemInstruction = `Kamu adalah "Kofi", Asisten AI SIG Cerdas dari Go-Around (WebGIS Direktori Kafe Nugas & Ramah Mahasiswa Kota Bogor).
Tugasmu adalah membantu mahasiswa dan pengunjung mencari tempat nugas, WFA, atau nongkrong terbaik di Kota Bogor berdasarkan kebutuhan spesifik mereka.

${userLocInfo}

Berikut ringkasan data 75 kafe terverifikasi di Kota Bogor:
${placesList.slice(0, 75).join('\n')}

Panduan Berbicara:
1. Bersahabat, ramah, solutif, gaya bahasa mahasiswa/anak muda santun namun informatif.
2. Format jawaban selalu menggunakan Markdown yang rapi:
   - Gunakan **teks tebal** untuk nama kafe.
   - Buat bullet points untuk kelebihan (kecepatan WiFi, colokan, ketenangan, harga).
   - Tampilkan info jam operasional dan perkiraan jarak jika GPS aktif.
3. Selalu rekomendasikan 2-4 kafe terbaik yang paling relevan dengan pertanyaan user.
4. Jawab dalam Bahasa Indonesia.`;

    // 5. Build contents array for Gemini
    const contents: any[] = [];

    // History turns
    for (const h of history) {
      if (h.role === 'user' || h.role === 'model') {
        contents.push({
          role: h.role === 'model' ? 'model' : 'user',
          parts: [{ text: h.content }],
        });
      }
    }

    // Current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    // 6. Call Google Gemini API (gemini-3.8-flash)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

    const geminiPayload = {
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    };

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geminiPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', response.status, errorText);
      return NextResponse.json(
        {
          error:
            'Maaf, layanan asisten AI sedang sibuk. Silakan coba lagi beberapa saat.',
        },
        { status: 502 },
      );
    }

    const data = await response.json();
    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Maaf, saya belum dapat merespons saat ini.';

    return NextResponse.json({
      reply: replyText,
      hasLocation: Boolean(location),
    });
  } catch (err: any) {
    console.error('Chatbot route exception:', err);
    return NextResponse.json(
      { error: err.message || 'Terjadi kesalahan sistem.' },
      { status: 500 },
    );
  }
}

