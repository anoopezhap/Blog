import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  useLocation,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import { getPostsBySearch } from "../api/postApi";
import PostCard from "../components/PostCard";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentParams = Object.fromEntries([...searchParams]);

  //console.log("current params", currentParams);

  const navigate = useNavigate();

  useEffect(() => {
    searchParams.set("sort", "desc");
    searchParams.set("category", "all");
    setSearchParams(searchParams);
  }, []);

  //console.log("first load", currentParams);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("after changing", currentParams);
  // };

  const {
    data,
    status,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["search", currentParams],
    queryFn: (props) =>
      getPostsBySearch(currentParams.sort, currentParams.category, props),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      let count = 0;
      for (let i in allPages) {
        count = count + allPages[i].length;
      }

      return lastPage.length === 0 ? undefined : count;
    },
  });

  // if (isSuccess) {
  //   console.log(data);
  // }

  // if (isError) {
  //   console.log("error", error);
  // }

  // if (isLoading) {
  //   console.log("isloading");
  // }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select
              onChange={(e) => {
                searchParams.set("sort", e.target.value);
                setSearchParams(searchParams);
              }}
              //value={sidebarData.sort}
              value={currentParams.sort}
              id="sort"
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select
              //onChange={handleChange}
              onChange={(e) => {
                searchParams.set("category", e.target.value);
                setSearchParams(searchParams);
              }}
              //value={sidebarData.category}
              value={currentParams.category}
              id="category"
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="react">React.js</option>
              <option value="node">Node.js</option>
              <option value="javascript">JavaScript</option>
              <option value="all">All</option>
            </Select>
          </div>
          {/* <Button type="submit" outline gradientDuoTone="purpleToPink">
            Apply Filters
          </Button> */}
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 ">
          Posts results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {isSuccess && data.pages[0].length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}
          {isLoading && <p className="text-xl text-gray-500">Loading...</p>}
          {isSuccess &&
            data.pages[0].length > 0 &&
            data?.pages?.map((page) =>
              page.map((post) => <PostCard key={post._id} post={post} />)
            )}
          {
            <button
              disabled={!hasNextPage || isFetchingNextPage}
              className="w-full text-teal-500 sef-center text-sm py-7"
              onClick={() => fetchNextPage()}
            >
              {isFetchingNextPage
                ? "Loading...."
                : hasNextPage
                ? "show more"
                : "end of pages"}
            </button>
          }
        </div>
      </div>
    </div>
  );
}

export default Search;
