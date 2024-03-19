import { useQuery } from "@tanstack/react-query";
import { Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { getPostsBySearch } from "../api/postApi";

function Search() {
  const location = useLocation();

  const params = useParams();

  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get("searchTerm");
  const sort = searchParams.get("sort");
  const category = searchParams.get("category");

  //   const { isPending, isSuccess, isError, data, error } = useQuery({
  //     queryKey: ["search", searchQuery],
  //     queryFn: () =>
  //       getPostsBySearch(
  //         sideBarData.searchTerm,
  //         sideBarData.sort,
  //         sideBarData.category
  //       ),
  //   });

  //   if (isPending) {
  //     return <p>isloading</p>;
  //   }

  //   function handleChange(e) {
  //     if (e.target.id === "searchTerm") {
  //       setSideBarData({ ...sideBarData, searchTerm: e.target.value });
  //     }
  //     if (e.target.id === "sort") {
  //       const order = e.target.value || "desc";
  //       setSideBarData({ ...sideBarData, sort: order });
  //     }
  //     if (e.target.id === "category") {
  //       const category = e.target.value || "uncategorized";
  //       setSideBarData({ ...sideBarData, category });
  //     }
  //   }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search term:
            </label>
            <TextInput
              placeholder="Search...."
              id="searchTerm"
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchParams((prev) => {
                  prev.set("searchTerm", e.target.value);
                  return prev;
                })
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Sort:</label>
            <Select
              id="sort"
              value={sort}
              onChange={(e) =>
                setSearchParams((prev) => prev.set("sort", e.target.value))
              }
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Category:</label>
            <Select
              id="category"
              value={category}
              onChange={(e) =>
                setSearchParams((prev) => prev.set("category", e.target.value))
              }
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="javascript">JavaScript</option>
            </Select>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Search;
