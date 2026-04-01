import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Deal } from '../models/deal.model';

@Injectable({
  providedIn: 'root'
})
export class DealService {
  private apiUrl = 'http://localhost:8080/api/deals';

  constructor(private http: HttpClient) {}

  getAllDeals(): Observable<Deal[]> {
    // Always use mock deals for demo (backend might not be running)
    return of(this.getMockDeals());
    
    // Uncomment below to use backend when available:
    // return this.http.get<Deal[]>(this.apiUrl).pipe(
    //   catchError(() => of(this.getMockDeals()))
    // );
  }

  private getMockDeals(): Deal[] {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const in2Days = new Date(today);
    in2Days.setDate(in2Days.getDate() + 2);
    
    const in3Days = new Date(today);
    in3Days.setDate(in3Days.getDate() + 3);
    
    const in5Days = new Date(today);
    in5Days.setDate(in5Days.getDate() + 5);
    
    const in7Days = new Date(today);
    in7Days.setDate(in7Days.getDate() + 7);
    
    const in10Days = new Date(today);
    in10Days.setDate(in10Days.getDate() + 10);
    
    const in15Days = new Date(today);
    in15Days.setDate(in15Days.getDate() + 15);
    
    const in20Days = new Date(today);
    in20Days.setDate(in20Days.getDate() + 20);
    
    const in30Days = new Date(today);
    in30Days.setDate(in30Days.getDate() + 30);
    
    const in45Days = new Date(today);
    in45Days.setDate(in45Days.getDate() + 45);
    
    const in60Days = new Date(today);
    in60Days.setDate(in60Days.getDate() + 60);
    
    return [
      {
        id: 1,
        title: '🔥 iPhone 15 Pro Max - Mega Sale',
        description: 'Get the latest iPhone 15 Pro Max at unbeatable prices! Limited stock available',
        discount: 50,
        price: 15000,
        category: 'Electronics',
        couponCode: 'IPHONE50',
        cashbackPoints: 500,
        expiryDate: tomorrow.toISOString().split('T')[0],
        merchantId: 1,
        location: 'Mumbai'
      },
      {
        id: 2,
        title: '👗 Zara End of Season Sale',
        description: 'Premium fashion brands at 70% off! Trendy collection for men and women',
        discount: 70,
        price: 2000,
        category: 'Fashion',
        couponCode: 'ZARA70',
        cashbackPoints: 100,
        expiryDate: in3Days.toISOString().split('T')[0],
        merchantId: 2,
        location: 'Delhi'
      },
      {
        id: 3,
        title: '🍕 Dominos Buy 1 Get 1 Free',
        description: 'Order any large pizza and get another one absolutely free! Valid on all pizzas',
        discount: 50,
        price: 500,
        category: 'Food',
        couponCode: 'DOMINO50',
        cashbackPoints: 50,
        expiryDate: in7Days.toISOString().split('T')[0],
        merchantId: 3,
        location: 'Bangalore'
      },
      {
        id: 4,
        title: '✈️ Goa Beach Resort Package',
        description: '3 Days 2 Nights luxury stay with breakfast! Beachfront rooms with ocean view',
        discount: 40,
        price: 25000,
        category: 'Travel',
        couponCode: 'GOA40',
        cashbackPoints: 1000,
        expiryDate: in30Days.toISOString().split('T')[0],
        merchantId: 4,
        location: 'Goa'
      },
      {
        id: 5,
        title: '📚 Amazon Books Bonanza',
        description: 'Bestselling novels, textbooks, and comics at massive discounts. Free shipping!',
        discount: 35,
        price: 800,
        category: 'Books',
        couponCode: 'BOOKS35',
        cashbackPoints: 80,
        expiryDate: in60Days.toISOString().split('T')[0],
        merchantId: 5,
        location: 'Chennai'
      },
      {
        id: 6,
        title: '🎮 PlayStation 5 Bundle Deal',
        description: 'PS5 console with 2 controllers and 3 games! Gaming at its best',
        discount: 25,
        price: 45000,
        category: 'Electronics',
        couponCode: 'PS5DEAL',
        cashbackPoints: 1500,
        expiryDate: in7Days.toISOString().split('T')[0],
        merchantId: 1,
        location: 'Mumbai'
      },
      {
        id: 7,
        title: '👟 Nike Air Max - Flash Sale',
        description: 'Authentic Nike sneakers at 60% off! All sizes available, limited period offer',
        discount: 60,
        price: 3500,
        category: 'Fashion',
        couponCode: 'NIKE60',
        cashbackPoints: 200,
        expiryDate: in3Days.toISOString().split('T')[0],
        merchantId: 2,
        location: 'Delhi'
      },
      {
        id: 8,
        title: '🍔 McDonald\'s Family Meal Deal',
        description: '4 Burgers + 4 Fries + 4 Drinks at special price! Perfect for family dinner',
        discount: 35,
        price: 800,
        category: 'Food',
        couponCode: 'MCDFAM',
        cashbackPoints: 60,
        expiryDate: in7Days.toISOString().split('T')[0],
        merchantId: 3,
        location: 'Bangalore'
      },
      {
        id: 9,
        title: '🏔️ Manali Adventure Trip',
        description: 'Trekking, camping, and sightseeing package! 5 days of pure adventure',
        discount: 30,
        price: 18000,
        category: 'Travel',
        couponCode: 'MANALI30',
        cashbackPoints: 800,
        expiryDate: in30Days.toISOString().split('T')[0],
        merchantId: 4,
        location: 'Manali'
      },
      {
        id: 10,
        title: '💄 Lakme Makeup Kit - 50% Off',
        description: 'Complete makeup kit with lipstick, foundation, and more! Premium quality',
        discount: 50,
        price: 1500,
        category: 'Fashion',
        couponCode: 'LAKME50',
        cashbackPoints: 100,
        expiryDate: in7Days.toISOString().split('T')[0],
        merchantId: 2,
        location: 'Delhi'
      },
      {
        id: 11,
        title: '💻 Dell Laptop - Student Special',
        description: 'Core i5, 8GB RAM, 512GB SSD! Perfect for students and professionals',
        discount: 30,
        price: 42000,
        category: 'Electronics',
        couponCode: 'DELL30',
        cashbackPoints: 1200,
        expiryDate: in30Days.toISOString().split('T')[0],
        merchantId: 1,
        location: 'Mumbai'
      },
      {
        id: 12,
        title: '🍰 Cake & Desserts - Sweet Deal',
        description: 'Order any 2 cakes and get 1 free! Fresh baked daily with premium ingredients',
        discount: 40,
        price: 600,
        category: 'Food',
        couponCode: 'CAKE40',
        cashbackPoints: 50,
        expiryDate: in3Days.toISOString().split('T')[0],
        merchantId: 3,
        location: 'Bangalore'
      },
      {
        id: 13,
        title: '📱 Samsung Galaxy S24 Ultra',
        description: 'Latest flagship with 200MP camera! Pre-order now and save big',
        discount: 45,
        price: 89999,
        category: 'Electronics',
        couponCode: 'SAMSUNG45',
        cashbackPoints: 2000,
        expiryDate: in15Days.toISOString().split('T')[0],
        merchantId: 1,
        location: 'Mumbai'
      },
      {
        id: 14,
        title: '🎧 Sony WH-1000XM5 Headphones',
        description: 'Industry-leading noise cancellation! Premium audio experience',
        discount: 35,
        price: 24990,
        category: 'Electronics',
        couponCode: 'SONY35',
        cashbackPoints: 800,
        expiryDate: in20Days.toISOString().split('T')[0],
        merchantId: 1,
        location: 'Mumbai'
      },
      {
        id: 15,
        title: '👔 Raymond Suit - Premium Collection',
        description: 'Tailored suits for professionals! Get measured and stitched perfectly',
        discount: 40,
        price: 8500,
        category: 'Fashion',
        couponCode: 'RAYMOND40',
        cashbackPoints: 400,
        expiryDate: in15Days.toISOString().split('T')[0],
        merchantId: 2,
        location: 'Delhi'
      },
      {
        id: 16,
        title: '👜 Gucci Handbag - Luxury Sale',
        description: 'Authentic designer handbags at exclusive prices! Limited edition',
        discount: 30,
        price: 45000,
        category: 'Fashion',
        couponCode: 'GUCCI30',
        cashbackPoints: 1500,
        expiryDate: in45Days.toISOString().split('T')[0],
        merchantId: 2,
        location: 'Delhi'
      },
      {
        id: 17,
        title: '🍜 Noodles & Ramen Festival',
        description: 'Authentic Asian cuisine! Try 5 different ramen bowls at special price',
        discount: 45,
        price: 450,
        category: 'Food',
        couponCode: 'RAMEN45',
        cashbackPoints: 40,
        expiryDate: in5Days.toISOString().split('T')[0],
        merchantId: 3,
        location: 'Bangalore'
      },
      {
        id: 18,
        title: '🍦 Baskin Robbins - Ice Cream Party',
        description: '1 Liter tub at half price! Choose from 31 flavors',
        discount: 50,
        price: 350,
        category: 'Food',
        couponCode: 'ICECREAM50',
        cashbackPoints: 30,
        expiryDate: in2Days.toISOString().split('T')[0],
        merchantId: 3,
        location: 'Bangalore'
      },
      {
        id: 19,
        title: '☕ Starbucks Coffee Voucher',
        description: 'Buy 2 get 1 free on all beverages! Valid at all outlets',
        discount: 33,
        price: 400,
        category: 'Food',
        couponCode: 'STARBUCKS33',
        cashbackPoints: 35,
        expiryDate: in10Days.toISOString().split('T')[0],
        merchantId: 3,
        location: 'Bangalore'
      },
      {
        id: 20,
        title: '🍕 Pizza Hut - Mega Feast',
        description: '2 Medium pizzas + Garlic bread + Pepsi! Perfect combo deal',
        discount: 40,
        price: 699,
        category: 'Food',
        couponCode: 'PIZZAHUT40',
        cashbackPoints: 55,
        expiryDate: in7Days.toISOString().split('T')[0],
        merchantId: 3,
        location: 'Bangalore'
      },
      {
        id: 21,
        title: '🏖️ Maldives Honeymoon Package',
        description: '5 Days 4 Nights in paradise! Water villa with all meals included',
        discount: 35,
        price: 125000,
        category: 'Travel',
        couponCode: 'MALDIVES35',
        cashbackPoints: 5000,
        expiryDate: in60Days.toISOString().split('T')[0],
        merchantId: 4,
        location: 'Maldives'
      },
      {
        id: 22,
        title: '🕌 Dubai Shopping Festival',
        description: '4 Days 3 Nights with city tour! Visit Burj Khalifa and Dubai Mall',
        discount: 30,
        price: 55000,
        category: 'Travel',
        couponCode: 'DUBAI30',
        cashbackPoints: 2200,
        expiryDate: in45Days.toISOString().split('T')[0],
        merchantId: 4,
        location: 'Dubai'
      },
      {
        id: 23,
        title: '🏕️ Rishikesh River Rafting',
        description: 'Adventure sports package! Rafting, camping, and bonfire included',
        discount: 25,
        price: 3500,
        category: 'Travel',
        couponCode: 'RISHIKESH25',
        cashbackPoints: 150,
        expiryDate: in20Days.toISOString().split('T')[0],
        merchantId: 4,
        location: 'Rishikesh'
      },
      {
        id: 24,
        title: '🎿 Kashmir Snow Adventure',
        description: 'Skiing, snowboarding, and gondola rides! Winter special package',
        discount: 40,
        price: 22000,
        category: 'Travel',
        couponCode: 'KASHMIR40',
        cashbackPoints: 900,
        expiryDate: in30Days.toISOString().split('T')[0],
        merchantId: 4,
        location: 'Kashmir'
      },
      {
        id: 25,
        title: '📖 Harry Potter Complete Set',
        description: 'All 7 books in hardcover edition! Collector\'s item with special box',
        discount: 45,
        price: 3500,
        category: 'Books',
        couponCode: 'POTTER45',
        cashbackPoints: 180,
        expiryDate: in30Days.toISOString().split('T')[0],
        merchantId: 5,
        location: 'Chennai'
      },
      {
        id: 26,
        title: '📕 NCERT Complete Collection',
        description: 'All subjects for Class 12! Perfect for board exam preparation',
        discount: 30,
        price: 1200,
        category: 'Books',
        couponCode: 'NCERT30',
        cashbackPoints: 60,
        expiryDate: in15Days.toISOString().split('T')[0],
        merchantId: 5,
        location: 'Chennai'
      },
      {
        id: 27,
        title: '📘 Programming Books Bundle',
        description: 'Python, Java, JavaScript books! Essential for developers',
        discount: 40,
        price: 2500,
        category: 'Books',
        couponCode: 'CODING40',
        cashbackPoints: 120,
        expiryDate: in45Days.toISOString().split('T')[0],
        merchantId: 5,
        location: 'Chennai'
      },
      {
        id: 28,
        title: '⌚ Apple Watch Series 9',
        description: 'Fitness tracking, health monitoring! Stay connected on the go',
        discount: 20,
        price: 38900,
        category: 'Electronics',
        couponCode: 'WATCH20',
        cashbackPoints: 1000,
        expiryDate: in20Days.toISOString().split('T')[0],
        merchantId: 1,
        location: 'Mumbai'
      },
      {
        id: 29,
        title: '🎥 Canon DSLR Camera Bundle',
        description: 'Professional photography kit! Camera + 2 lenses + tripod + bag',
        discount: 35,
        price: 55000,
        category: 'Electronics',
        couponCode: 'CANON35',
        cashbackPoints: 2000,
        expiryDate: in30Days.toISOString().split('T')[0],
        merchantId: 1,
        location: 'Mumbai'
      },
      {
        id: 30,
        title: '🖥️ LG 4K Smart TV - 55 inch',
        description: 'Ultra HD display with AI ThinQ! Netflix, Prime Video built-in',
        discount: 30,
        price: 48990,
        category: 'Electronics',
        couponCode: 'LGTV30',
        cashbackPoints: 1600,
        expiryDate: in45Days.toISOString().split('T')[0],
        merchantId: 1,
        location: 'Mumbai'
      },
      {
        id: 31,
        title: '🏃 Adidas Running Shoes',
        description: 'Ultraboost technology! Comfortable for long runs and workouts',
        discount: 50,
        price: 4999,
        category: 'Fashion',
        couponCode: 'ADIDAS50',
        cashbackPoints: 250,
        expiryDate: in10Days.toISOString().split('T')[0],
        merchantId: 2,
        location: 'Delhi'
      },
      {
        id: 32,
        title: '🎒 Wildcraft Backpack - Travel Edition',
        description: '60L capacity with rain cover! Perfect for trekking and travel',
        discount: 40,
        price: 2800,
        category: 'Fashion',
        couponCode: 'WILDCRAFT40',
        cashbackPoints: 140,
        expiryDate: in15Days.toISOString().split('T')[0],
        merchantId: 2,
        location: 'Delhi'
      },
      {
        id: 33,
        title: '🍣 Sushi Platter - Japanese Delight',
        description: '20 pieces assorted sushi! Fresh ingredients, authentic taste',
        discount: 35,
        price: 1200,
        category: 'Food',
        couponCode: 'SUSHI35',
        cashbackPoints: 70,
        expiryDate: in3Days.toISOString().split('T')[0],
        merchantId: 3,
        location: 'Bangalore'
      },
      {
        id: 34,
        title: '🏋️ Gym Membership - Annual Pass',
        description: 'Full year access with personal trainer! All equipment included',
        discount: 40,
        price: 12000,
        category: 'Fitness',
        couponCode: 'GYM40',
        cashbackPoints: 600,
        expiryDate: in30Days.toISOString().split('T')[0],
        merchantId: 6,
        location: 'Mumbai'
      },
      {
        id: 35,
        title: '🧘 Yoga Classes - 3 Month Package',
        description: 'Morning and evening batches! Expert instructors, peaceful environment',
        discount: 30,
        price: 4500,
        category: 'Fitness',
        couponCode: 'YOGA30',
        cashbackPoints: 200,
        expiryDate: in20Days.toISOString().split('T')[0],
        merchantId: 6,
        location: 'Delhi'
      },
      {
        id: 36,
        title: '🎬 Movie Tickets - Weekend Special',
        description: 'Buy 2 get 1 free! Valid for all shows, all movies',
        discount: 33,
        price: 600,
        category: 'Entertainment',
        couponCode: 'MOVIE33',
        cashbackPoints: 45,
        expiryDate: in7Days.toISOString().split('T')[0],
        merchantId: 7,
        location: 'Bangalore'
      },
      {
        id: 37,
        title: '🎪 Amusement Park - Family Pass',
        description: 'Unlimited rides for 4 people! Fun for the whole family',
        discount: 45,
        price: 2500,
        category: 'Entertainment',
        couponCode: 'PARK45',
        cashbackPoints: 150,
        expiryDate: in15Days.toISOString().split('T')[0],
        merchantId: 7,
        location: 'Mumbai'
      },
      {
        id: 38,
        title: '💇 Hair Spa & Styling Package',
        description: 'Complete hair care treatment! Includes cut, color, and spa',
        discount: 50,
        price: 2000,
        category: 'Beauty',
        couponCode: 'HAIR50',
        cashbackPoints: 120,
        expiryDate: in10Days.toISOString().split('T')[0],
        merchantId: 8,
        location: 'Delhi'
      },
      {
        id: 39,
        title: '💅 Manicure & Pedicure Combo',
        description: 'Premium nail care service! Relaxing and rejuvenating',
        discount: 40,
        price: 800,
        category: 'Beauty',
        couponCode: 'NAILS40',
        cashbackPoints: 50,
        expiryDate: in7Days.toISOString().split('T')[0],
        merchantId: 8,
        location: 'Mumbai'
      },
      {
        id: 40,
        title: '🚗 Car Wash & Detailing Service',
        description: 'Interior and exterior cleaning! Make your car shine like new',
        discount: 35,
        price: 1500,
        category: 'Automotive',
        couponCode: 'CARWASH35',
        cashbackPoints: 80,
        expiryDate: in15Days.toISOString().split('T')[0],
        merchantId: 9,
        location: 'Bangalore'
      },
      {
        id: 41,
        title: '🔧 Car Service Package',
        description: 'Complete maintenance check! Oil change, filter replacement included',
        discount: 25,
        price: 3500,
        category: 'Automotive',
        couponCode: 'SERVICE25',
        cashbackPoints: 150,
        expiryDate: in30Days.toISOString().split('T')[0],
        merchantId: 9,
        location: 'Delhi'
      },
      {
        id: 42,
        title: '🏠 Home Cleaning Service',
        description: 'Deep cleaning for 3BHK! Professional team with eco-friendly products',
        discount: 40,
        price: 2500,
        category: 'Home Services',
        couponCode: 'CLEAN40',
        cashbackPoints: 130,
        expiryDate: in10Days.toISOString().split('T')[0],
        merchantId: 10,
        location: 'Mumbai'
      },
      {
        id: 43,
        title: '🔨 Plumbing & Electrical Repair',
        description: 'Expert technicians available! Same day service guaranteed',
        discount: 30,
        price: 1000,
        category: 'Home Services',
        couponCode: 'REPAIR30',
        cashbackPoints: 60,
        expiryDate: in20Days.toISOString().split('T')[0],
        merchantId: 10,
        location: 'Bangalore'
      },
      {
        id: 44,
        title: '🐕 Pet Grooming Package',
        description: 'Bath, haircut, nail trim for dogs! Gentle care for your furry friend',
        discount: 35,
        price: 1200,
        category: 'Pet Care',
        couponCode: 'PET35',
        cashbackPoints: 70,
        expiryDate: in15Days.toISOString().split('T')[0],
        merchantId: 11,
        location: 'Delhi'
      },
      {
        id: 45,
        title: '🐈 Cat Food - Premium Brand',
        description: '5kg pack of nutritious cat food! Healthy and delicious',
        discount: 25,
        price: 1800,
        category: 'Pet Care',
        couponCode: 'CATFOOD25',
        cashbackPoints: 90,
        expiryDate: in30Days.toISOString().split('T')[0],
        merchantId: 11,
        location: 'Mumbai'
      },
      {
        id: 46,
        title: '🌿 Indoor Plants Collection',
        description: '10 air-purifying plants with pots! Perfect for home and office',
        discount: 40,
        price: 2000,
        category: 'Home & Garden',
        couponCode: 'PLANTS40',
        cashbackPoints: 110,
        expiryDate: in10Days.toISOString().split('T')[0],
        merchantId: 12,
        location: 'Bangalore'
      },
      {
        id: 47,
        title: '🪴 Gardening Tools Kit',
        description: 'Complete set of 15 tools! Everything you need for gardening',
        discount: 30,
        price: 1500,
        category: 'Home & Garden',
        couponCode: 'GARDEN30',
        cashbackPoints: 80,
        expiryDate: in20Days.toISOString().split('T')[0],
        merchantId: 12,
        location: 'Delhi'
      },
      {
        id: 48,
        title: '🎨 Art Supplies Bundle',
        description: 'Canvas, paints, brushes, and more! Unleash your creativity',
        discount: 35,
        price: 2500,
        category: 'Hobbies',
        couponCode: 'ART35',
        cashbackPoints: 130,
        expiryDate: in30Days.toISOString().split('T')[0],
        merchantId: 13,
        location: 'Mumbai'
      },
      {
        id: 49,
        title: '🎸 Guitar - Beginner Package',
        description: 'Acoustic guitar with bag and tuner! Start your musical journey',
        discount: 40,
        price: 4500,
        category: 'Hobbies',
        couponCode: 'GUITAR40',
        cashbackPoints: 220,
        expiryDate: in45Days.toISOString().split('T')[0],
        merchantId: 13,
        location: 'Bangalore'
      },
      {
        id: 50,
        title: '🏊 Swimming Pool Membership',
        description: '6 months unlimited access! Olympic size pool with coaching',
        discount: 35,
        price: 8000,
        category: 'Fitness',
        couponCode: 'SWIM35',
        cashbackPoints: 400,
        expiryDate: in20Days.toISOString().split('T')[0],
        merchantId: 6,
        location: 'Delhi'
      },
      {
        id: 51,
        title: '🍷 Wine Tasting Experience',
        description: 'Sample 6 premium wines with cheese platter! Sophisticated evening',
        discount: 30,
        price: 2500,
        category: 'Food',
        couponCode: 'WINE30',
        cashbackPoints: 130,
        expiryDate: in15Days.toISOString().split('T')[0],
        merchantId: 3,
        location: 'Mumbai'
      },
      {
        id: 52,
        title: '🎓 Online Course - Full Stack Development',
        description: '6 month comprehensive program! Learn web development from scratch',
        discount: 50,
        price: 15000,
        category: 'Education',
        couponCode: 'COURSE50',
        cashbackPoints: 800,
        expiryDate: in60Days.toISOString().split('T')[0],
        merchantId: 14,
        location: 'Online'
      }
    ];
  }

  getDealById(id: number): Observable<Deal> {
    return this.http.get<Deal>(`${this.apiUrl}/${id}`);
  }

  getDealsByCategory(category: string): Observable<Deal[]> {
    return this.http.get<Deal[]>(`${this.apiUrl}/category/${category}`);
  }

  getDealsByMerchant(merchantId: number): Observable<Deal[]> {
    return this.http.get<Deal[]>(`${this.apiUrl}/merchant/${merchantId}`);
  }

  createDeal(deal: Deal): Observable<Deal> {
    return this.http.post<Deal>(this.apiUrl, deal);
  }

  updateDeal(id: number, deal: Deal): Observable<Deal> {
    return this.http.put<Deal>(`${this.apiUrl}/${id}`, deal);
  }

  deleteDeal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
