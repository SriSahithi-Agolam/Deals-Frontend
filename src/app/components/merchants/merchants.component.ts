import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MerchantService } from '../../services/merchant.service';
import { Merchant } from '../../models/merchant.model';

@Component({
  selector: 'app-merchants',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './merchants.component.html',
  styleUrls: ['./merchants.component.css']
})
export class MerchantsComponent implements OnInit {
  merchants: Merchant[] = [];
  loading = true;

  constructor(private merchantService: MerchantService) {}

  ngOnInit(): void {
    this.merchantService.getAllMerchants().subscribe({
      next: (data) => {
        this.merchants = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading merchants', err);
        this.loading = false;
      }
    });
  }
}
