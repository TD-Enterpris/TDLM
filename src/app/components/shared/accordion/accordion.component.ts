import { Component, Input, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.css']
})
export class AccordionComponent implements OnChanges {
  @Input() accordionData: any[] = [];

  accordionItems: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['accordionData'] && changes['accordionData'].currentValue) {
      this.accordionItems = this.accordionData.map((item, index) => ({
        id: `panel-${index}`,
        title: item.title || `Panel ${index + 1}`,
        fields: item.fields || [],
        documents: item.documents || [],
        isOpen: item.isOpen,
        contentTemplate: item.contentTemplate || null,
        context: item.context || {}
      }));
    }
  }

  togglePanel(clickedItem: any): void {
    const isCurrentlyOpen = clickedItem.isOpen;

    this.accordionItems.forEach(item => {
      item.isOpen = false;
    });

    if (!isCurrentlyOpen) {
      clickedItem.isOpen = true;
    }
  }

  getTableHeaders(data: any[]): string[] {
    return data && data.length > 0 ? Object.keys(data[0]) : [];
  }
}
