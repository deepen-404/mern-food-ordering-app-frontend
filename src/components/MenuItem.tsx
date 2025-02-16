import type { MenuItem } from '@/types';
import { Card, CardTitle } from './ui/card';
import { useEffect, useState } from 'react';

type MenuItemPropsT = {
  menuItem: MenuItem;
  addToCart: () => void;
};

const MenuItem = ({ menuItem, addToCart }: MenuItemPropsT) => {
  const [imagePath, setImagePath] = useState<string>('');

  useEffect(() => {
    // Create the same key format used in storage
    const storageKey = `menuItem_${menuItem.name}_${menuItem.price / 100}`;
    const storedImage = localStorage.getItem(storageKey);
    if (storedImage) {
      setImagePath(storedImage);
    }
  }, [menuItem]);

  return (
    <Card
      onClick={addToCart}
      className="group active:scale-95 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg"
    >
      <div className="flex items-center p-4 gap-4">
        {imagePath && (
          <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
            <img
              src={imagePath}
              alt={menuItem.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent group-hover:from-black/20 transition-all duration-300" />
          </div>
        )}

        <div className="flex-grow flex items-center justify-between">
          <CardTitle className="text-lg font-bold tracking-tight group-hover:text-orange-500 transition-colors">
            {menuItem.name}
          </CardTitle>

          <div className="flex items-center gap-4">
            <span className="font-bold text-lg text-green-600">
              ${(menuItem.price / 100).toFixed(2)}
            </span>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
              Add to cart
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MenuItem;
