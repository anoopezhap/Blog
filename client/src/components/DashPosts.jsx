import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getAllPostsByUser } from "../api/postApi";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { useState } from "react";

function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);

  //const [showMore, setShowMore] = useState(true);

  const { data, status, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: (props) => getAllPostsByUser(currentUser._id, props),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        let count = 0;
        for (let i in allPages) {
          count = count + allPages[i].length;
        }

        return lastPage.length === 0 ? undefined : count;
      },
    });

  if (status === "pending") {
    return <p>Loaindg...</p>;
  }

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300">
      {data?.pages?.[0].length > 0 ? (
        <>
          <Table hoverable className="shadow:md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {data?.pages?.map((page) =>
              page.map((post) => (
                <Table.Body className="divide-y" key={post._id}>
                  <Table.Row>
                    <Table.Cell>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/post/${post.slug}`}>
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-20 h-10 bg-gray-500"
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/post/${post.slug}`}
                        className="font-medium text-gray-900"
                      >
                        {post.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell>
                    <Table.Cell>
                      <span className="font-medium text-red-500 hover:underline cursor-pointer">
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/update-post/${post._id}`}
                        className="text-teal-500 hover:underline cursor-pointer"
                      >
                        <span>Edit</span>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))
            )}
          </Table>
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
        </>
      ) : (
        <p> You have no posts yet</p>
      )}
    </div>
  );
}

export default DashPosts;
