import { Component } from '@angular/core';
import { trigger, transition, style, animate, query, stagger, keyframes } from '@angular/animations';
import { NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.scss'],
  imports: [NgFor, RouterModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideFade', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('0.6s 0.3s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        query('.card', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger('100ms', [
            animate('0.5s ease-out', keyframes([
              style({ opacity: 0, transform: 'translateY(30px)', offset: 0 }),
              style({ opacity: 1, transform: 'translateY(0)', offset: 1 })
            ]))
          ])
        ])
      ])
    ])
  ]
})
export class FrontPageComponent {
  cards = [
    {
      icon: '📚',
      title: 'Academic Excellence',
      content: 'Consistent 100% pass rate with 85% distinction average in national exams'
    },
    {
      icon: '🎓',
      title: 'Track Record',
      content: '1500+ alumni in top universities worldwide since 1995'
    },
    {
      icon: '📞',
      title: 'Contact Us',
      content: 'Email: info@brightfuture.ac | Phone: +1 (555) 123-4567'
    }
  ];
}