import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from './payment/payment.component';
import { MembershipComponent } from './membership/membership.component';
import { PurchaseComponent } from './purchase/purchase.component';
const routes: Routes = [
  {path: 'purchase', component:PurchaseComponent},
  {path: 'payment', component:PaymentComponent},
  {path: 'membership', component:MembershipComponent},
  {path: '',redirectTo:'/purchase',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
