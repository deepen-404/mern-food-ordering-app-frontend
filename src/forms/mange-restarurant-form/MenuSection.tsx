import { Button } from "@/components/ui/button";
import { FormDescription, FormField, FormItem } from "@/components/ui/form";
import { useFieldArray, useFormContext } from "react-hook-form";
import MenuItemInput from "./MenuItemInput";

const MenuSection = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "menuItems",
  });

  return (
    <div className="space-y-2">
      <div>
        <h2 className="text-xl font-bold">Menu</h2>
        <FormDescription>
          Create your menu items with name, price, and an image for each item
        </FormDescription>
      </div>
      <FormField
        control={control}
        name="menuItems"
        render={() => (
          <FormItem className="flex flex-col gap-2">
            {fields.map((_, index) => (
              <MenuItemInput
                key={index}
                removeMenuItem={() => {
                  // Clear localStorage when removing item
                  const name = control._getWatch(`menuItems.${index}.name`);
                  const price = control._getWatch(`menuItems.${index}.price`);
                  if (name && price) {
                    localStorage.removeItem(`menuItem_${name}_${price}`);
                  }
                  remove(index);
                }}
                index={index}
              />
            ))}
          </FormItem>
        )}
      />
      <Button
        type="button"
        onClick={() => append({ name: "", price: "" })}
      >
        Add items
      </Button>
    </div>
  );
};

export default MenuSection;