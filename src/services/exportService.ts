import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

export const exportService = {
  async exportToPng(element: HTMLElement, title: string) {
    try {
      const dataUrl = await toPng(element, {
        backgroundColor: '#f8fafc',
        cacheBust: true,
        style: {
          transform: 'scale(1)',
        }
      });
      const link = document.createElement('a');
      link.download = `${title}.png`;
      link.href = dataUrl;
      link.click();
      return true;
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
      pdf.save(`${title}.pdf`);

      return true;
    } catch (error) {
      console.error('PDF export failed:', error);
      return false;
    }
  }
};
