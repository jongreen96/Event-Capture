import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatImageSize(sizeInKB: number): string {
  if (sizeInKB < 1024) return `${sizeInKB.toFixed(0)} KB`;
  if (sizeInKB < 1024 * 1024) return `${(sizeInKB / 1024).toFixed(0)} MB`;
  if (sizeInKB < 1024 * 1024 * 1024)
    return `${(sizeInKB / (1024 * 1024)).toFixed(0)} GB`;
  return `${(sizeInKB / (1024 * 1024 * 1024)).toFixed(0)} TB`;
}
