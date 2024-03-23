import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect } from "react";

const formSchema = z.object({
  searchQuery: z.string().min(1, "Restaurant name is required"),
});

export type SearchForm = z.infer<typeof formSchema>;

type SearchBarPropsT = {
  onSubmit: (formData: SearchForm) => void;
  placeholder: string;
  onReset?: () => void;
  searchQuery: string;
};

const SearchBar: React.FC<SearchBarPropsT> = ({
  onSubmit,
  placeholder,
  onReset,
  searchQuery,
}) => {
  const form = useForm<SearchForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchQuery,
    },
  });

  useEffect(() => {
    form.reset({ searchQuery });
  }, [form, searchQuery]);

  const handleReset = () => {
    form.reset({
      searchQuery: "",
    });

    if (onReset) {
      onReset();
    }
  };

  useEffect(() => {
    console.log("the new error is: ", form.formState.errors);
  }, [form.formState.errors]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`flex items-center gap-3 w-full mx-auto justify-between flex-row border-2 rounded-full p-3 ${
          form.formState.errors.searchQuery
            ? "border-red-500"
            : "border-gray-300"
        }`}
      >
        <Search
          strokeWidth={2.5}
          size={20}
          className="ml-1 text-orange-500 hidden md:block"
        />
        <FormField
          control={form.control}
          name="searchQuery"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  {...field}
                  className="border-none shadow-none md:text-base focus-visible:ring-0 
                  placeholder:text-sm  text-sm md:placeholder:text-base"
                  placeholder={placeholder}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          onClick={handleReset}
          type="button"
          variant="outline"
          className="rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-x"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </Button>
        <Button
          type="submit"
          className="rounded-full bg-orange-500 text-xs md:text-sm "
        >
          Search
        </Button>
      </form>
    </Form>
  );
};

export default SearchBar;
