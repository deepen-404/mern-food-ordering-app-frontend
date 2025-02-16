import LandingImage from "../assets/landing.png";
import AppDownloadImage from "../assets/appDownload.png";
import SearchBar, { SearchForm } from "@/components/SearchBar";
import { useNavigate } from "react-router-dom";
import { DriverStep } from "@/components/DriverJS/components/DriverStep";
import { LANDING_PAGE_DRIVER_OPTIONS } from "@/config/DriverJS/LandingPage";

const HomePage = () => {
  const navigate = useNavigate();
  const handleSearchSubmit = (searchFormValues: SearchForm) => {
    navigate({
      pathname: `/search/${searchFormValues.searchQuery}`,
    });
  };
  return (
    <div className="flex flex-col gap-12">
      <div className="flex px-2 flex-col gap-2 py-8 -mt-16 text-center rounded-md shadow-md lg:gap-5 md:gap-4 bg-gray-50">
        <h1 className="text-lg font-semibold tracking-tight text-orange-600 md:text-xl lg:text-2xl">
          Tuck into a takeaway today
        </h1>
        <span className="text-sm md:text-base">Food is just a click away!</span>
       <DriverStep {...LANDING_PAGE_DRIVER_OPTIONS['search-bar']}>
       <div className="w-3/4 mx-auto">
          <SearchBar
            placeholder="Start by searching manchester (city)"
            onSubmit={handleSearchSubmit}
          />
        </div>
       </DriverStep>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <img src={LandingImage} alt="Landing Image" />
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <span className="text-xl font-semibold tracking-tighter">
            Order takeaway even faster!
          </span>
          <span className="text-sm md:text-base">
            Download MernEats app for faster ordering and personalised
            recommendations.
          </span>
          <img
            className="cursor-pointer"
            src={AppDownloadImage}
            alt="App Download"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
