import { useSearchRestaurant } from "@/api/restaurantApi";
import CuisinesFilter from "@/components/CuisinesFilter";
import { DriverStep } from "@/components/DriverJS/components/DriverStep";
import { DriverProvider } from "@/components/DriverJS/provider/DriverProvider";
import PaginationSelector from "@/components/PaginationSelector";
import SearchBar, { SearchForm } from "@/components/SearchBar";
import SeachResultCard from "@/components/SearchResultCard";
import SearchResultInfo from "@/components/SearchResultInfo";
import SortDropdown from "@/components/SortOptionDropdown";
import { DEFAULT_DRIVER_OPTIONS } from "@/config/DriverJS/DefaultDriverJSOptions";
import { RESTAURANT_PAGE_DRIVER_OPTIONS, RESTAURANT_PAGE_TUTORIAL_KEY } from "@/config/DriverJS/RestaurantListPage";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

export type SearchStateT = {
  searchQuery: string;
  page: number;
  selectedCuisines: string[];
  sortOption: string;
};

const SearchPage = () => {
  const { city } = useParams();
  const [searchState, setSearchState] = useState<SearchStateT>({
    searchQuery: "",
    page: 1,
    selectedCuisines: [],
    sortOption: "bestMatch",
  });

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const { results, isLoading } = useSearchRestaurant(searchState, city);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  if (!results?.data || !city) {
    return (
      <>
        <span className="block">No results found</span>
        <Link to="/" className="underline text-blue-500">
          Click here to return to the home page
        </Link>
      </>
    );
  }

  const setSelectedCuisines = (selectedCuisines: string[]) => {
    setSearchState((prev) => ({
      ...prev,
      selectedCuisines,
      page: 1,
    }));
  };
  const setPage = (page: number) => {
    setSearchState((prev) => ({
      ...prev,
      page,
    }));
  };
  const setSortOption = (sortOption: string) => {
    setSearchState((prevState) => ({
      ...prevState,
      sortOption,
      page: 1,
    }));
  };
  const setSearchQuery = (searchFormData: SearchForm) => {
    setSearchState((prevState) => ({
      ...prevState,
      searchQuery: searchFormData.searchQuery,
      page: 1,
    }));
  };

  const resetSearch = () => {
    setSearchState((prevState) => ({
      ...prevState,
      searchQuery: "",
    }));
  };

  return (
    <DriverProvider tutorialKey={RESTAURANT_PAGE_TUTORIAL_KEY} driverOptions={{...DEFAULT_DRIVER_OPTIONS, }}>
    <div className="grid gap-5 grid-cols-1 lg:grid-cols-[250px_1fr]">
      <div id="cuisines__list">
        <CuisinesFilter
          isExpanded={isExpanded}
          onExpandedClick={() => setIsExpanded((prev) => !prev)}
          selectedCuisines={searchState.selectedCuisines}
          onChange={setSelectedCuisines}
        />
      </div>
      <div id="main__content" className="flex flex-col gap-5">
      <DriverStep {...RESTAURANT_PAGE_DRIVER_OPTIONS['search-bar']}>
      <SearchBar
          searchQuery={searchState.searchQuery}
          placeholder="Search by Cuisine or Restaurant name "
          onSubmit={setSearchQuery}
          onReset={resetSearch}
        />
          </DriverStep>
        <div className="flex justify-between items-end lg:items-center flex-col gap-3 lg:flex-row ">
          <SearchResultInfo total={results.pagination.total} city={city} />
         <DriverStep {...RESTAURANT_PAGE_DRIVER_OPTIONS['sort-options']}>
         <SortDropdown
            sortOption={searchState.sortOption}
            onChange={(value) => setSortOption(value)}
          />
         </DriverStep>
        </div>
        <DriverStep {...RESTAURANT_PAGE_DRIVER_OPTIONS['restaurant-list']}>
       <div className="flex flex-col gap-5">
       {results.data.map((restaurant) => (
          <SeachResultCard restaurant={restaurant} />
        ))}
       </div>
        </DriverStep>
        <PaginationSelector
          page={results.pagination.page}
          pages={results.pagination.pages}
          onPageChange={setPage}
        />
      </div>
    </div>
    </DriverProvider>
  );
};

export default SearchPage;
