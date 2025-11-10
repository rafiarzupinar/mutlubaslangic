import { v4 as uuidv4 } from 'uuid';

export const mockVenues = [
  {
    id: uuidv4(),
    name: 'Çırağan Sarayı Ballroom',
    description: 'Boğaz manzaralı tarihi saray, lüks düğün organizasyonları için ideal.',
    location: { city: 'İstanbul', district: 'Beşiktaş', address: 'Çırağan Cad. No:32' },
    capacity: { min: 200, max: 600 },
    pricePerPerson: 850,
    venueType: 'hotel',
    features: ['Boğaz Manzarası', 'Valet', 'Konaklama', 'Açık Alan', 'İç Mekan'],
    images: ['https://images.unsplash.com/photo-1519167758481-83f29da8c3e4?w=800'],
    rating: 4.9,
    reviewCount: 156
  },
  {
    id: uuidv4(),
    name: 'Esma Sultan Yalısı',
    description: 'Boğaz kıyısında, tarihi yalı düğün mekanı.',
    location: { city: 'İstanbul', district: 'Ortaköy', address: 'Mecidiye Köprüsü Altı' },
    capacity: { min: 150, max: 400 },
    pricePerPerson: 950,
    venueType: 'outdoor',
    features: ['Boğaz Manzarası', 'Açık Alan', 'Tarihi Mekan', 'DJ'],
    images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'],
    rating: 4.8,
    reviewCount: 98
  },
  {
    id: uuidv4(),
    name: 'Ankara Sheraton',
    description: 'Ankara\'nın kalbinde modern ve şık düğün salonları.',
    location: { city: 'Ankara', district: 'Çankaya', address: 'Atatürk Bulvarı' },
    capacity: { min: 300, max: 800 },
    pricePerPerson: 650,
    venueType: 'hotel',
    features: ['İç Mekan', 'Otopark', 'Konaklama', 'Profesyonel Ekip'],
    images: ['https://images.unsplash.com/photo-1511578194003-00c80e42dc9b?w=800'],
    rating: 4.7,
    reviewCount: 134
  },
  {
    id: uuidv4(),
    name: 'İzmir Hilton Bahçesi',
    description: 'Deniz manzaralı bahçe düğünleri için mükemmel.',
    location: { city: 'İzmir', district: 'Alsancak', address: 'Gazi Osman Paşa Bulvarı' },
    capacity: { min: 200, max: 500 },
    pricePerPerson: 600,
    venueType: 'garden',
    features: ['Deniz Manzarası', 'Bahçe', 'İç Mekan Seçeneği', 'Otopark'],
    images: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=800'],
    rating: 4.6,
    reviewCount: 87
  },
  {
    id: uuidv4(),
    name: 'Polonezköy Doğa Restaurant',
    description: 'Doğa içinde, rustik düğün mekanı.',
    location: { city: 'İstanbul', district: 'Beykoz', address: 'Polonezköy Mahallesi' },
    capacity: { min: 100, max: 300 },
    pricePerPerson: 450,
    venueType: 'garden',
    features: ['Doğa', 'Bahçe', 'Mangal', 'Çocuk Oyun Alanı'],
    images: ['https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800'],
    rating: 4.5,
    reviewCount: 72
  },
  {
    id: uuidv4(),
    name: 'Sapphire Düğün Salonu',
    description: 'İstanbul\'un zirvesinde, panoramik şehir manzarası.',
    location: { city: 'İstanbul', district: 'Levent', address: 'Sapphire Tower' },
    capacity: { min: 250, max: 700 },
    pricePerPerson: 800,
    venueType: 'indoor',
    features: ['Şehir Manzarası', 'Modern Tasarım', 'Otopark', 'Profesyonel Teknik Ekip'],
    images: ['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800'],
    rating: 4.8,
    reviewCount: 112
  }
];

export const mockSuppliers = [
  {
    id: uuidv4(),
    businessName: 'Elif Fotoğraf Stüdyosu',
    ownerName: 'Elif Yılmaz',
    category: 'photography',
    description: 'Profesyonel düğün fotoğrafçılığı, 10 yıllık deneyim. Her anınızı sanata dönüştürüyoruz.',
    services: ['Fotoğraf', 'Video Çekimi', 'Drone Çekim', 'Albüm'],
    location: { city: 'İstanbul', district: 'Kadıköy' },
    priceRange: { min: 8000, max: 25000 },
    contact: { phone: '+90 555 123 4567', email: 'elif@fotograf.com' },
    images: ['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800'],
    isWomenOwned: true,
    isSocialImpact: false,
    rating: 4.9,
    reviewCount: 145
  },
  {
    id: uuidv4(),
    businessName: 'Zeynep Gelinlik Atölyesi',
    ownerName: 'Zeynep Kaya',
    category: 'dress',
    description: 'Özel tasarım gelinlikler, kişiye özel dikim hizmeti.',
    services: ['Gelinlik', 'Damatlık', 'Düğün Elbisesi', 'Dikim'],
    location: { city: 'İstanbul', district: 'Nişantaşı' },
    priceRange: { min: 15000, max: 80000 },
    contact: { phone: '+90 555 234 5678', email: 'zeynep@gelinlik.com' },
    images: ['https://images.unsplash.com/photo-1594552072238-5cb97bef5356?w=800'],
    isWomenOwned: true,
    isSocialImpact: true,
    rating: 4.8,
    reviewCount: 89
  },
  {
    id: uuidv4(),
    businessName: 'Şef Ahmet Catering',
    ownerName: 'Ahmet Demir',
    category: 'catering',
    description: 'Geleneksel ve modern Türk mutfağı, 500 kişilik organizasyonlar.',
    services: ['Ana Yemek', 'Açık Büfe', 'Kokteyl', 'Pasta'],
    location: { city: 'Ankara', district: 'Çankaya' },
    priceRange: { min: 150, max: 350 },
    contact: { phone: '+90 555 345 6789', email: 'ahmet@catering.com' },
    images: ['https://images.unsplash.com/photo-1555244162-803834f70033?w=800'],
    isWomenOwned: false,
    isSocialImpact: false,
    rating: 4.7,
    reviewCount: 134
  },
  {
    id: uuidv4(),
    businessName: 'Ayşe Çiçekçilik',
    ownerName: 'Ayşe Şahin',
    category: 'flowers',
    description: 'Düğün çiçek süslemeleri, gelin buketi, masa düzenlemeleri.',
    services: ['Gelin Buketi', 'Salon Süsleme', 'Masa Çiçekleri', 'Araba Süsleme'],
    location: { city: 'İzmir', district: 'Karşıyaka' },
    priceRange: { min: 5000, max: 30000 },
    contact: { phone: '+90 555 456 7890', email: 'ayse@cicek.com' },
    images: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800'],
    isWomenOwned: true,
    isSocialImpact: true,
    rating: 4.9,
    reviewCount: 167
  },
  {
    id: uuidv4(),
    businessName: 'Fatma Kına Organizasyon',
    ownerName: 'Fatma Özkan',
    category: 'kina',
    description: 'Geleneksel ve modern kına geceleri organizasyonu, profesyonel ekip.',
    services: ['Kına Gecesi', 'DJ', 'Işık Sistemi', 'Kostüm', 'Makyaj'],
    location: { city: 'İstanbul', district: 'Üsküdar' },
    priceRange: { min: 8000, max: 25000 },
    contact: { phone: '+90 555 567 8901', email: 'fatma@kina.com' },
    images: ['https://images.unsplash.com/photo-1529634768101-fd5c2d8d191c?w=800'],
    isWomenOwned: true,
    isSocialImpact: true,
    rating: 4.8,
    reviewCount: 98
  },
  {
    id: uuidv4(),
    businessName: 'Müzik Dünyası DJ',
    ownerName: 'Mehmet Yıldız',
    category: 'music',
    description: 'Düğün DJ hizmetleri, canlı müzik grupları, ses ve ışık sistemleri.',
    services: ['DJ', 'Canlı Müzik', 'Ses Sistemi', 'Işık Show'],
    location: { city: 'İstanbul', district: 'Beyoğlu' },
    priceRange: { min: 6000, max: 20000 },
    contact: { phone: '+90 555 678 9012', email: 'mehmet@muzik.com' },
    images: ['https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800'],
    isWomenOwned: false,
    isSocialImpact: false,
    rating: 4.6,
    reviewCount: 76
  },
  {
    id: uuidv4(),
    businessName: 'Selin Davetiye Tasarım',
    ownerName: 'Selin Arslan',
    category: 'invitation',
    description: 'Özel tasarım davetiyeler, dijital ve basılı seçenekler.',
    services: ['Basılı Davetiye', 'Dijital Davetiye', 'Özel Tasarım', 'Nikah Şekeri Kartı'],
    location: { city: 'Ankara', district: 'Kızılay' },
    priceRange: { min: 3000, max: 15000 },
    contact: { phone: '+90 555 789 0123', email: 'selin@davetiye.com' },
    images: ['https://images.unsplash.com/photo-1606800052052-1e1a930cda79?w=800'],
    isWomenOwned: true,
    isSocialImpact: true,
    rating: 4.7,
    reviewCount: 54
  },
  {
    id: uuidv4(),
    businessName: 'Güzellik Merkezi Salon',
    ownerName: 'Meral Tekin',
    category: 'makeup',
    description: 'Gelin makyajı ve saç tasarımı, denemeli hizmet.',
    services: ['Gelin Makyajı', 'Saç Tasarımı', 'Cilt Bakımı', 'Prova Makyajı'],
    location: { city: 'İzmir', district: 'Bornova' },
    priceRange: { min: 2000, max: 8000 },
    contact: { phone: '+90 555 890 1234', email: 'meral@salon.com' },
    images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800'],
    isWomenOwned: true,
    isSocialImpact: false,
    rating: 4.8,
    reviewCount: 112
  }
];

export async function seedDatabase(db) {
  try {
    const venuesCount = await db.collection('venues').countDocuments();
    if (venuesCount === 0) {
      await db.collection('venues').insertMany(mockVenues);
      console.log('Venues seeded successfully');
    }

    const suppliersCount = await db.collection('suppliers').countDocuments();
    if (suppliersCount === 0) {
      await db.collection('suppliers').insertMany(mockSuppliers);
      console.log('Suppliers seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
