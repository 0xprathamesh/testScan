interface Icon {
    url: string;
    width: number;
    height: number;
    format: string;
  }
  
  interface NativeCurrency {
    name?: string;
    symbol?: string;
    decimals?: number;
  }
  
  interface BlockExplorer {
    name: string;
    url: string;
    icon?: string;
    standard?: string;
  }
  
  interface Network {
    readonly id: number;
    readonly name?: string;
    readonly rpc: string;
    readonly icon?: Icon;
    readonly nativeCurrency?: NativeCurrency;
    readonly blockExplorers?: BlockExplorer[];
    readonly testnet?: true;
    readonly experimental?: Record<string, unknown>;
    readonly faucets?: string[];
  }