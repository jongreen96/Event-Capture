import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatImageSize(sizeInKB: number, dec: number = 0): string {
  if (sizeInKB < 1024) return `${sizeInKB.toFixed(dec)} KB`;
  if (sizeInKB < 1024 * 1024) return `${(sizeInKB / 1024).toFixed(dec)} MB`;
  if (sizeInKB < 1024 * 1024 * 1024)
    return `${(sizeInKB / (1024 * 1024)).toFixed(dec)} GB`;
  return `${(sizeInKB / (1024 * 1024 * 1024)).toFixed(dec)} TB`;
}
