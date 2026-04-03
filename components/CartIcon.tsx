
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cartManager } from '../lib/cart';

export default function CartIcon() {
  const [itemCount, setItemCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const updateCount = () => {
      const count = cartManager.getTotalItems();
      setItemCount(count);
    };

    // Initial load
    updateCount();
    
    // Subscribe to changes
    const unsubscribe = cartManager.subscribe(updateCount);

    return unsubscribe;
  }, []);

  // Don't render on server to avoid hydration mismatch
  if (!mounted) {
    return (
      <Link href="/dashboard/cart" className="relative p-2 text-white hover:text-orange-200">
        <i className="ri-shopping-cart-line text-xl"></i>
      </Link>
    );
  }

  return (
    <Link href="/dashboard/cart" className="relative p-2 text-white hover:text-orange-200">
      <i className="ri-shopping-cart-line text-xl"></i>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center min-w-[20px]">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
}
