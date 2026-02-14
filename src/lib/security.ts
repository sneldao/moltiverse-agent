// Security Module - Wallet and Transaction Validation

// Validate Ethereum address
export function isValidAddress(address: string): boolean {
  if (!address) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Validate transaction amount
export function isValidAmount(amount: bigint, decimals: number = 18): boolean {
  if (amount <= BigInt(0)) return false;
  const max = BigInt('0x' + 'ff'.repeat(decimals));
  return amount <= max;
}

// Sanitize user input
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Validate transaction request
export interface TransactionRequest {
  to: string;
  value: bigint;
  data?: string;
}

export function validateTransactionRequest(request: TransactionRequest): {
  valid: boolean;
  error?: string;
} {
  if (!isValidAddress(request.to)) {
    return { valid: false, error: 'Invalid recipient address' };
  }

  if (request.value < BigInt(0)) {
    return { valid: false, error: 'Invalid amount' };
  }

  // Check for suspicious data
  if (request.data) {
    // Warn on arbitrary data calls (could be malicious)
    console.warn('Transaction with data - ensure you trust the target');
  }

  return { valid: true };
}

// Rate limiter for API calls
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private limit: number;
  private windowMs: number;

  constructor(limit: number = 10, windowMs: number = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  check(key: string): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(key) || [];
    
    // Filter out old timestamps
    const validTimestamps = timestamps.filter(t => now - t < this.windowMs);
    
    if (validTimestamps.length >= this.limit) {
      return false;
    }
    
    // Add current timestamp
    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);
    
    return true;
  }

  reset(key: string) {
    this.requests.delete(key);
  }
}

// Create rate limiter for wallet operations
export const walletRateLimiter = new RateLimiter(5, 30000); // 5 requests per 30 seconds

// Signature verification (basic)
export function verifySignature(
  message: string,
  signature: string,
  address: string
): boolean {
  // This is a simplified version - in production use proper EIP-712
  if (!signature || !address) return false;
  
  // Basic length check
  if (signature.length !== 132) return false; // 65 bytes + 0x prefix
  
  return true;
}

// Secure storage (basic implementation)
export const secureStorage = {
  get(key: string): string | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      // Basic obfuscation - in production use proper encryption
      return atob(item);
    } catch {
      return null;
    }
  },

  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, btoa(value));
    } catch {
      console.error('Failed to store securely');
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  },

  clear(): void {
    localStorage.clear();
  }
};

// Validate URL for redirects
export function isSafeRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Only allow same-origin or whitelisted domains
    const allowedDomains = [
      'moltiverse.agent',
      'nad.fun',
      'monad.xyz',
    ];
    return allowedDomains.some(d => parsed.hostname.includes(d));
  } catch {
    return false;
  }
}
