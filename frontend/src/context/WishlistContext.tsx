'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { axiosInstance } from '@/lib/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface WishlistContextType {
  wishlist: string[]; // product IDs
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string, productName?: string) => Promise<void>;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sync wishlist from user object when auth state changes
  useEffect(() => {
    if (user?.wishlist) {
      setWishlist(user.wishlist.map((id: any) => (typeof id === 'string' ? id : id._id)));
    } else {
      setWishlist([]);
    }
  }, [user]);

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  const toggleWishlist = useCallback(
    async (productId: string, productName?: string) => {
      if (!user) {
        toast.error('Please sign in to save items to your wishlist');
        return;
      }

      const currently = isWishlisted(productId);
      // Optimistic update
      setWishlist((prev) =>
        currently ? prev.filter((id) => id !== productId) : [...prev, productId]
      );

      try {
        if (currently) {
          await axiosInstance.delete(`/users/wishlist/${productId}`);
          toast.success(productName ? `${productName} removed from wishlist` : 'Removed from wishlist');
        } else {
          await axiosInstance.post(`/users/wishlist/${productId}`);
          toast.success(productName ? `${productName} saved to wishlist` : 'Added to wishlist');
        }
      } catch {
        // Revert optimistic update
        setWishlist((prev) =>
          currently ? [...prev, productId] : prev.filter((id) => id !== productId)
        );
        toast.error('Failed to update wishlist');
      }
    },
    [user, isWishlisted]
  );

  return (
    <WishlistContext.Provider value={{ wishlist, isWishlisted, toggleWishlist, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
