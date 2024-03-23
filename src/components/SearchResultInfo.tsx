import React from "react";
import { Link } from "react-router-dom";

type searchResultsInfoPropsT = {
  total: number;
  city: string;
};

const SearchResultInfo: React.FC<searchResultsInfoPropsT> = ({
  city,
  total,
}) => {
  return (
    <div className="text-base w-full font-semibold flex-col flex gap-3 justify-between lg:items-center lg:flex-row">
      <div className="flex flex-1 items-center justify-between">
        <span>
          {total} Restaurant found in {city}
        </span>
        <Link
          className="text-sm font-semibold cursor-pointer  text-blue-500 underline"
          to="/"
        >
          Change Location
        </Link>
      </div>
    </div>
  );
};

export default SearchResultInfo;
