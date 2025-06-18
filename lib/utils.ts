import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateValue: any): string {
  if (!dateValue) return '';

  let year, month, day;

  // Håndter Neo4j date object med low/high struktur
  if (
    dateValue &&
    typeof dateValue === 'object' &&
    dateValue.year &&
    dateValue.year.low !== undefined
  ) {
    year = dateValue.year.low;
    month = dateValue.month.low;
    day = dateValue.day.low;
  }
  // Håndter Neo4j date object (enkel struktur)
  else if (
    dateValue &&
    typeof dateValue === 'object' &&
    dateValue.year &&
    typeof dateValue.year === 'number'
  ) {
    year = dateValue.year;
    month = dateValue.month;
    day = dateValue.day;
  }
  // Håndter ISO string eller Date object
  else {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    if (date instanceof Date && !isNaN(date.getTime())) {
      year = date.getFullYear();
      month = date.getMonth() + 1;
      day = date.getDate();
    } else {
      return '';
    }
  }

  // Formater med ledende nuller (norsk standard)
  const paddedDay = day.toString().padStart(2, '0');
  const paddedMonth = month.toString().padStart(2, '0');

  return `${paddedDay}.${paddedMonth}.${year}`;
}
