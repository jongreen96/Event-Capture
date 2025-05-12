import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { Plan } from '../../../src/utils/types';

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

export function getTopGuests(
  plan: Plan,
  guestsVisible: number
): { guest: string; usage: number }[] {
  return plan.guests
    .map((guest: string) => ({
      guest,
      usage: plan.images
        .filter((image) => image.guestname === guest)
        .reduce((acc, image) => acc + image.imagesize, 0),
    }))
    .sort((a, b) => b.usage - a.usage)
    .slice(0, guestsVisible);
}

export function getOtherGuestsStats(plan: Plan, guestsVisible: number) {
  const topGuests = getTopGuests(plan, guestsVisible).map((g) => g.guest);
  const otherImages = plan.images.filter(
    (image) => !topGuests.includes(image.guestname)
  );
  return {
    count: plan.guests.length - guestsVisible,
    photoCount: otherImages.length,
    usage: otherImages.reduce((acc, image) => acc + image.imagesize, 0),
  };
}
