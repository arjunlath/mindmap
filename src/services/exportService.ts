import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

export const exportService = {
  async exportToPng(element: HTMLElement, title: string) {
    try {
      const dataUrl = await toPng(element, {
        backgroundColor: '#f8fafc',
        style: {
          transform: 'scale(1)',
        },
      });
      return await window.electronAPI.exportFile(title, dataUrl, 'png');
    } catch (error) {
      console.error('PNG export failed:', error);
      return false;
    }
  },

  async exportToPdf(element: HTMLElement, title: string) {
    try {
      const dataUrl = await toPng(element, {
        backgroundColor: '#f8fafc',
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [element.offsetWidth, element.offsetHeight],
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, element.offsetWidth, element.offsetHeight);
      const pdfData = pdf.output('datauristring');

      return await window.electronAPI.exportFile(title, pdfData, 'pdf');
    } catch (error) {
      console.error('PDF export failed:', error);
      return false;
    }
  },

  async exportToJson(data: any, title: string) {
    const jsonString = JSON.stringify(data, null, 2);
    return await window.electronAPI.exportFile(title, jsonString, 'json');
  }
};
