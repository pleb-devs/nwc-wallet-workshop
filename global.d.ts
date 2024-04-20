interface WebLN {
  enable: () => Promise<any>;
  sendPayment: (invoice: string) => Promise<any>;
  getBalance: () => Promise<{ balance: number; currency: string }>;
}

declare global {
  interface Window {
    webln: WebLN;
  }
}

export {};
