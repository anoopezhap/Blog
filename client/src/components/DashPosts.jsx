import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getAllPostsByUser } from "../api/postApi";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";

function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);

  const { data, isPending, isError, isSuccess, error } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getAllPostsByUser(currentUser._id),
  });

  if (isPending) {
    console.log(data);
    return <p>Isloading</p>;
  }

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300">
      {data?.data?.posts?.length > 0 ? (
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
            {data?.data?.posts.map((post) => (
              <Table.Body className="divide-y">
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
            ))}
          </Table>
        </>
      ) : (
        <p> You have no posts yet</p>
      )}
    </div>
  );
}

export default DashPosts;
