import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div 
        *ngFor="let toast of toasts" 
        class="toast"
        [ngClass]="'toast-' + toast.type"
        (click)="removeToast(toast.id)"
      >
        <div class="toast-icon">
          <span *ngIf="toast.type === 'success'">✅</span>
          <span *ngIf="toast.type === 'error'">❌</span>
          <span *ngIf="toast.type === 'info'">ℹ️</span>
          <span *ngIf="toast.type === 'warning'">⚠️</span>
        </div>
        <div class="toast-message">{{ toast.message }}</div>
        <div class="toast-close">×</div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      animation: slideIn 0.3s ease-out;
      min-width: 300px;
      max-width: 400px;
    }

    .toast-success {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
    }

    .toast-error {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }

    .toast-info {
      background: #d1ecf1;
      border: 1px solid #bee5eb;
      color: #0c5460;
    }

    .toast-warning {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      color: #856404;
    }

    .toast-icon {
      font-size: 1.2em;
    }

    .toast-message {
      flex: 1;
      font-weight: 500;
    }

    .toast-close {
      font-size: 1.5em;
      font-weight: bold;
      opacity: 0.7;
    }

    .toast:hover .toast-close {
      opacity: 1;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 480px) {
      .toast-container {
        left: 10px;
        right: 10px;
        top: 10px;
      }
      
      .toast {
        min-width: auto;
      }
    }
  `]
})
export class ToastComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  removeToast(id: number): void {
    this.toastService.remove(id);
  }
}