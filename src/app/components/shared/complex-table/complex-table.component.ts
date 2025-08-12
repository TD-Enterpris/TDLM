import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  SimpleChanges,
  OnChanges,
  AfterViewInit,
  OnDestroy,
  TemplateRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  HostListener,
  Renderer2,
  NgZone,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule, NgForOf, NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import gsap from 'gsap';
import { SelectDropdownComponent } from '../select-dropdown/select-dropdown.component';
import { PopoverComponent } from '../popover/popover.component';
import { InputLegacyComponent } from '../input-legacy/input-legacy.component';
import { DropdownLegacyComponent } from '../dropdown-legacy/dropdown-legacy.component';
import { ChipComponent } from '../chip/chip.component';

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}
export enum TableAction {
  ROW_CLICK = 'rowClick',
  REQUEST_XML = 'request-xml',
  EDIT = 'edit',
  CANCEL = 'cancel',
  SAVE = 'save',
  DELETE = 'delete',
  ADD_SAVE = 'add-save',
  EDIT_SAVE = 'edit-save',
}
export interface ButtonConfig {
  label?: string;
  action: string;
  title?: string;
  imageIcon?: string;
  spanIcon?: string;
  icon?: string;
  modalTarget?: string;
  showLabel?: boolean;
  showImageIcon?: boolean;
  showSpanIcon?: boolean;
  tabindex?: number;
}
export interface TableRow {
  id?: string | number;
  expanded?: boolean;
  visibleExpanded?: boolean;
  [key: string]: any;
}
export interface ColumnConfig {
  type: 'text' | 'button' | 'buttons' | 'select' | 'chip';
  label?: string;
  action?: string;
  title?: string;
  imageIcon?: string;
  spanIcon?: string;
  icon?: string;
  labelTemplate?: TemplateRef<any>;
  buttons?: ButtonConfig[] | ((row: TableRow, index: number) => ButtonConfig[]);
  modalTarget?: string;
  showLabel?: boolean;
  showImageIcon?: boolean;
  showSpanIcon?: boolean;
  options?: { value: string; label: string }[];
  filterable?: boolean;
  filterOptions?: { value: string; label: string }[];
  currentFilterValues?: string[];
  classFn?: (row: TableRow) => string;
}
@Component({
  selector: 'app-complex-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    NgForOf,
    NgIf,
    NgClass,
    SelectDropdownComponent,
    PopoverComponent,
    InputLegacyComponent,
    DropdownLegacyComponent,
    ChipComponent,
  ],
  templateUrl: './complex-table.component.html',
  styleUrls: ['./complex-table.component.css'],
})
export class ComplexTableComponent implements OnChanges, AfterViewInit, OnDestroy {
  private readonly UI_UPDATE_DELAY_SHORT_MS = 50;
  private readonly UI_UPDATE_DELAY_LONG_MS = 100;
  private readonly SCROLL_INTERVAL_MS = 300;
  private readonly SCROLL_ANIMATION_DURATION_S = 0.4;
  private readonly SCROLL_THRESHOLD_PX = 1;

  constructor(
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private ngZone: NgZone
  ) {}

  onDocumentClick = (event: MouseEvent) => {};
  private globalClickUnlistener?: () => void;
  private _data: TableRow[] = [];
  private focusOnNewRow = false;
  @Input() focusedRowId: string | number | null = null;
  @Input() focusedColKey: string | null = null;
  @Input() config?: { excludeColumns?: string[] };
  @Input() defaultSelectedColumns: string[] = [];
  @Input() pageSize!: number;
  @Input() currentPageNumber = 0;
  @Input() columnConfig: Record<string, ColumnConfig> = {};
  @Input() enableCheckbox = false;
  @Input() selectedRows: Set<TableRow> = new Set();
  @Input() showDdsButton = false;
  @Input() showAddButton = false;
  @Input() rowClickable = true;
  @Input() ddsDisabled = false;
  @Input() getModalIdFn: (row: TableRow) => string = () => '';
  @Input() serverSidePagination = false;
  @Input() editableColumns: string[] = [];
  @Input() editableRowIds: Set<string | number> = new Set();
  @Input() validateRowFn?: (row: TableRow) => { [key: string]: string } | null;
  @Input() validationRequiredFields: string[] = [];
  @Input() showFilterColumns: boolean = true;
  @Input() validationErrorMessages: {
    fixErrors: string;
    noDataAvailable: string;
  } = {
    fixErrors: 'Please fill in all highlighted fields.',
    noDataAvailable: 'No data available.',
  };
  @Input() showDropdownFilter = false;
  @Input() dropdownOptions: { value: string; label: string }[] = [];
  @Input() selectedDropdownValue: string = '';
  @Input() showExpandCollapse: boolean = false;
  @Input() expandedRowTemplate: TemplateRef<any> | null = null;
  @Input() useIcons: boolean = true;
  @Input() toggleText: string = 'Details';
  @Input() title!: string;
  @Input() titleLevel: 'h1' | 'h2' | 'h3' = 'h2';
  @Input() titleClass: string = '';
  @Input() sortState: { column: string; direction: SortDirection } = {
    column: '',
    direction: SortDirection.ASC,
  };
  @Input() isAddingMode: boolean = false;

  @Output() dropdownValueChange = new EventEmitter<string>();
  @Output() rowEdited = new EventEmitter<TableRow>();
  @Output() editCancelled = new EventEmitter<{ row: TableRow }>();
  @Output() ddsClicked = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<Set<TableRow>>();
  @Output() actionTriggered = new EventEmitter<{ action: string; row: TableRow }>();
  @Output() sortChanged = new EventEmitter<{
    column: string;
    direction: SortDirection;
  }>();
  @Output() reloadRequested = new EventEmitter<void>();
  @Output() requestXml = new EventEmitter<TableRow>();
  @Output() rowDeleted = new EventEmitter<TableRow>();
  @Output() addClicked = new EventEmitter<void>();
  @Output() searchClicked = new EventEmitter<void>();
  @Output() rowValidationFailed = new EventEmitter<string>();
  @Output() cellValueChanged = new EventEmitter<{
    rowId: string;
    column: string;
    newValue: string;
  }>();
  @Output() inputChanged = new EventEmitter<void>();
  @Output() columnFilterChanged = new EventEmitter<{ [key: string]: string[] }>();
  @Input() idProperty: string = 'id';

  @Input() set data(value: TableRow[]) {
    const newData = value || [];
    this._data = newData.map((row) => ({
      ...row,
      expanded: row.expanded || false,
      visibleExpanded: row.visibleExpanded || false,
    }));
    this.editedRow = {};
    for (const row of this._data) {
      const rowId = row[this.idProperty];
      if (rowId != null) {
        this.editedRow[rowId] = { ...row };
      }
    }
    this.updatePagedData();
    this.initializeColumns();
    this.initializeColumnDataFilterOptions();
    this.safeMarkForCheck();
  }
  get data(): TableRow[] {
    return this._data;
  }

  pagedData: TableRow[] = [];
  allColumns: string[] = [];
  checkboxOptions: { label: string; checked: boolean }[] = [];
  columnWidth: number = 0;
  isScrollVisible = false;
  scrollHoldInterval: any;
  private mutationObserver?: MutationObserver;
  private scrollDebounceTimer?: any;
  editedRow: { [id: string]: TableRow } = {};
  visibleColumns: string[] = [];
  openDropdownIndex: number | null = null;
  openColumnDataFilterDropdownCol: string | null = null;

  @ViewChild('dropdownMenu') dropdownMenuRef!: ElementRef<HTMLDivElement>;
  @ViewChild('dropdownMenuToggle')
  dropdownToggleRef!: ElementRef<HTMLButtonElement>;
  @ViewChild('tableContainer') tableContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('firstColumnCell', { read: ElementRef })
  columnCellRef!: ElementRef<HTMLElement>;
  validationErrors: { [rowId: string]: { [colKey: string]: string } } = {};
  validationTriggered = false;
  @ViewChild('selectAllCheckbox')
  selectAllCheckbox!: ElementRef<HTMLInputElement>;
  @ViewChild('textPopover', { static: false }) textPopover!: PopoverComponent;
  public fullTextForPopover: string = '';
  private activePopoverElement: HTMLElement | null = null;
  @ViewChildren('columnDataFilterDropdownMenu')
  columnDataFilterDropdownMenus!: QueryList<ElementRef<HTMLUListElement>>;
  @ViewChildren('expandedRow') expandedRows!: QueryList<ElementRef>;
  @ViewChildren('editableInput') editableInputs!: QueryList<ElementRef>;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['defaultSelectedColumns']) {
      this.initializeColumns();
      this.updatePagedData();
      this.checkScrollVisibility();
      this.initializeColumnDataFilterOptions();
      if (changes['data'] && this.focusOnNewRow) {
        setTimeout(() => {
          this.focusFirstEditableCellOfNewRow();
          this.focusOnNewRow = false;
        }, 0);
      }
    }
    if (changes['showFilterColumns']) {
      setTimeout(() => {
        this.checkScrollVisibility();
      }, this.UI_UPDATE_DELAY_SHORT_MS);
    }
  }

  ngAfterViewChecked() {
    if (this.focusedRowId && this.focusedColKey) {
      const el = document.getElementById(
        `${this.focusedColKey}-${this.focusedRowId}`
      );
      if (el) {
        el.focus();
        this.focusedRowId = null;
        this.focusedColKey = null;
      }
    }
  }

  ngAfterViewInit(): void {
    this.observeTableChanges();
    this.checkScrollVisibility();
    this.globalClickUnlistener = this.renderer.listen(
      'document',
      'click',
      (event: MouseEvent) => {
        this.handleDocumentClickForColumnDataFilters(event);
      }
    );
  }

  ngOnDestroy() {
    this.globalClickUnlistener?.();
    this.mutationObserver?.disconnect();
    this.textPopover?.dispose();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClickOutside(event: MouseEvent) {
    if (this.openDropdownIndex !== null) {
      const targetElement = event.target as HTMLElement;
      const isClickedInsideColumnVisibilityDropdown =
        this.dropdownMenuRef?.nativeElement?.contains(targetElement) ||
        this.dropdownToggleRef?.nativeElement?.contains(targetElement);
      if (!isClickedInsideColumnVisibilityDropdown) {
        this.openDropdownIndex = null;
        this.safeMarkForCheck();
      }
    }
  }

  private handleDocumentClickForColumnDataFilters(event: MouseEvent): void {
    if (this.openColumnDataFilterDropdownCol !== null) {
      const clickedElement = event.target as HTMLElement;
      let isInsideAnyColumnDataFilterDropdown = false;
      this.columnDataFilterDropdownMenus.forEach((dropdownElRef) => {
        const dropdownMenu = dropdownElRef.nativeElement;
        const toggleButton =
          dropdownMenu.parentElement?.querySelector('.td-action-chip-icon');
        if (
          dropdownMenu.contains(clickedElement) ||
          (toggleButton && toggleButton.contains(clickedElement))
        ) {
          isInsideAnyColumnDataFilterDropdown = true;
          return;
        }
      });
      if (!isInsideAnyColumnDataFilterDropdown) {
        this.openColumnDataFilterDropdownCol = null;
        this.safeMarkForCheck();
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.setColumnWidth();
    this.checkScrollVisibility();
  }

  toggleRow(index: number): void {
    const row = this.pagedData[index];
    if (!row) return;
    if (row.expanded) {
      const el = this.expandedRows.get(index)?.nativeElement;
      if (!el) return;
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          row.visibleExpanded = false;
          row.expanded = false;
          this.safeMarkForCheck();
        },
      });
    } else {
      row.visibleExpanded = true;
      this.safeMarkForCheck();
      setTimeout(() => {
        const el = this.expandedRows.get(index)?.nativeElement;
        if (!el) return;
        const expandedHeight = el.scrollHeight;
        gsap.fromTo(
          el,
          { height: 0, opacity: 0 },
          {
            height: expandedHeight,
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
              gsap.set(el, { height: 'auto' });
              row.expanded = true;
              this.safeMarkForCheck();
            },
          }
        );
      });
    }
  }

  public formatValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    const stringValue = String(value);
    return stringValue
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, (str) => str.toUpperCase());
  }

  getOptionLabel(col: string, value: any): string {
    const config = this.columnConfig[col];
    if (config && config.options) {
      const option = config.options.find(opt => opt.value === value);
      return option ? option.label : String(value || '');
    }
    return String(value || '');
  }

  getAppliedColumnDataFilterLabel(colKey: string): string {
    const columnConfig = this.columnConfig[colKey];
    if (
      !columnConfig?.filterOptions ||
      !columnConfig.currentFilterValues?.length
    ) {
      return '';
    }
    const selectedLabels = columnConfig.currentFilterValues.map((value) => {
      const match = columnConfig.filterOptions!.find(
        (opt) => opt.value === value
      );
      return match?.label || value;
    });
    return selectedLabels.join(', ');
  }

  showPopoverIfOverflow(event: MouseEvent, fullText: string): void {
    const hostElement = event.currentTarget as HTMLElement;
    if (!hostElement || !fullText) return;
    if (
      this.activePopoverElement === hostElement &&
      this.fullTextForPopover === fullText
    ) {
      return;
    }
    const contentElement =
      hostElement.querySelector('input, select, button, span') || hostElement;
    let isOverflowing = false;
    if (contentElement.tagName.toLowerCase() === 'select') {
      const selectElement = contentElement as HTMLSelectElement;
      const tempSpan = this.renderer.createElement('span');
      const computedStyle = window.getComputedStyle(selectElement);
      this.renderer.setStyle(tempSpan, 'font', computedStyle.font);
      this.renderer.setStyle(
        tempSpan,
        'letter-spacing',
        computedStyle.letterSpacing
      );
      this.renderer.setStyle(tempSpan, 'position', 'absolute');
      this.renderer.setStyle(tempSpan, 'visibility', 'hidden');
      this.renderer.setStyle(tempSpan, 'white-space', 'nowrap');
      tempSpan.textContent = fullText;
      this.renderer.appendChild(document.body, tempSpan);
      const textWidth = tempSpan.offsetWidth;
      this.renderer.removeChild(document.body, tempSpan);
      const selectInnerWidth =
        selectElement.clientWidth -
        (parseInt(computedStyle.paddingLeft) || 0) -
        (parseInt(computedStyle.paddingRight) || 0);
      isOverflowing = textWidth > selectInnerWidth;
    } else {
      isOverflowing = contentElement.scrollWidth > contentElement.clientWidth;
    }
    if (isOverflowing) {
      this.activePopoverElement = hostElement;
      this.fullTextForPopover = fullText;
      this.safeMarkForCheck();
      if (this.textPopover) {
        this.textPopover.show(this.activePopoverElement);
      }
    }
  }

  hidePopover(): void {
    if (this.activePopoverElement && this.textPopover) {
      this.textPopover.hide();
      this.activePopoverElement = null;
    }
  }

  updatePagedData() {
    if (this.serverSidePagination) {
      this.pagedData = this._data;
    } else {
      const start = this.currentPageNumber * this.pageSize;
      this.pagedData = this._data.slice(start, start + this.pageSize);
    }
  }

  initializeColumns() {
    const dataKeys = Array.from(new Set(this._data.flatMap(Object.keys)));
    const configKeys = Object.keys(this.columnConfig);
    const mergedKeys = Array.from(new Set([...dataKeys, ...configKeys]));
    this.allColumns = this.config?.excludeColumns
      ? mergedKeys.filter((k) => !this.config!.excludeColumns!.includes(k))
      : mergedKeys;
    this.checkboxOptions = this.allColumns.map((label) => ({
      label,
      checked: this.defaultSelectedColumns.includes(label),
    }));
    this.visibleColumns = this.checkboxOptions
      .filter((o) => o.checked)
      .map((o) => o.label);
    setTimeout(() => {
      this.setColumnWidth();
      this.checkScrollVisibility();
    });
  }

  initializeColumnDataFilterOptions(): void {
    this.visibleColumns.forEach((colKey) => {
      const config = this.columnConfig[colKey];
      if (config && !config.filterOptions?.length) {
        const uniqueValues = new Set<string>();
        this._data.forEach((row) => {
          if (row[colKey] !== undefined && row[colKey] !== null) {
            uniqueValues.add(String(row[colKey]));
          }
        });
        config.filterOptions = Array.from(uniqueValues)
          .map((value) => ({
            value,
            label: value,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
      }
    });
    this.safeMarkForCheck();
  }

  toggleDropdown(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
    if (this.openDropdownIndex !== null) {
      this.openColumnDataFilterDropdownCol = null;
    }
    this.safeMarkForCheck();
  }

  toggleColumnDataFilterDropdown(colKey: string, event: MouseEvent): void {
    event.stopPropagation();
    this.openColumnDataFilterDropdownCol =
      this.openColumnDataFilterDropdownCol === colKey ? null : colKey;
    if (this.openColumnDataFilterDropdownCol !== null) {
      this.openDropdownIndex = null;
    }
    this.safeMarkForCheck();
  }

  toggleOption(i: number) {
    this.checkboxOptions[i].checked = !this.checkboxOptions[i].checked;
    this.visibleColumns = this.checkboxOptions
      .filter((o) => o.checked)
      .map((o) => o.label);
    setTimeout(() => {
      this.setColumnWidth();
      this.checkScrollVisibility();
    });
  }

  selectAll() {
    this.checkboxOptions.forEach((o) => (o.checked = true));
    this.visibleColumns = this.checkboxOptions.map((o) => o.label);
  }

  resetFilter() {
    this.checkboxOptions.forEach((o) => {
      o.checked = this.defaultSelectedColumns.includes(o.label);
    });
    this.visibleColumns = this.checkboxOptions
      .filter((o) => o.checked)
      .map((o) => o.label);
  }

  clearColumnDataFilter(colKey: string, event?: Event): void {
    if (event) event.stopPropagation();
    const config = this.columnConfig[colKey];
    if (config) {
      config.currentFilterValues = [];
      this.emitColumnDataFilterChange();
    }
    this.safeMarkForCheck();
  }

  emitColumnDataFilterChange(): void {
    const activeFilters: { [key: string]: string[] } = {};
    this.visibleColumns.forEach((colKey) => {
      const columnConfig = this.columnConfig[colKey];
      if (
        columnConfig?.filterable &&
        columnConfig.currentFilterValues?.length
      ) {
        activeFilters[colKey] = columnConfig.currentFilterValues;
      }
    });
    this.columnFilterChanged.emit(activeFilters);
  }

  onToggleMultiValueFilter(colKey: string, value: string, event: Event): void {
    event.stopPropagation();
    const config = this.columnConfig[colKey];
    if (!config) return;
    const currentValues = config.currentFilterValues || [];
    if (currentValues.includes(value)) {
      config.currentFilterValues = currentValues.filter((v) => v !== value);
    } else {
      config.currentFilterValues = [...currentValues, value];
    }
    this.emitColumnDataFilterChange();
    this.safeMarkForCheck();
  }

  isAnyColumnActivelyDataFiltered(): boolean {
    return this.visibleColumns.some((colKey) => {
      const columnConfig = this.columnConfig[colKey];
      return (
        columnConfig?.filterable &&
        Array.isArray(columnConfig.currentFilterValues) &&
        columnConfig.currentFilterValues.length > 0
      );
    });
  }

  allSelected(): boolean {
    return this.checkboxOptions.every((o) => o.checked);
  }

  someSelected(): boolean {
    return this.checkboxOptions.some((o) => o.checked);
  }

  setColumnWidth() {
    const w = this.columnCellRef?.nativeElement?.offsetWidth;
    if (w) this.columnWidth = w;
  }

  checkScrollVisibility() {
    const container = this.tableContainerRef?.nativeElement;
    if (container) {
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      const canScroll = scrollWidth - clientWidth > this.SCROLL_THRESHOLD_PX;
      this.isScrollVisible = canScroll;
      this.cdr.markForCheck();
    }
  }

  observeTableChanges() {
    const container = this.tableContainerRef?.nativeElement;
    if (!container) return;
    this.mutationObserver = new MutationObserver(() => {
      clearTimeout(this.scrollDebounceTimer);
      this.scrollDebounceTimer = setTimeout(() => {
        this.checkScrollVisibility();
      }, this.UI_UPDATE_DELAY_LONG_MS);
    });
    this.mutationObserver.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }

  onSort(col: string) {
    if (
      this.columnConfig[col]?.type === 'buttons' ||
      col.toLowerCase() === 'actions'
    ) {
      return;
    }

    const newDirection =
      this.sortState.column === col &&
      this.sortState.direction === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC;

    this.sortChanged.emit({ column: col, direction: newDirection });
  }

  startScrollHold(dir: 'left' | 'right') {
    this.stopScrollHold();
    const step =
      dir === 'right'
        ? this.scrollNextColumn.bind(this)
        : this.scrollPrevColumn.bind(this);
    step();
    this.scrollHoldInterval = setInterval(step, this.SCROLL_INTERVAL_MS);
  }

  stopScrollHold() {
    if (this.scrollHoldInterval) {
      clearInterval(this.scrollHoldInterval);
      this.scrollHoldInterval = null;
    }
  }

  scrollNextColumn() {
    const container = this.tableContainerRef?.nativeElement;
    if (!container) return;
    const targetScrollLeft = container.scrollLeft + container.clientWidth;
    gsap.to(container, {
      scrollLeft: targetScrollLeft,
      duration: this.SCROLL_ANIMATION_DURATION_S,
      ease: 'power2.out',
    });
  }

  scrollPrevColumn() {
    const container = this.tableContainerRef?.nativeElement;
    if (!container) return;
    const targetScrollLeft = container.scrollLeft - container.clientWidth;
    gsap.to(container, {
      scrollLeft: targetScrollLeft,
      duration: this.SCROLL_ANIMATION_DURATION_S,
      ease: 'power2.out',
    });
  }

  scrollToColumn(i: number) {
    const container = this.tableContainerRef?.nativeElement;
    if (!container) return;
    const targetScrollLeft = i * this.columnWidth;
    if (Math.abs(container.scrollLeft - targetScrollLeft) < 1) return;
    gsap.to(container, {
      scrollLeft: targetScrollLeft,
      duration: this.SCROLL_ANIMATION_DURATION_S,
      ease: 'power2.out',
    });
  }

  onButtonKeyDown(e: KeyboardEvent, dir: 'left' | 'right') {
    if (
      (e.key === 'ArrowLeft' && dir === 'left') ||
      (e.key === 'ArrowRight' && dir === 'right')
    ) {
      this.startScrollHold(dir);
    }
  }
  trackByButton(index: number, btn: ButtonConfig): string {
    return btn.action + (btn.label || '') + (btn.icon || '');
  }

  onButtonKeyUp(e: KeyboardEvent) {
    if (['ArrowLeft', 'ArrowRight'].includes(e.key)) this.stopScrollHold();
  }

  onRowClick(row: TableRow) {
    this.actionTriggered.emit({ action: TableAction.ROW_CLICK, row });
  }

  onActionClick(action: string, row: TableRow) {
    const rowId = row[this.idProperty];
    switch (action) {
      case TableAction.EDIT:
        this.actionTriggered.emit({ action: TableAction.EDIT, row });
        break;
      case TableAction.CANCEL:
        this.editCancelled.emit({ row: row });
        break;
      case TableAction.SAVE:
        if (rowId !== undefined && this.editedRow[rowId]) {
          this.editableRowIds.add(rowId);
          const isValid = this.validateRow(rowId);
          if (!isValid) {
            this.rowValidationFailed.emit(
              this.validationErrorMessages.fixErrors
            );
            this.cdr.markForCheck();
            return;
          }
          const isNew = typeof rowId === 'string' && rowId.startsWith('temp-');
          const actionType = isNew
            ? TableAction.ADD_SAVE
            : TableAction.EDIT_SAVE;
          this.actionTriggered.emit({
            action: actionType,
            row: { ...this.editedRow[rowId] },
          });
        }
        break;
      case TableAction.DELETE:
        this.actionTriggered.emit({ action: TableAction.DELETE, row });
        break;
      default:
        this.actionTriggered.emit({ action, row });
    }
  }

  validateRow(rowId: string | number): boolean {
    const row = this.editedRow[rowId];
    if (!row) return true;
    let errors: { [key: string]: string } = {};
    if (this.validateRowFn) {
      const externalErrors = this.validateRowFn(row);
      if (externalErrors) {
        errors = externalErrors;
      }
    } else {
      this.validationRequiredFields.forEach((field) => {
        if (!row[field] || String(row[field]).trim() === '') {
          errors[field] = 'is-invalid';
        }
      });
    }
    if (Object.keys(errors).length > 0) {
      this.validationErrors[rowId] = errors;
    } else {
      delete this.validationErrors[rowId];
    }
    this.validationTriggered = true;
    this.cdr.markForCheck();
    return Object.keys(errors).length === 0;
  }

  resolveButtons(
    config: ColumnConfig,
    row: TableRow,
    index: number
  ): ButtonConfig[] {
    return typeof config.buttons === 'function'
      ? config.buttons(row, index)
      : config.buttons || [];
  }

  isRowSelected(row: TableRow): boolean {
    return this.selectedRows.has(row);
  }

  toggleRowSelection(row: TableRow): void {
    this.selectedRows.has(row)
      ? this.selectedRows.delete(row)
      : this.selectedRows.add(row);
    this.selectionChange.emit(new Set(this.selectedRows));
  }

  allRowsSelected(): boolean {
    if (this.pagedData.length === 0) {
      return false;
    }
    return this.pagedData.every((r) => this.selectedRows.has(r));
  }

  someRowsSelected(): boolean {
    return this.selectedRows.size > 0 && !this.allRowsSelected();
  }

  toggleSelectAllRows(e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    this.pagedData.forEach((row) => {
      if (checked) {
        this.selectedRows.add(row);
      } else {
        this.selectedRows.delete(row);
      }
    });
    this.selectionChange.emit(new Set(this.selectedRows));
  }

  reload() {
    this.initializeColumns();
    this.reloadRequested.emit();
  }

  trackByRow(i: number, row: TableRow) {
    return row ? row[this.idProperty] ?? i : i;
  }

  trackByColumn(i: number, col: string) {
    return col;
  }

  trackByOption(i: number, opt: { label: string }) {
    return opt.label;
  }

  getCellValue(rowId: string | number | undefined, col: string): any {
    if (rowId === undefined || rowId === null) {
      return '';
    }
    if (this.editedRow[rowId] && this.editedRow[rowId][col] !== undefined) {
      return this.editedRow[rowId][col];
    }
    const originalRow = this._data.find((r) => r[this.idProperty] === rowId);
    return originalRow ? originalRow[col] ?? '' : '';
  }

  getError(rowId: string | number | undefined, col: string): string {
    if (!rowId) return '';
    const errorClass = this.validationErrors?.[rowId]?.[col] || '';
    return errorClass;
  }

  updateCellValue(
    rowId: string | number | undefined,
    col: string,
    value: any
  ): void {
    if (rowId == null) {
      return;
    }

    if (!this.editedRow[rowId]) {
      const originalRow = this._data.find((r) => r[this.idProperty] === rowId);
      if (originalRow) {
        this.editedRow[rowId] = { ...originalRow };
      } else {
        this.editedRow[rowId] = {} as TableRow;
      }
    }

    const trimmedValue = typeof value === 'string' ? value.trim() : value;
    this.editedRow[rowId][col] = trimmedValue;

    const dataRow = this._data.find((r) => r[this.idProperty] === rowId);
    if (dataRow) {
      dataRow[col] = trimmedValue;
    }

    const pagedRow = this.pagedData?.find((r) => r[this.idProperty] === rowId);
    if (pagedRow) {
      pagedRow[col] = trimmedValue;
    }

    if (trimmedValue !== '' && this.validationErrors[rowId]?.[col]) {
      delete this.validationErrors[rowId][col];
      if (Object.keys(this.validationErrors[rowId]).length === 0) {
        delete this.validationErrors[rowId];
      }
    }

    this.cdr.markForCheck();
    this.inputChanged.emit();
  }


  onAddClicked(): void {
    this.addClicked.emit();
    this.focusOnNewRow = true;
  }

  onSearchClicked(): void {
    this.searchClicked.emit();
  }

  onRowKeydown(event: KeyboardEvent, row: any): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onRowClick(row);
    }
  }

  private markPending = false;

  private focusElementWhenReady(elementId: string) {
    let attempts = 0;
    const maxAttempts = 20;
    const interval = setInterval(() => {
      const element = document.getElementById(elementId);
      if (element) {
        const focusableChild =
          element.querySelector<HTMLElement>('input, select');
        if (focusableChild) {
          focusableChild.focus();
          clearInterval(interval);
          return;
        }
      }
      attempts++;
      if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 50);
  }

  private focusFirstEditableCellOfNewRow(): void {
    if (this.pagedData.length === 0) {
      return;
    }
    const newRow = this.pagedData[0];
    const newRowId = newRow[this.idProperty];
    if (!newRowId) {
      return;
    }
    const firstEditableCol = this.visibleColumns.find((col) =>
      this.editableColumns.includes(col)
    );
    if (firstEditableCol) {
      const elementId = `${firstEditableCol}-${newRowId}`;
      this.focusElementWhenReady(elementId);
    }
  }

  private safeMarkForCheck(): void {
    if (this.markPending) return;
    this.markPending = true;
    requestAnimationFrame(() => {
      this.cdr.markForCheck();
      this.markPending = false;
    });
  }

  private optionLabelCache = new Map<string, string>();
  getPrecomputedOptionLabel(col: string, value: any): string {
    const key = `${col}:${value}`;
    if (!this.optionLabelCache.has(key)) {
      const label = this.getOptionLabel(col, value);
      this.optionLabelCache.set(key, label);
    }
    return this.optionLabelCache.get(key)!;
  }

  private formattedHeaderMap = new Map<string, string>();
  getFormattedHeader(col: string): string {
    if (!this.formattedHeaderMap.has(col)) {
      const formatted = col
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, (str) => str.toUpperCase());
      this.formattedHeaderMap.set(col, formatted);
    }
    return this.formattedHeaderMap.get(col)!;
  }

  toggleAllColumnDataFilter(colKey: string, event?: Event): void {
    if (event) event.stopPropagation();
    const config = this.columnConfig[colKey];
    if (!config?.filterOptions?.length) return;
    const allValues = config.filterOptions.map((opt) => opt.value);
    const isAllSelected = this.isAllOptionsSelected(colKey);
    config.currentFilterValues = isAllSelected ? [] : allValues;
    this.emitColumnDataFilterChange();
    this.safeMarkForCheck();
  }

  isAllOptionsSelected(colKey: string): boolean {
    const config = this.columnConfig[colKey];
    const selected = config?.currentFilterValues ?? [];
    const all = config?.filterOptions ?? [];
    return (
      selected.length === all.length &&
      all.every((opt) => selected.includes(opt.value))
    );
  }

  isFocusedCell(rowId: string | number, col: string): boolean {
    return this.focusedRowId === rowId && this.focusedColKey === col;
  }
}
