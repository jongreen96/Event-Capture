export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null | undefined;
};

export type Plan = {
  id: string;
  plan: 'trial' | 'small' | 'medium' | 'large';
  eventname: string;
  pauseduploads: boolean;
  url: string;
  pin: number | undefined;
  status: 'canceled' | 'active' | 'paused';
  enddate: string;
  nextbillingdate: string;
  createdat: string;
};
