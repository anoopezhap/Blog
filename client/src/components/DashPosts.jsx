import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { deletePost, getAllPostsByUser } from "../api/postApi";
import { Table, Modal, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useQueryClient } from "@tanstack/react-query";
import { Spinner } from "flowbite-react";

function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);

  //const [showMore, setShowMore] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);

  const queryClient = useQueryClient();

  function handleDeletePost() {
    const body = { userId: currentUser._id, postId: postIdToDelete };
    deleteMutate(body);
  }

  const {
    isPending: deleteIsPending,
    isError: deleteIsError,
    isSuccess: deleteIsSuccess,
    data: deleteData,
    error: deleteError,
    mutate: deleteMutate,
  } = useMutation({
    mutationFn: (body) => deletePost(body),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setShowDeletePopup(false);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const { data, status, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", currentUser._id],
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
    return <Spinner />;
  }

  // console.log(data);

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
                      <span
                        onClick={() => {
                          setShowDeletePopup(true);
                          setPostIdToDelete(post._id);
                        }}
                        className="font-medium text-red-500 hover:underline cursor-pointer"
                      >
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
      <Modal
        show={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        popup
        size="md"
      >
        {" "}
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowDeletePopup(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DashPosts;
