import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ModalConfig {
  title: string;
  content: string;
  type: 'confirm' | 'form' | 'info' | 'error';
  data?: any;
  buttons?: { label: string; action: string; style?: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalSubject = new BehaviorSubject<ModalConfig | null>(null);
  public modal$ = this.modalSubject.asObservable();

  private resultSubject = new BehaviorSubject<any>(null);
  public result$ = this.resultSubject.asObservable();

  open(config: ModalConfig): void {
    this.modalSubject.next(config);
  }

  close(): void {
    this.modalSubject.next(null);
  }

  confirm(title: string, message: string): Observable<boolean> {
    return new Observable(observer => {
      this.open({
        title,
        content: message,
        type: 'confirm',
        buttons: [
          { label: 'Cancel', action: 'cancel', style: 'secondary' },
          { label: 'Confirm', action: 'confirm', style: 'primary' }
        ]
      });

      const subscription = this.result$.subscribe(result => {
        if (result?.action === 'confirm') {
          observer.next(true);
          observer.complete();
          subscription.unsubscribe();
        } else if (result?.action === 'cancel') {
          observer.next(false);
          observer.complete();
          subscription.unsubscribe();
        }
      });
    });
  }

  showForm(title: string, fields: any[]): Observable<any> {
    return new Observable(observer => {
      this.open({
        title,
        content: '',
        type: 'form',
        data: { fields },
        buttons: [
          { label: 'Cancel', action: 'cancel', style: 'secondary' },
          { label: 'Submit', action: 'submit', style: 'primary' }
        ]
      });

      const subscription = this.result$.subscribe(result => {
        if (result?.action === 'submit') {
          observer.next(result.data);
          observer.complete();
          subscription.unsubscribe();
        } else if (result?.action === 'cancel') {
          observer.next(null);
          observer.complete();
          subscription.unsubscribe();
        }
      });
    });
  }

  submitResult(action: string, data?: any): void {
    this.resultSubject.next({ action, data });
  }
}
