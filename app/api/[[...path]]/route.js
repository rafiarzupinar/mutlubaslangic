import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hashPassword, verifyPassword, generateToken, getUserFromRequest } from '@/lib/auth';
import { generateBudgetPlan, answerBudgetQuestion } from '@/lib/llm-service';
import { mockVenues, mockSuppliers, seedDatabase } from '@/lib/mock-data';
import { v4 as uuidv4 } from 'uuid';

// Helper function to handle CORS
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }));
}

// Initialize database with mock data
async function initializeDB() {
  const { db } = await connectToDatabase();
  await seedDatabase(db);
  return db;
}

export async function GET(request, { params }) {
  const path = params.path?.join('/') || '';
  const { searchParams } = new URL(request.url);

  try {
    const db = await initializeDB();

    // Root endpoint
    if (path === '') {
      return handleCORS(NextResponse.json({ message: 'Mutlu Başlangıç API - Wedding Platform' }));
    }

    // AUTH: Get current user
    if (path === 'auth/me') {
      const user = getUserFromRequest(request);
      if (!user) {
        return handleCORS(NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 }));
      }
      
      const userData = await db.collection('users').findOne({ id: user.userId });
      if (!userData) {
        return handleCORS(NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 }));
      }
      
      const { password, ...userWithoutPassword } = userData;
      return handleCORS(NextResponse.json({ user: userWithoutPassword }));
    }

    // VENUES: Get all venues with filters
    if (path === 'venues') {
      const city = searchParams.get('city');
      const district = searchParams.get('district');
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      const venueType = searchParams.get('type');
      
      let query = {};
      if (city) query['location.city'] = city;
      if (district) query['location.district'] = district;
      if (venueType) query.venueType = venueType;
      if (minPrice || maxPrice) {
        query.pricePerPerson = {};
        if (minPrice) query.pricePerPerson.$gte = parseInt(minPrice);
        if (maxPrice) query.pricePerPerson.$lte = parseInt(maxPrice);
      }
      
      const venues = await db.collection('venues').find(query).toArray();
      return handleCORS(NextResponse.json({ venues }));
    }

    // VENUES: Get single venue
    if (path.startsWith('venues/')) {
      const venueId = path.split('/')[1];
      const venue = await db.collection('venues').findOne({ id: venueId });
      
      if (!venue) {
        return handleCORS(NextResponse.json({ error: 'Mekan bulunamadı' }, { status: 404 }));
      }
      
      const reviews = await db.collection('reviews')
        .find({ targetId: venueId, targetType: 'venue' })
        .toArray();
      
      return handleCORS(NextResponse.json({ venue, reviews }));
    }

    // SUPPLIERS: Get all suppliers with filters
    if (path === 'suppliers') {
      const city = searchParams.get('city');
      const category = searchParams.get('category');
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      const womenOwned = searchParams.get('womenOwned');
      
      let query = {};
      if (city) query['location.city'] = city;
      if (category) query.category = category;
      if (womenOwned === 'true') query.isWomenOwned = true;
      
      const suppliers = await db.collection('suppliers').find(query).toArray();
      return handleCORS(NextResponse.json({ suppliers }));
    }

    // SUPPLIERS: Get single supplier
    if (path.startsWith('suppliers/')) {
      const supplierId = path.split('/')[1];
      const supplier = await db.collection('suppliers').findOne({ id: supplierId });
      
      if (!supplier) {
        return handleCORS(NextResponse.json({ error: 'Tedarikçi bulunamadı' }, { status: 404 }));
      }
      
      const reviews = await db.collection('reviews')
        .find({ targetId: supplierId, targetType: 'supplier' })
        .toArray();
      
      return handleCORS(NextResponse.json({ supplier, reviews }));
    }

    // USER: Get favorites
    if (path === 'user/favorites') {
      const user = getUserFromRequest(request);
      if (!user) {
        return handleCORS(NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 }));
      }
      
      const favorites = await db.collection('favorites')
        .find({ userId: user.userId })
        .toArray();
      
      return handleCORS(NextResponse.json({ favorites }));
    }

    // USER: Get bookings
    if (path === 'user/bookings') {
      const user = getUserFromRequest(request);
      if (!user) {
        return handleCORS(NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 }));
      }
      
      const bookings = await db.collection('bookings')
        .find({ userId: user.userId })
        .toArray();
      
      return handleCORS(NextResponse.json({ bookings }));
    }

    // REVIEWS: Get reviews for a target
    if (path.startsWith('reviews/')) {
      const targetId = path.split('/')[1];
      const reviews = await db.collection('reviews')
        .find({ targetId })
        .toArray();
      
      return handleCORS(NextResponse.json({ reviews }));
    }

    return handleCORS(NextResponse.json({ message: 'Mutlu Başlangıç API' }));
    
  } catch (error) {
    console.error('GET Error:', error);
    return handleCORS(NextResponse.json({ error: 'Sunucu hatası: ' + error.message }, { status: 500 }));
  }
}

export async function POST(request, { params }) {
  const path = params.path?.join('/') || '';

  try {
    const db = await initializeDB();
    const body = await request.json();

    // AUTH: Register
    if (path === 'auth/register') {
      const { email, password, name, role = 'couple' } = body;
      
      if (!email || !password || !name) {
        return handleCORS(NextResponse.json({ error: 'Tüm alanları doldurun' }, { status: 400 }));
      }
      
      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        return handleCORS(NextResponse.json({ error: 'Bu email zaten kullanılıyor' }, { status: 400 }));
      }
      
      const hashedPassword = await hashPassword(password);
      const userId = uuidv4();
      const user = {
        id: userId,
        email,
        password: hashedPassword,
        name,
        role,
        createdAt: new Date().toISOString()
      };
      
      await db.collection('users').insertOne(user);
      
      const token = generateToken(userId, email, role);
      
      const { password: _, ...userWithoutPassword } = user;
      return handleCORS(NextResponse.json({ user: userWithoutPassword, token }));
    }

    // AUTH: Login
    if (path === 'auth/login') {
      const { email, password } = body;
      
      if (!email || !password) {
        return handleCORS(NextResponse.json({ error: 'Email ve şifre gerekli' }, { status: 400 }));
      }
      
      const user = await db.collection('users').findOne({ email });
      if (!user) {
        return handleCORS(NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 }));
      }
      
      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return handleCORS(NextResponse.json({ error: 'Hatalı şifre' }, { status: 401 }));
      }
      
      const token = generateToken(user.id, user.email, user.role);
      
      const { password: _, ...userWithoutPassword } = user;
      return handleCORS(NextResponse.json({ user: userWithoutPassword, token }));
    }

    // AI: Generate budget plan
    if (path === 'ai/budget-planner') {
      const { location, guestCount, budget, preferences, sessionId } = body;
      
      if (!location || !guestCount || !budget) {
        return handleCORS(NextResponse.json({ error: 'Şehir, misafir sayısı ve bütçe gerekli' }, { status: 400 }));
      }
      
      const result = await generateBudgetPlan({
        location,
        guestCount,
        budget,
        preferences: preferences || '',
        sessionId: sessionId || uuidv4()
      });
      
      if (!result.success) {
        return handleCORS(NextResponse.json({ error: result.error }, { status: 500 }));
      }
      
      await db.collection('budget_plans').insertOne({
        id: uuidv4(),
        sessionId: result.sessionId,
        location,
        guestCount,
        budget,
        preferences,
        plan: result.data,
        createdAt: new Date().toISOString()
      });
      
      return handleCORS(NextResponse.json(result));
    }

    // AI: Ask budget question
    if (path === 'ai/budget-question') {
      const { question, sessionId } = body;
      
      if (!question || !sessionId) {
        return handleCORS(NextResponse.json({ error: 'Soru ve session ID gerekli' }, { status: 400 }));
      }
      
      const result = await answerBudgetQuestion(question, sessionId);
      
      if (!result.success) {
        return handleCORS(NextResponse.json({ error: result.error }, { status: 500 }));
      }
      
      return handleCORS(NextResponse.json(result));
    }

    // USER: Add to favorites
    if (path === 'user/favorites') {
      const user = getUserFromRequest(request);
      if (!user) {
        return handleCORS(NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 }));
      }
      
      const { targetId, targetType } = body;
      
      const existing = await db.collection('favorites').findOne({
        userId: user.userId,
        targetId
      });
      
      if (existing) {
        await db.collection('favorites').deleteOne({ _id: existing._id });
        return handleCORS(NextResponse.json({ message: 'Favorilerden çıkarıldı', favorited: false }));
      } else {
        await db.collection('favorites').insertOne({
          id: uuidv4(),
          userId: user.userId,
          targetId,
          targetType,
          createdAt: new Date().toISOString()
        });
        return handleCORS(NextResponse.json({ message: 'Favorilere eklendi', favorited: true }));
      }
    }

    // REVIEWS: Add review
    if (path === 'reviews') {
      const user = getUserFromRequest(request);
      if (!user) {
        return handleCORS(NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 }));
      }
      
      const { targetId, targetType, rating, comment } = body;
      
      if (!targetId || !targetType || !rating) {
        return handleCORS(NextResponse.json({ error: 'Gerekli alanları doldurun' }, { status: 400 }));
      }
      
      const review = {
        id: uuidv4(),
        userId: user.userId,
        targetId,
        targetType,
        rating: parseInt(rating),
        comment: comment || '',
        createdAt: new Date().toISOString()
      };
      
      await db.collection('reviews').insertOne(review);
      
      const allReviews = await db.collection('reviews')
        .find({ targetId, targetType })
        .toArray();
      
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      
      const collection = targetType === 'venue' ? 'venues' : 'suppliers';
      await db.collection(collection).updateOne(
        { id: targetId },
        { 
          $set: { 
            rating: parseFloat(avgRating.toFixed(1)), 
            reviewCount: allReviews.length 
          } 
        }
      );
      
      return handleCORS(NextResponse.json({ review }));
    }

    // BOOKINGS: Create booking
    if (path === 'bookings') {
      const user = getUserFromRequest(request);
      if (!user) {
        return handleCORS(NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 }));
      }
      
      const { targetId, targetType, date, notes } = body;
      
      if (!targetId || !targetType || !date) {
        return handleCORS(NextResponse.json({ error: 'Gerekli alanları doldurun' }, { status: 400 }));
      }
      
      const booking = {
        id: uuidv4(),
        userId: user.userId,
        targetId,
        targetType,
        date,
        notes: notes || '',
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      await db.collection('bookings').insertOne(booking);
      
      return handleCORS(NextResponse.json({ booking }));
    }

    return handleCORS(NextResponse.json({ error: 'Endpoint bulunamadı' }, { status: 404 }));
    
  } catch (error) {
    console.error('POST Error:', error);
    return handleCORS(NextResponse.json({ error: 'Sunucu hatası: ' + error.message }, { status: 500 }));
  }
}

export const PUT = POST;
export const DELETE = POST;
export const PATCH = POST;