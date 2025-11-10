'use client';

import { useState, useEffect } from 'react';
import { Heart, MapPin, Users, Star, Sparkles, Calendar, Search, Filter, X, Menu, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [venues, setVenues] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [budgetResult, setBudgetResult] = useState(null);
  const [budgetQuestion, setBudgetQuestion] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filters, setFilters] = useState({ city: '', category: '', womenOwned: false });

  // Auth form state
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });

  // Budget form state
  const [budgetForm, setBudgetForm] = useState({
    location: '',
    guestCount: '',
    budget: '',
    preferences: ''
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser(token);
    }
    
    // Fetch initial data
    fetchVenues();
    fetchSuppliers();
  }, []);

  const fetchCurrentUser = async (token) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchVenues = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      const res = await fetch(`/api/venues?${params}`);
      const data = await res.json();
      setVenues(data.venues || []);
    } catch (error) {
      console.error('Error fetching venues:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.category) params.append('category', filters.category);
      if (filters.womenOwned) params.append('womenOwned', 'true');
      const res = await fetch(`/api/suppliers?${params}`);
      const data = await res.json();
      setSuppliers(data.suppliers || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setShowAuthModal(false);
        setAuthForm({ email: '', password: '', name: '' });
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/ai/budget-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budgetForm)
      });
      
      const data = await res.json();
      if (res.ok) {
        setBudgetResult(data.data);
        setSessionId(data.sessionId);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Bütçe planı oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!budgetQuestion.trim() || !sessionId) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/ai/budget-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: budgetQuestion, sessionId })
      });
      
      const data = await res.json();
      if (res.ok) {
        setBudgetResult(prev => `${prev}\n\n**Sorunuz:** ${budgetQuestion}\n\n**Cevap:** ${data.data}`);
        setBudgetQuestion('');
      }
    } catch (error) {
      alert('Soru cevaplanamadı');
    } finally {
      setLoading(false);
    }
  };

  const categoryNames = {
    photography: 'Fotoğrafçılık',
    dress: 'Gelinlik/Damatlık',
    catering: 'Yemek',
    flowers: 'Çiçek',
    kina: 'Kına Organizasyonu',
    music: 'Müzik/DJ',
    invitation: 'Davetiye',
    makeup: 'Makyaj'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                Mutlu Başlangıç
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#venues" className="text-gray-700 hover:text-rose-500 transition">Mekanlar</a>
              <a href="#suppliers" className="text-gray-700 hover:text-rose-500 transition">Tedarikçiler</a>
              <Button onClick={() => setShowBudgetModal(true)} className="bg-gradient-to-r from-rose-500 to-pink-500">
                <Sparkles className="h-4 w-4 mr-2" />
                AI Bütçe Planlayıcı
              </Button>
              
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Merhaba, {user.name}</span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Çıkış
                  </Button>
                </div>
              ) : (
                <Button onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Giriş Yap
                </Button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3">
              <a href="#venues" className="block text-gray-700 hover:text-rose-500">Mekanlar</a>
              <a href="#suppliers" className="block text-gray-700 hover:text-rose-500">Tedarikçiler</a>
              <Button onClick={() => setShowBudgetModal(true)} className="w-full bg-gradient-to-r from-rose-500 to-pink-500">
                <Sparkles className="h-4 w-4 mr-2" />
                AI Bütçe Planlayıcı
              </Button>
              {user ? (
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Çıkış Yap
                </Button>
              ) : (
                <Button onClick={() => { setAuthMode('login'); setShowAuthModal(true); }} className="w-full">
                  <LogIn className="h-4 w-4 mr-2" />
                  Giriş Yap
                </Button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-rose-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Hayalinizdeki Düğünü Planlayın
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Türkiye'nin en kapsamlı düğün platformu. Teklif alımından kına gecesine, her şey bir arada!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" onClick={() => setShowBudgetModal(true)} className="bg-gradient-to-r from-rose-500 to-pink-500 text-lg px-8">
                <Sparkles className="h-5 w-5 mr-2" />
                AI ile Bütçe Oluştur
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('venues').scrollIntoView({ behavior: 'smooth' })}>
                Mekanları Keşfet
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Stages */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Düğün Aşamaları</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'Teklif & Söz', icon: '💍', desc: 'İlk adım: Evlilik teklifi ve nişan' },
              { title: 'Kız İsteme', icon: '🎁', desc: 'Geleneksel aile buluşması' },
              { title: 'Kına Gecesi', icon: '🎉', desc: 'Eğlenceli kına organizasyonu' },
              { title: 'Düğün', icon: '👰', desc: 'Hayalinizdeki düğün günü' }
            ].map((stage, idx) => (
              <Card key={idx} className="hover:shadow-lg transition cursor-pointer">
                <CardHeader>
                  <div className="text-4xl mb-2">{stage.icon}</div>
                  <CardTitle className="text-lg">{stage.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{stage.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Venues Section */}
      <section id="venues" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-gray-800">Düğün Mekanları</h3>
            <div className="flex gap-3">
              <Select value={filters.city} onValueChange={(val) => { setFilters({...filters, city: val}); fetchVenues(); }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Şehir seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="İstanbul">İstanbul</SelectItem>
                  <SelectItem value="Ankara">Ankara</SelectItem>
                  <SelectItem value="İzmir">İzmir</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <Card key={venue.id} className="overflow-hidden hover:shadow-xl transition">
                <div className="relative h-48 overflow-hidden">
                  <img src={venue.images[0]} alt={venue.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold text-rose-600">
                    {venue.pricePerPerson} ₺/kişi
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{venue.name}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-1 text-sm mt-1">
                      <MapPin className="h-4 w-4" />
                      {venue.location.district}, {venue.location.city}
                    </div>
                    <div className="flex items-center gap-1 text-sm mt-1">
                      <Users className="h-4 w-4" />
                      {venue.capacity.min}-{venue.capacity.max} kişi
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{venue.rating}</span>
                      <span className="text-sm text-gray-500">({venue.reviewCount})</span>
                    </div>
                    <Button size="sm" variant="outline">
                      Detaylar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Suppliers Section */}
      <section id="suppliers" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <h3 className="text-3xl font-bold text-gray-800">Tedarikçiler</h3>
            <div className="flex flex-wrap gap-3">
              <Select value={filters.city} onValueChange={(val) => { setFilters({...filters, city: val}); fetchSuppliers(); }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Şehir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="İstanbul">İstanbul</SelectItem>
                  <SelectItem value="Ankara">Ankara</SelectItem>
                  <SelectItem value="İzmir">İzmir</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filters.category} onValueChange={(val) => { setFilters({...filters, category: val}); fetchSuppliers(); }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photography">Fotoğrafçılık</SelectItem>
                  <SelectItem value="dress">Gelinlik/Damatlık</SelectItem>
                  <SelectItem value="catering">Yemek</SelectItem>
                  <SelectItem value="flowers">Çiçek</SelectItem>
                  <SelectItem value="kina">Kına Organizasyonu</SelectItem>
                  <SelectItem value="music">Müzik/DJ</SelectItem>
                  <SelectItem value="invitation">Davetiye</SelectItem>
                  <SelectItem value="makeup">Makyaj</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant={filters.womenOwned ? 'default' : 'outline'} 
                onClick={() => { setFilters({...filters, womenOwned: !filters.womenOwned}); fetchSuppliers(); }}
              >
                👩 Kadın Girişimci
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="overflow-hidden hover:shadow-xl transition">
                <div className="relative h-48 overflow-hidden">
                  <img src={supplier.images[0]} alt={supplier.businessName} className="w-full h-full object-cover" />
                  {supplier.isWomenOwned && (
                    <Badge className="absolute top-3 left-3 bg-purple-500">👩 Kadın Girişimci</Badge>
                  )}
                  {supplier.isSocialImpact && (
                    <Badge className="absolute top-3 right-3 bg-green-500">🌱 Sosyal Fayda</Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{supplier.businessName}</CardTitle>
                  <CardDescription>
                    <Badge variant="outline" className="mt-2">{categoryNames[supplier.category]}</Badge>
                    <div className="flex items-center gap-1 text-sm mt-2">
                      <MapPin className="h-4 w-4" />
                      {supplier.location.district}, {supplier.location.city}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{supplier.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{supplier.rating}</span>
                      <span className="text-sm text-gray-500">({supplier.reviewCount})</span>
                    </div>
                    <div className="text-sm font-semibold text-rose-600">
                      {supplier.priceRange.min.toLocaleString()}-{supplier.priceRange.max.toLocaleString()} ₺
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{authMode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</DialogTitle>
            <DialogDescription>
              {authMode === 'login' ? 'Hesabınıza giriş yapın' : 'Yeni hesap oluşturun'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <Label htmlFor="name">İsim</Label>
                <Input 
                  id="name" 
                  value={authForm.name} 
                  onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                  required={authMode === 'register'}
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={authForm.email} 
                onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Şifre</Label>
              <Input 
                id="password" 
                type="password" 
                value={authForm.password} 
                onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'İşleniyor...' : (authMode === 'login' ? 'Giriş Yap' : 'Kayıt Ol')}
            </Button>
            
            <p className="text-center text-sm text-gray-600">
              {authMode === 'login' ? 'Hesabınız yok mu? ' : 'Zaten hesabınız var mı? '}
              <button 
                type="button" 
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-rose-500 hover:underline"
              >
                {authMode === 'login' ? 'Kayıt Ol' : 'Giriş Yap'}
              </button>
            </p>
          </form>
        </DialogContent>
      </Dialog>

      {/* Budget Planner Modal */}
      <Dialog open={showBudgetModal} onOpenChange={setShowBudgetModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-rose-500" />
              AI Destekli Düğün Bütçe Planlayıcı
            </DialogTitle>
            <DialogDescription>
              Yapay zeka ile kişiselleştirilmiş düğün bütçenizi oluşturun
            </DialogDescription>
          </DialogHeader>
          
          {!budgetResult ? (
            <form onSubmit={handleBudgetSubmit} className="space-y-4">
              <div>
                <Label htmlFor="location">Düğün Şehri</Label>
                <Select value={budgetForm.location} onValueChange={(val) => setBudgetForm({...budgetForm, location: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Şehir seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="İstanbul">İstanbul</SelectItem>
                    <SelectItem value="Ankara">Ankara</SelectItem>
                    <SelectItem value="İzmir">İzmir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="guestCount">Misafir Sayısı</Label>
                <Input 
                  id="guestCount" 
                  type="number" 
                  placeholder="Örn: 200" 
                  value={budgetForm.guestCount}
                  onChange={(e) => setBudgetForm({...budgetForm, guestCount: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="budget">Toplam Bütçe (TL)</Label>
                <Input 
                  id="budget" 
                  type="number" 
                  placeholder="Örn: 250000" 
                  value={budgetForm.budget}
                  onChange={(e) => setBudgetForm({...budgetForm, budget: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="preferences">Öncelikleriniz (Opsiyonel)</Label>
                <Textarea 
                  id="preferences" 
                  placeholder="Örn: Yemek ve fotoğrafa önem veriyoruz, çiçekte tasarruf edebiliriz"
                  value={budgetForm.preferences}
                  onChange={(e) => setBudgetForm({...budgetForm, preferences: e.target.value})}
                />
              </div>
              
              <Button type="submit" className="w-full bg-gradient-to-r from-rose-500 to-pink-500" disabled={loading}>
                {loading ? 'Oluşturuluyor...' : 'Bütçe Planı Oluştur'}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-lg">
                <ReactMarkdown className="prose prose-sm max-w-none">
                  {budgetResult}
                </ReactMarkdown>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-rose-500" />
                  Soru sorun
                </h4>
                <form onSubmit={handleAskQuestion} className="flex gap-2">
                  <Input 
                    placeholder="Örn: Mekanda nasıl tasarruf edebilirim?"
                    value={budgetQuestion}
                    onChange={(e) => setBudgetQuestion(e.target.value)}
                    disabled={loading}
                  />
                  <Button type="submit" disabled={loading || !budgetQuestion.trim()}>
                    Sor
                  </Button>
                </form>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => { setBudgetResult(null); setSessionId(null); setBudgetForm({ location: '', guestCount: '', budget: '', preferences: '' }); }}
              >
                Yeni Bütçe Planı Oluştur
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
                <span className="text-xl font-bold">Mutlu Başlangıç</span>
              </div>
              <p className="text-gray-400">Hayalinizdeki düğünü planlamanın en kolay yolu</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hızlı Linkler</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#venues" className="hover:text-rose-500">Mekanlar</a></li>
                <li><a href="#suppliers" className="hover:text-rose-500">Tedarikçiler</a></li>
                <li><button onClick={() => setShowBudgetModal(true)} className="hover:text-rose-500">Bütçe Planlayıcı</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Özellikler</h4>
              <ul className="space-y-2 text-gray-400">
                <li>✨ AI Bütçe Planlama</li>
                <li>👩 Kadın Girişimciler</li>
                <li>🌱 Sosyal Fayda Projeleri</li>
                <li>⭐ Kullanıcı Yorumları</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 Mutlu Başlangıç. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
