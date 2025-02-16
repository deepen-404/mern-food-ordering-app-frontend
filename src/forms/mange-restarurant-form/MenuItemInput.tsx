// MenuItemInput.tsx
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';

type MenuItemInputT = {
  index: number;
  removeMenuItem: () => void;
};

const MenuItemInput: React.FC<MenuItemInputT> = ({ index, removeMenuItem }) => {
  const { control, watch } = useFormContext();
  const [imagePath, setImagePath] = useState<string>('');

  // Watch for changes in name and price to create storage key
  const name = watch(`menuItems.${index}.name`);
  const price = watch(`menuItems.${index}.price`);

  // Get stored image path on component mount
  useEffect(() => {
    if (name && price) {
      const key = `menuItem_${name}_${price}`;
      const storedPath = localStorage.getItem(key);
      if (storedPath) {
        setImagePath(storedPath);
      }
    }
  }, [name, price]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const path = reader.result as string;
        if (name && price) {
          const key = `menuItem_${name}_${price}`;
          localStorage.setItem(key, path);
          setImagePath(path);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <div className="flex flex-row items-end gap-2">
        <FormField
          control={control}
          name={`menuItems.${index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Name <FormMessage />
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Cheese Pizza" className="bg-white" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`menuItems.${index}.price`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Price ($) <FormMessage />
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="8.00" className="bg-white" />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex items-end gap-2">
          <Input type="file" accept="image/*" onChange={handleImageUpload} className="bg-white" />
          {imagePath && (
            <img src={imagePath} alt="Menu item" className="w-16 h-16 object-cover rounded" />
          )}
        </div>
        <Button className="bg-red-500 max-h-fit" onClick={removeMenuItem} type="button">
          Remove
        </Button>
      </div>
    </div>
  );
};

export default MenuItemInput;
