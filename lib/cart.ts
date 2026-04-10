
'use client';

export interface CartItem {
  id: string;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
  targetUrl: string;
  notes?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  paymentMethod: 'balance' | 'sepay';
}

class CartManager {
  private items: CartItem[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate data format
        if (Array.isArray(parsed)) {
          this.items = parsed.filter(item => 
            item && 
            typeof item === 'object' && 
            typeof item.quantity === 'number' && 
            item.quantity > 0 &&
            typeof item.price === 'number' &&
            item.price > 0 &&
            item.id &&
            item.name &&
            item.targetUrl
          );
        } else {
          // Reset if data is corrupted
          this.items = [];
          localStorage.removeItem('cart');
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      this.items = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
      }
    }
  }

  private saveToStorage() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(this.items));
      }
      this.notifyListeners();
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in cart listener:', error);
      }
    });
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  addItem(item: Omit<CartItem, 'id'>) {
    // Validate input
    if (!item.name || !item.targetUrl || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
      throw new Error('Invalid item data');
    }

    if (item.price <= 0 || item.quantity <= 0) {
      throw new Error('Price and quantity must be positive');
    }

    const existingItem = this.items.find(i => 
      i.productId === item.productId && i.targetUrl.toLowerCase() === item.targetUrl.toLowerCase()
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;
      if (item.notes) {
        existingItem.notes = item.notes;
      }
    } else {
      const newItem: CartItem = {
        ...item,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
      };
      this.items.push(newItem);
    }

    this.saveToStorage();
  }

  removeItem(itemId: string) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.saveToStorage();
  }

  updateQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    const item = this.items.find(i => i.id === itemId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveToStorage();
    }
  }

  updateNotes(itemId: string, notes: string) {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      item.notes = notes;
      this.saveToStorage();
    }
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  getTotalItems(): number {
    return this.items.reduce((total, item) => {
      const qty = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 0;
      return total + qty;
    }, 0);
  }

  getTotalAmount(): number {
    return this.items.reduce((total, item) => {
      const qty = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 0;
      const price = typeof item.price === 'number' && item.price > 0 ? item.price : 0;
      return total + (price * qty);
    }, 0);
  }

  clear() {
    this.items = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }
    this.notifyListeners();
  }

  // Validate cart data integrity
  validateAndClean() {
    const validItems = this.items.filter(item => 
      item && 
      typeof item === 'object' && 
      typeof item.quantity === 'number' && 
      item.quantity > 0 &&
      typeof item.price === 'number' &&
      item.price > 0 &&
      item.id &&
      item.name &&
      item.targetUrl
    );

    if (validItems.length !== this.items.length) {
      this.items = validItems;
      this.saveToStorage();
    }
  }

  // Check if item exists in cart
  hasItem(productId: number, targetUrl: string): boolean {
    return this.items.some(item => 
      item.productId === productId && item.targetUrl.toLowerCase() === targetUrl.toLowerCase()
    );
  }

  // Get item from cart
  getItem(productId: number, targetUrl: string): CartItem | undefined {
    return this.items.find(item => 
      item.productId === productId && item.targetUrl.toLowerCase() === targetUrl.toLowerCase()
    );
  }

  // Debug method to check cart state
  debug() {
    console.log('Cart items:', this.items);
    console.log('Total items:', this.getTotalItems());
    console.log('Total amount:', this.getTotalAmount());
  }
}

export const cartManager = new CartManager();
