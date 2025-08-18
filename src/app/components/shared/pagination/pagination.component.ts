import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnChanges {
  @Input() totalRecords: number = 0;
  @Input() pageSize: number = 10;
  @Input() currentPageNumber: number = 0;
  @Input() showTotalRecords: boolean = true;
  @Input() showPageSizeSelector: boolean = true;
  @Input() showPagination: boolean = true;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  @Output() paginationChange = new EventEmitter<{ page: number; size: number }>();

  pageSizes: number[] = [10, 20, 50, 100];
  pages: number[] = [];
  totalPages: number = 0;
  currentPageSize: number = 10;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pageSize']) {
      this.currentPageSize = this.pageSize;
    }
    this.calculatePages();
  }

  calculatePages(): void {
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.pages = [];

    if (this.totalPages > 1) {
      if (this.totalPages <= 5) {
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
      } else {
        this.pages = [0];
        if (this.currentPageNumber > 2) this.pages.push(-1);

        const startPage = Math.max(1, this.currentPageNumber - 1);
        const endPage = Math.min(this.totalPages - 2, this.currentPageNumber + 1);

        for (let i = startPage; i <= endPage; i++) {
          this.pages.push(i);
        }

        if (this.currentPageNumber < this.totalPages - 3) this.pages.push(-1);
        this.pages.push(this.totalPages - 1);
      }
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPageNumber = page;
      this.pageChange.emit(this.currentPageNumber);
      this.emitCombinedChange();
      this.calculatePages();
    }
  }

  onPageSizeChange(event: any): void {
    const newSize = Number(event.target.value);

    if (!Number.isFinite(newSize) || newSize <= 0 || newSize === this.pageSize) return;

    this.pageSize = newSize;
    this.currentPageSize = newSize;
    this.currentPageNumber = 0;

    this.pageSizeChange.emit(this.pageSize);
    this.emitCombinedChange();
    this.calculatePages();
  }

  onKeydown(event: KeyboardEvent, page: number): void {
    if (event.key === 'Enter') {
      this.goToPage(page);
    }
  }

  private emitCombinedChange(): void {
    this.paginationChange.emit({
      page: this.currentPageNumber,
      size: this.pageSize,
    });
  }
}
