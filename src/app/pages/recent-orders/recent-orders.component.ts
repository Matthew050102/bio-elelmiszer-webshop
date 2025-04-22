import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormatPricePipe } from '../../pipes/format-price/format-price.pipe';
import { DateFormatPipe } from '../../pipes/date-format/date-format.pipe';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-recent-orders',
  imports: [NgFor, NgIf, FormatPricePipe, DateFormatPipe, MatCardModule],
  templateUrl: './recent-orders.component.html',
  styleUrl: './recent-orders.component.scss'
})

export class RecentOrdersComponent {
  orders = [
    {
      date: '2025-04-01T10:30:00',
      totalPrice: 8999,
      items: [
        { name: 'BIO Zabpehely', price: 2666, quantity: 2 },
        { name: 'BIO Mandulavaj', price: 3667, quantity: 1 }
      ]
    },
    {
      date: '2025-03-28T15:45:00',
      totalPrice: 4999,
      items: [
        { name: 'Organikus Chia mag', price: 2499, quantity: 2 }
      ]
    },
    {
      date: '2025-02-20T12:00:00',
      totalPrice: 2999,
      items: [
        { name: 'Gluténmentes Quinoa', price: 2999, quantity: 1 }
      ]
    }
  ];
}
