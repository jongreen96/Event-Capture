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
