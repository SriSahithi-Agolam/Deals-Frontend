import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoyaltyAccount {
  userId: number;
  totalPoints: number;
  pointsHistory: PointsTransaction[];
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  tierBenefits: TierBenefit[];
}

export interface PointsTransaction {
  id: string;
  type: 'earn' | 'redeem' | 'bonus' | 'expire';
  points: number;
  description: string;
  date: Date;
  expiryDate?: Date;
}

export interface TierBenefit {
  tier: string;
  minPoints: number;
  benefits: string[];
  discountPercentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoyaltyPointsService {
  private loyaltyAccounts = new BehaviorSubject<Map<number, LoyaltyAccount>>(new Map());
  private tierBenefits: TierBenefit[] = [
    {
      tier: 'bronze',
      minPoints: 0,
      benefits: ['1% cashback', 'Birthday bonus'],
      discountPercentage: 1
    },
    {
      tier: 'silver',
      minPoints: 1000,
      benefits: ['2% cashback', 'Free shipping', 'Priority support'],
      discountPercentage: 2
    },
    {
      tier: 'gold',
      minPoints: 5000,
      benefits: ['3% cashback', 'Free shipping', 'Priority support', 'Exclusive deals'],
      discountPercentage: 3
    },
    {
      tier: 'platinum',
      minPoints: 10000,
      benefits: ['5% cashback', 'Free shipping', 'VIP support', 'Exclusive deals', 'Early access'],
      discountPercentage: 5
    }
  ];

  constructor() {
    this.loadLoyaltyAccounts();
  }

  // Earn points on purchase
  earnPointsOnPurchase(userId: number, amount: number): number {
    const points = Math.floor(amount / 10); // 1 point per ₹10 spent
    this.addPoints(userId, points, `Purchase reward - ₹${amount}`);
    return points;
  }

  // Earn bonus points
  earnBonusPoints(userId: number, points: number, reason: string): void {
    this.addPoints(userId, points, `Bonus: ${reason}`);
  }

  // Redeem points
  redeemPoints(userId: number, points: number, description: string): boolean {
    const account = this.getOrCreateAccount(userId);
    
    if (account.totalPoints >= points) {
      account.totalPoints -= points;
      account.pointsHistory.push({
        id: Date.now().toString(),
        type: 'redeem',
        points: -points,
        description: description,
        date: new Date()
      });
      
      this.updateAccount(userId, account);
      return true;
    }
    
    return false;
  }

  // Get user tier
  getUserTier(userId: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
    const account = this.getOrCreateAccount(userId);
    
    for (let i = this.tierBenefits.length - 1; i >= 0; i--) {
      if (account.totalPoints >= this.tierBenefits[i].minPoints) {
        return this.tierBenefits[i].tier as any;
      }
    }
    
    return 'bronze';
  }

  // Get tier benefits
  getTierBenefits(tier: string): TierBenefit | undefined {
    return this.tierBenefits.find(b => b.tier === tier);
  }

  // Get loyalty account
  getLoyaltyAccount(userId: number): Observable<LoyaltyAccount> {
    const account = this.getOrCreateAccount(userId);
    return new BehaviorSubject(account).asObservable();
  }

  // Get points history
  getPointsHistory(userId: number): PointsTransaction[] {
    const account = this.getOrCreateAccount(userId);
    return account.pointsHistory;
  }

  // Get available points
  getAvailablePoints(userId: number): number {
    const account = this.getOrCreateAccount(userId);
    return account.totalPoints;
  }

  // Get discount percentage based on tier
  getDiscountPercentage(userId: number): number {
    const tier = this.getUserTier(userId);
    const benefit = this.tierBenefits.find(b => b.tier === tier);
    return benefit?.discountPercentage || 0;
  }

  // Check if user has specific benefit
  hasBenefit(userId: number, benefit: string): boolean {
    const tier = this.getUserTier(userId);
    const tierBenefit = this.tierBenefits.find(b => b.tier === tier);
    return tierBenefit?.benefits.includes(benefit) || false;
  }

  // Expire old points (older than 1 year)
  expireOldPoints(userId: number): void {
    const account = this.getOrCreateAccount(userId);
    const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    
    const expiredPoints = account.pointsHistory
      .filter(t => t.type === 'earn' && t.date < oneYearAgo && !t.expiryDate)
      .reduce((sum, t) => sum + t.points, 0);
    
    if (expiredPoints > 0) {
      account.totalPoints -= expiredPoints;
      account.pointsHistory.push({
        id: Date.now().toString(),
        type: 'expire',
        points: -expiredPoints,
        description: 'Points expired (older than 1 year)',
        date: new Date()
      });
      
      this.updateAccount(userId, account);
    }
  }

  // Get points to next tier
  getPointsToNextTier(userId: number): number {
    const account = this.getOrCreateAccount(userId);
    const currentTier = this.getUserTier(userId);
    
    const nextTier = this.tierBenefits.find(b => 
      this.tierBenefits.indexOf(b) > this.tierBenefits.findIndex(t => t.tier === currentTier)
    );
    
    if (nextTier) {
      return Math.max(0, nextTier.minPoints - account.totalPoints);
    }
    
    return 0;
  }

  private addPoints(userId: number, points: number, description: string): void {
    const account = this.getOrCreateAccount(userId);
    account.totalPoints += points;
    
    account.pointsHistory.push({
      id: Date.now().toString(),
      type: 'earn',
      points: points,
      description: description,
      date: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
    });
    
    this.updateAccount(userId, account);
  }

  private getOrCreateAccount(userId: number): LoyaltyAccount {
    const accounts = this.loyaltyAccounts.value;
    
    if (!accounts.has(userId)) {
      accounts.set(userId, {
        userId,
        totalPoints: 0,
        pointsHistory: [],
        tier: 'bronze',
        tierBenefits: this.tierBenefits
      });
    }
    
    return accounts.get(userId)!;
  }

  private updateAccount(userId: number, account: LoyaltyAccount): void {
    const accounts = this.loyaltyAccounts.value;
    accounts.set(userId, account);
    this.loyaltyAccounts.next(accounts);
    this.saveLoyaltyAccounts();
  }

  private saveLoyaltyAccounts(): void {
    const accounts = this.loyaltyAccounts.value;
    const data = Array.from(accounts.entries());
    localStorage.setItem('loyaltyAccounts', JSON.stringify(data));
  }

  private loadLoyaltyAccounts(): void {
    const saved = localStorage.getItem('loyaltyAccounts');
    if (saved) {
      const data = JSON.parse(saved) as Array<[number, LoyaltyAccount]>;
      const accounts = new Map<number, LoyaltyAccount>(data);
      this.loyaltyAccounts.next(accounts);
    }
  }
}
