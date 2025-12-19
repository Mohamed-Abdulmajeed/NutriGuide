import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanService } from '../../../shared/Plan/plan-service';
import { Observable, firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, TextRun } from 'docx';
import { Alertnotification } from '../../../shared/alerts/alertnotification';
import { IShoppingList } from '../../../models/Plan/shopping-list';
declare const html2pdf: any;

@Component({
  selector: 'app-shopping-list',
  imports: [CommonModule],
  templateUrl: './shopping-list.html',
  styleUrls: ['./shopping-list.css'],
})
export class ShoppingList {

  ShoppingList$: Observable<IShoppingList>;
  selectedItems: Set<number> = new Set();
  selectAllChecked: boolean = false;
  private notificationService = inject(Alertnotification); // Inject Service

  constructor(private route: ActivatedRoute, private planService: PlanService) {
    const planId = Number(this.route.snapshot.paramMap.get('planId'));
    this.ShoppingList$ = this.planService.getShoppingList(planId);
  }

  toggleItem(index: number) {
    if (this.selectedItems.has(index)) {
      this.selectedItems.delete(index);
    } else {
      this.selectedItems.add(index);
    }
  }

  toggleSelectAll(items: any[]) {
    if (this.selectAllChecked) {
      this.selectedItems.clear();
      this.selectAllChecked = false;
    } else {
      this.selectedItems.clear();
      items.forEach((_, idx) => this.selectedItems.add(idx));
      this.selectAllChecked = true;
    }
  }

  isItemSelected(index: number): boolean {
    return this.selectedItems.has(index);
  }

  async printList() {
    try {
      if (this.selectedItems.size === 0) {
        this.notificationService.showError('الرجاء اختيار عناصر للطباعة');
        return;
      }

      const list = await firstValueFrom(this.ShoppingList$);
      if (!list) return;

      const selectedItemsList = Array.from(this.selectedItems)
        .map(idx => list.items[idx])
        .filter(item => item);

      // إنشاء محتوى الطباعة
      const printWindow = window.open('', '', 'height=600,width=800');
      if (!printWindow) {
        this.notificationService.showError('لم يتمكن المتصفح من فتح نافذة الطباعة');

        return;

      }

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>قائمة التسوق</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.8; color: #1f2937; background-color: #f9fafb; }
            .print-container { max-width: 950px; margin: 0 auto; padding: 40px 20px; background-color: white; }
            .print-header { text-align: center; margin-bottom: 40px; border-bottom: 4px solid #4472C4; padding-bottom: 30px; }
            .print-header h2 { color: #4472C4; font-size: 26px; font-weight: 700; margin-bottom: 12px; letter-spacing: 0.5px; }
            .print-header p { color: #6b7280; font-size: 14px; font-weight: 500; }
            .print-table { width: 100%; border-collapse: collapse; margin-top: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
            .print-table th { background-color: #4472C4; color: white; padding: 16px; text-align: right; font-weight: 700; font-size: 14px; letter-spacing: 0.5px; }
            .print-table td { padding: 14px 16px; text-align: right; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
            .print-table tr:last-child td { border-bottom: none; }
            .print-table tbody tr:nth-child(even) { background-color: #f3f4f6; }
            .print-table tbody tr:hover { background-color: #f0f9ff; transition: background-color 0.2s; }
            .print-table .col-number { text-align: center; font-weight: 600; color: #4472C4; width: 10%; }
            .print-table .col-name { font-weight: 600; color: #1f2937; }
            .print-table .col-amount { text-align: center; color: #059669; font-weight: 600; }
            .print-table .col-unit { text-align: center; color: #6b7280; }
            @media print {
              body { margin: 0; padding: 0; background-color: white; }
              .print-container { max-width: 100%; padding: 0; margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="print-header">
              <h2>🛒 قائمة التسوق للخطة</h2>
              <p>تاريخ الإنشاء: ${new Date(list.generatedDate).toLocaleDateString('ar-SA')}</p>
            </div>
            <table class="print-table">
              <thead>
                <tr>
                  <th class="col-number">#</th>
                  <th class="col-name">المكون</th>
                  <th class="col-amount">الكمية</th>
                  <th class="col-unit">الوحدة</th>
                </tr>
              </thead>
              <tbody>
                ${selectedItemsList.map((item, idx) => `
                  <tr>
                    <td class="col-number">${idx + 1}</td>
                    <td class="col-name">${item.ingredientName}</td>
                    <td class="col-amount">${item.amount}</td>
                    <td class="col-unit">${item.unit}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <script>
            window.print();
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } catch (e) {
      console.warn('Print not available', e);
    }
  }

  async copyList() {
    try {
      const list = await firstValueFrom(this.ShoppingList$);
      if (!list) return;
      const text = [
        `قائمة التسوق - تم إنشاؤها بتاريخ: ${new Date(list.generatedDate).toLocaleDateString()}`,
        ...list.items.map((it: any, idx: number) => `${idx + 1}. ${it.ingredientName} - ${it.amount} ${it.unit}`),
      ].join('\n');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        this.notificationService.showSuccess('تم نسخ القائمة إلى الحافظة');

      } else {
        // fallback
        (window as any).prompt('انسخ النص التالي:', text);
      }
    } catch (err) {
      console.error(err);
      this.notificationService.showError('لم نتمكن من نسخ القائمة');

    }
  }

  async exportToWord() {
    try {
      const list = await firstValueFrom(this.ShoppingList$);
      if (!list || !list.items.length) {
        this.notificationService.showError('لا توجد عناصر لتصديرها');
        return;
      }

      if (this.selectedItems.size === 0) {
        this.notificationService.showError('الرجاء اختيار عناصر للتصدير');
        return;
      }

      const selectedItemsList = Array.from(this.selectedItems)
        .map(idx => list.items[idx])
        .filter(item => item);

      // إنشاء صفوف الجدول
      const tableRows = [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: 'الرقم', bold: true, color: 'FFFFFF' })]
              })],
              shading: { fill: '4472C4' }
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: 'اسم المكون', bold: true, color: 'FFFFFF' })]
              })],
              shading: { fill: '4472C4' }
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: 'الكمية', bold: true, color: 'FFFFFF' })]
              })],
              shading: { fill: '4472C4' }
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: 'الوحدة', bold: true, color: 'FFFFFF' })]
              })],
              shading: { fill: '4472C4' }
            })
          ]
        })
      ];

      // إضافة عناصر البيانات المختارة فقط
      selectedItemsList.forEach((item: any, idx: number) => {
        tableRows.push(
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(String(idx + 1))] }),
              new TableCell({ children: [new Paragraph(item.ingredientName)] }),
              new TableCell({ children: [new Paragraph(String(item.amount))] }),
              new TableCell({ children: [new Paragraph(item.unit)] })
            ]
          })
        );
      });

      const doc = new Document({
        sections: [{
          children: [
            new Paragraph({
              children: [new TextRun({
                text: 'قائمة التسوق للخطة',
                bold: true,
                size: 28
              })],
              alignment: AlignmentType.CENTER
            }),
            new Paragraph({
              text: `تم إنشاؤها بتاريخ: ${new Date(list.generatedDate).toLocaleDateString('ar-SA')}`,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),
            new Paragraph({
              text: `عدد العناصر المختارة: ${selectedItemsList.length}`,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),
            new Table({
              rows: tableRows,
              width: { size: 100, type: WidthType.PERCENTAGE }
            })
          ]
        }]
      });

      Packer.toBlob(doc).then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `shopping-list-${new Date().getTime()}.docx`;
        link.click();
        URL.revokeObjectURL(url);
      });
    } catch (err) {
      console.error(err);
      this.notificationService.showError('حدث خطأ أثناء إنشاء ملف Word');

    }
  }

  async exportToPDF() {
    try {
      const list = await firstValueFrom(this.ShoppingList$);
      if (!list || !list.items.length) {
        this.notificationService.showError('لا توجد عناصر لتصديرها');

        return;
      }

      if (this.selectedItems.size === 0) {
        this.notificationService.showError('الرجاء اختيار عناصر للتصدير');
        return;
      }

      const selectedItemsList = Array.from(this.selectedItems)
        .map(idx => list.items[idx])
        .filter(item => item);

      // إنشاء HTML للـ PDF
      const htmlContent = document.createElement('div');
      htmlContent.innerHTML = `
        <div style="direction: rtl; padding: 30px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #4472C4; padding-bottom: 20px;">
            <h2 style="color: #4472C4; font-size: 24px; margin: 0 0 10px 0;">🛒 قائمة التسوق للخطة</h2>
            <p style="color: #666; font-size: 14px; margin: 5px 0;">تاريخ الإنشاء: ${new Date(list.generatedDate).toLocaleDateString('ar-SA')}</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background-color: #4472C4; color: white;">
                <th style="padding: 12px; text-align: center; border: 1px solid #333; font-weight: bold;">الرقم</th>
                <th style="padding: 12px; text-align: right; border: 1px solid #333; font-weight: bold;">اسم المكون</th>
                <th style="padding: 12px; text-align: center; border: 1px solid #333; font-weight: bold;">الكمية</th>
                <th style="padding: 12px; text-align: center; border: 1px solid #333; font-weight: bold;">الوحدة</th>
              </tr>
            </thead>
            <tbody>
              ${selectedItemsList.map((item: any, idx: number) => `
                <tr style="background-color: ${idx % 2 === 0 ? '#f9f9f9' : '#ffffff'};">
                  <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">${idx + 1}</td>
                  <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">${item.ingredientName}</td>
                  <td style="padding: 12px; text-align: center; border: 1px solid #ddd; color: #059669; font-weight: 600;">${item.amount}</td>
                  <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">${item.unit}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; font-size: 12px;">
            <p style="margin: 0;">إجمالي العناصر المختارة: <strong>${selectedItemsList.length}</strong></p>
          </div>
        </div>
      `;

      const element = htmlContent;
      const opt = {
        margin: 10,
        filename: `shopping-list-${new Date().getTime()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
      };

      html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error(err);
      this.notificationService.showError('حدث خطأ أثناء إنشاء ملف PDF');
    }
  }

}
