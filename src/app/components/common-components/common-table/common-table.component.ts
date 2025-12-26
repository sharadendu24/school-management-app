import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
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
import { FilterService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';

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
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    MultiSelectModule,
    InputNumberModule,
  ],
  templateUrl: './common-table.component.html',
  styleUrl: './common-table.component.scss',
  providers: [FilterService],
})
export class CommonTableComponent {
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() tableProperties: any = {};
  @Output() eventEmitter = new EventEmitter<any>();
  @ViewChild('dt') dt!: Table;

  loading = false;

  loadData(event: any) {
    const params = {
      first: event.first,
      rows: event.rows,
      sortField: event.sortField,
      sortOrder: event.sortOrder,
      filters: event.filters,
    };
    this.eventEmitter.emit({ type: 'load', data: params });
    console.log(this.columns);
  }

  onGlobalSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.eventEmitter.emit({
      type: 'globalSearch',
      data: { value },
    });
  }

  onColumnFilter(event: any, column: any) {
    this.resetSort();
    this.eventEmitter.emit({
      type: 'columnFilter',
      data: {
        column: column.key,
        value: event.value,
        matchMode: event.matchMode,
      },
    });
  }

  resetSort() {
    this.dt.sortField = '';
    this.dt.sortOrder = 0;
    this.dt._multiSortMeta = [];
    this.dt.sortSingle();
    this.dt.tableService.onSort(null);

    this.eventEmitter.emit({
      type: 'sortReset',
      data: { sortField: '', sortOrder: 0 },
    });
  }

  clearFilters() {
    this.dt.reset();
    this.eventEmitter.emit({ type: 'clearFilters' });
  }
}
