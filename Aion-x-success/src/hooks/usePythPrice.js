import { useState, useEffect } from 'react';
import { getPythPrice } from '@/utils/pythPrice';

export const usePythPrice = (symbol) => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval;
    
    const fetchPrice = async () => {
      const data = await getPythPrice(symbol);
      if (data) {
        setPrice(data.price);
        setLoading(false);
      }
    };

    fetchPrice();
    interval = setInterval(fetchPrice, 3000);

    return () => clearInterval(interval);
  }, [symbol]);

  return { price, loading };
};
