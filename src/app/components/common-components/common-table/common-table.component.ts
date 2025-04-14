import { Component, Input } from '@angular/core';
import { Table } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ProgressBar } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-common-table',
  standalone: true,
  imports: [
    DropdownModule,
    InputTextModule,
    TagModule,
    TableModule,
    CommonModule,
    InputTextModule,
    TagModule,
    SelectModule,
    MultiSelectModule,
    ProgressBar,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    
  ],
  templateUrl: './common-table.component.html',
  styleUrl: './common-table.component.scss',
})
export class CommonTableComponent {
    @Input() data: any;
    @Input() columns:any
    @Input() tableProperties: any;
    selectedData:any
    loading:any
    searchValue:string=""
    statuses:any;
  

  constructor() {}

  ngOnInit() {
    console.log("common-table has been displayed.")
  }

  clear(){}
}

