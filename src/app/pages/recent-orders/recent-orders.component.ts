import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormatPricePipe } from '../../pipes/format-price/format-price.pipe';
import { DateFormatPipe } from '../../pipes/date-format/date-format.pipe';
import { MatCardModule } from '@angular/material/card';
import { RecentOrdersModel } from '../../models/recent-orders-model';
import { AuthService } from '../../services/auth/auth.service';
import { RecentOrdersService } from '../../services/recent-orders/recent-orders.service';

@Component({
  selector: 'app-recent-orders',
  imports: [NgFor, NgIf, FormatPricePipe, DateFormatPipe, MatCardModule],
  templateUrl: './recent-orders.component.html',
  styleUrl: './recent-orders.component.scss'
})
export class RecentOrdersComponent implements OnInit {
  recentOrders: RecentOrdersModel[] = [];
  userId: string | null = null;
  hasOrders: boolean = false;

  constructor(
    private authService: AuthService, 
    private recentOrderService: RecentOrdersService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    return this.authService.getUserId().then((userId) => {
      this.userId = userId;
      if (!this.userId) {
        return;
      }

      this.recentOrderService.getRecentOrders(this.userId).then((recentOrders) => {
        if (!recentOrders || recentOrders.length === 0) {
          this.hasOrders = false;
          return;
        }

        this.recentOrders = recentOrders;
        this.hasOrders = this.recentOrders.length > 0;

      });
    });
  }
}