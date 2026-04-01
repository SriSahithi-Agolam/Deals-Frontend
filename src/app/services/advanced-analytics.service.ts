import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Analytics {
  userId?: number;
  merchantId?: number;
  date: Date;
  metric: string;
  value: number;
}

export interface UserBehavior {
  userId: number;
  totalViews: number;
  totalClicks: number;
  totalPurchases: number;
  averageOrderValue: number;
  lastActive: Date;
  preferredCategories: string[];
  conversionRate: number;
}

export interface DealPerformance {
  dealId: number;
  title: string;
  views: number;
  clicks: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
  roi: number;
}

export interface RevenueReport {
  period: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topDeals: DealPerformance[];
  topMerchants: any[];
  topCategories: any[];
}

@Injectable({
  providedIn: 'root'
})
export class AdvancedAnalyticsService {
  private analyticsData = new BehaviorSubject<Analytics[]>([]);
  private userBehaviors = new BehaviorSubject<Map<number, UserBehavior>>(new Map());

  constructor() {
    this.loadAnalytics();
  }

  // Track user view
  trackUserView(userId: number, dealId: number, category: string): void {
    this.recordAnalytic({
      userId,
      date: new Date(),
      metric: `view_deal_${dealId}`,
      value: 1
    });
    
    this.updateUserBehavior(userId, 'view', category);
  }

  // Track user click
  trackUserClick(userId: number, dealId: number): void {
    this.recordAnalytic({
      userId,
      date: new Date(),
      metric: `click_deal_${dealId}`,
      value: 1
    });
    
    this.updateUserBehavior(userId, 'click', '');
  }

  // Track purchase
  trackPurchase(userId: number, dealId: number, amount: number, category: string): void {
    this.recordAnalytic({
      userId,
      date: new Date(),
      metric: `purchase_deal_${dealId}`,
      value: amount
    });
    
    this.updateUserBehavior(userId, 'purchase', category, amount);
  }

  // Get user behavior analytics
  getUserBehavior(userId: number): UserBehavior | undefined {
    return this.userBehaviors.value.get(userId);
  }

  // Get deal performance
  getDealPerformance(dealId: number, deals: any[]): DealPerformance {
    const analytics = this.analyticsData.value;
    const deal = deals.find(d => d.id === dealId);
    
    const views = analytics.filter(a => a.metric === `view_deal_${dealId}`).length;
    const clicks = analytics.filter(a => a.metric === `click_deal_${dealId}`).length;
    const conversions = analytics.filter(a => a.metric === `purchase_deal_${dealId}`).length;
    const revenue = analytics
      .filter(a => a.metric === `purchase_deal_${dealId}`)
      .reduce((sum, a) => sum + a.value, 0);
    
    const conversionRate = views > 0 ? (conversions / views) * 100 : 0;
    const roi = revenue > 0 ? ((revenue - (revenue * 0.05)) / revenue) * 100 : 0; // Assuming 5% commission
    
    return {
      dealId,
      title: deal?.title || 'Unknown Deal',
      views,
      clicks,
      conversions,
      revenue,
      conversionRate,
      roi
    };
  }

  // Generate revenue report
  generateRevenueReport(period: 'daily' | 'weekly' | 'monthly', deals: any[]): RevenueReport {
    const analytics = this.analyticsData.value;
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case 'daily':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'weekly':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        startDate.setMonth(now.getMonth() - 1);
        break;
    }
    
    const periodAnalytics = analytics.filter(a => 
      new Date(a.date) >= startDate && new Date(a.date) <= now
    );
    
    const purchases = periodAnalytics.filter(a => a.metric.includes('purchase'));
    const totalRevenue = purchases.reduce((sum, a) => sum + a.value, 0);
    const totalOrders = purchases.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Get top deals
    const dealPerformances = deals.map(d => this.getDealPerformance(d.id, deals));
    const topDeals = dealPerformances
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    // Get top merchants
    const topMerchants = this.getTopMerchants(deals, dealPerformances);
    
    // Get top categories
    const topCategories = this.getTopCategories(deals, dealPerformances);
    
    return {
      period,
      startDate,
      endDate: now,
      totalRevenue,
      totalOrders,
      averageOrderValue,
      topDeals,
      topMerchants,
      topCategories
    };
  }

  // Get user cohort analysis
  getCohortAnalysis(): Map<string, number> {
    const cohorts = new Map<string, number>();
    const behaviors = this.userBehaviors.value;
    
    behaviors.forEach(behavior => {
      const conversionRate = behavior.conversionRate;
      let cohort = 'Low Engagement';
      
      if (conversionRate > 20) cohort = 'High Engagement';
      else if (conversionRate > 10) cohort = 'Medium Engagement';
      
      cohorts.set(cohort, (cohorts.get(cohort) || 0) + 1);
    });
    
    return cohorts;
  }

  // Get funnel analysis
  getFunnelAnalysis(): any {
    const analytics = this.analyticsData.value;
    
    const views = analytics.filter(a => a.metric.includes('view')).length;
    const clicks = analytics.filter(a => a.metric.includes('click')).length;
    const purchases = analytics.filter(a => a.metric.includes('purchase')).length;
    
    return {
      views,
      clicks,
      purchases,
      viewToClickRate: views > 0 ? (clicks / views) * 100 : 0,
      clickToPurchaseRate: clicks > 0 ? (purchases / clicks) * 100 : 0,
      viewToPurchaseRate: views > 0 ? (purchases / views) * 100 : 0
    };
  }

  // Get trending deals
  getTrendingDeals(deals: any[], limit: number = 5): DealPerformance[] {
    const dealPerformances = deals.map(d => this.getDealPerformance(d.id, deals));
    return dealPerformances
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, limit);
  }

  // Get user retention
  getUserRetention(): number {
    const behaviors = this.userBehaviors.value;
    let retainedUsers = 0;
    
    behaviors.forEach(behavior => {
      const daysSinceActive = (Date.now() - new Date(behavior.lastActive).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceActive <= 30) {
        retainedUsers++;
      }
    });
    
    return behaviors.size > 0 ? (retainedUsers / behaviors.size) * 100 : 0;
  }

  private recordAnalytic(analytic: Analytics): void {
    const current = this.analyticsData.value;
    current.push(analytic);
    this.analyticsData.next(current);
    this.saveAnalytics();
  }

  private updateUserBehavior(userId: number, action: string, category: string, amount: number = 0): void {
    const behaviors = this.userBehaviors.value;
    let behavior = behaviors.get(userId);
    
    if (!behavior) {
      behavior = {
        userId,
        totalViews: 0,
        totalClicks: 0,
        totalPurchases: 0,
        averageOrderValue: 0,
        lastActive: new Date(),
        preferredCategories: [],
        conversionRate: 0
      };
    }
    
    behavior.lastActive = new Date();
    
    switch (action) {
      case 'view':
        behavior.totalViews++;
        if (category && !behavior.preferredCategories.includes(category)) {
          behavior.preferredCategories.push(category);
        }
        break;
      case 'click':
        behavior.totalClicks++;
        break;
      case 'purchase':
        behavior.totalPurchases++;
        behavior.averageOrderValue = (behavior.averageOrderValue * (behavior.totalPurchases - 1) + amount) / behavior.totalPurchases;
        break;
    }
    
    behavior.conversionRate = behavior.totalViews > 0 
      ? (behavior.totalPurchases / behavior.totalViews) * 100 
      : 0;
    
    behaviors.set(userId, behavior);
    this.userBehaviors.next(behaviors);
    this.saveBehaviors();
  }

  private getTopMerchants(deals: any[], performances: DealPerformance[]): any[] {
    const merchantMap = new Map<number, any>();
    
    performances.forEach(perf => {
      const deal = deals.find(d => d.id === perf.dealId);
      if (deal) {
        const merchant = merchantMap.get(deal.merchantId) || { merchantId: deal.merchantId, revenue: 0, deals: 0 };
        merchant.revenue += perf.revenue;
        merchant.deals++;
        merchantMap.set(deal.merchantId, merchant);
      }
    });
    
    return Array.from(merchantMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }

  private getTopCategories(deals: any[], performances: DealPerformance[]): any[] {
    const categoryMap = new Map<string, any>();
    
    performances.forEach(perf => {
      const deal = deals.find(d => d.id === perf.dealId);
      if (deal) {
        const category = categoryMap.get(deal.category) || { category: deal.category, revenue: 0, deals: 0 };
        category.revenue += perf.revenue;
        category.deals++;
        categoryMap.set(deal.category, category);
      }
    });
    
    return Array.from(categoryMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }

  private saveAnalytics(): void {
    localStorage.setItem('analytics', JSON.stringify(this.analyticsData.value));
  }

  private saveBehaviors(): void {
    const behaviors = this.userBehaviors.value;
    const data = Array.from(behaviors.entries());
    localStorage.setItem('userBehaviors', JSON.stringify(data));
  }

  private loadAnalytics(): void {
    const saved = localStorage.getItem('analytics');
    if (saved) {
      this.analyticsData.next(JSON.parse(saved));
    }
  }
}
