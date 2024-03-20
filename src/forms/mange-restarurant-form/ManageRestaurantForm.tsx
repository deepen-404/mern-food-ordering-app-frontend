import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DetailsSection from "./DetailsSection";
import { Separator } from "@radix-ui/react-separator";
import CuisinesSection from "./CuisinesSection";
import MenuSection from "./MenuSection";
import ImageSection from "./ImageSection";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Restaurant } from "@/types";

const formSchema = z
  .object({
    restaurantName: z.string({
      required_error: "Restarurant name is required",
    }),

    country: z.string({
      required_error: "Country is required",
    }),
    city: z.string({
      required_error: "City is required",
    }),

    deliveryPrice: z.coerce.number({
      required_error: "Delivery price is required",
      invalid_type_error: "Must be a valid number",
    }),

    estimatedDeliveryTime: z.coerce.number({
      required_error: "Delivery price is required",
      invalid_type_error: "Must be a valid number",
    }),

    cuisines: z.array(z.string()).nonempty({
      message: "Please select at least one item",
    }),

    menuItems: z.array(
      z.object({
        name: z.string().min(1, "is required"),
        price: z.coerce.number().min(1, "is required ( > $1 )"),
      })
    ),

    imageUrl: z.string().optional(),
    imageFile: z.instanceof(File, { message: "Image is required" }).optional(),
  })
  .refine((data) => data.imageUrl || data.imageFile, {
    message: "Either image ULR or image file must be provided",
    path: ["imageFile"],
  });

type RestarantFormData = z.infer<typeof formSchema>;

type ManageRestarurantFormsT = {
  onSave: (restarantFormData: FormData) => void;
  isLoading: boolean;
  restaurant?: Restaurant;
};

const ManageRestaurantForms: React.FC<ManageRestarurantFormsT> = ({
  isLoading,
  onSave,
  restaurant,
}) => {
  const form = useForm<RestarantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // fallback values if nothing is provided in the form
      cuisines: [],
      menuItems: [{ name: "", price: 0 }],
    },
  });

  useEffect(() => {
    if (!restaurant) return;

    const deliveryPriceFormatted = parseFloat(
      (restaurant.deliveryPrice / 100).toFixed(2)
    );

    const menuItemsFormatted = restaurant.menuItems.map((item) => ({
      ...item,
      price: parseInt((item.price / 100).toFixed(2)),
    }));

    const updatedRestaurant = {
      ...restaurant,
      deliveryPrice: deliveryPriceFormatted,
      menuItems: menuItemsFormatted,
    };

    form.reset(updatedRestaurant);
  }, [form, restaurant]);

  const onSubmit = (formdataJson: RestarantFormData) => {
    const formData = new FormData();

    formData.append("restaurantName", formdataJson.restaurantName);
    formData.append("country", formdataJson.country);
    formData.append("city", formdataJson.city);
    formData.append(
      "deliveryPrice",
      (formdataJson.deliveryPrice * 100).toString()
    );
    formData.append(
      "estimatedDeliveryTime",
      formdataJson.estimatedDeliveryTime.toString()
    );
    formdataJson.cuisines.forEach((cuisine, index) => {
      formData.append(`cuisines[${index}]`, cuisine);
    });
    formdataJson.menuItems.forEach((menuItem, index) => {
      formData.append(`menuItems[${index}][name]`, menuItem.name);
      formData.append(
        `menuItems[${index}][price]`,
        (menuItem.price * 100).toString()
      );
    });

    if (formdataJson.imageFile) {
      formData.append(`imageFile`, formdataJson.imageFile);
    }
    onSave(formData);
  };

  return (
    <Form {...form}>
      <form
        className="space-y-2 md:space-y-4 shadow-sm border border-gray-900 bg-slate-100 rounded-lg p-4 md:p-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <DetailsSection />
        <Separator />
        <CuisinesSection />
        <Separator />
        <MenuSection />
        <Separator />
        <ImageSection />
        {isLoading ? (
          <LoadingButton />
        ) : (
          <Button className="bg-orange-500" type="submit">
            Submit
          </Button>
        )}
      </form>
    </Form>
  );
};

export default ManageRestaurantForms;
