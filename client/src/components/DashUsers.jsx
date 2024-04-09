import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { deletePost, getAllPostsByUser } from "../api/postApi";
import { Table, Modal, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useQueryClient } from "@tanstack/react-query";
import { deleteUser, getUsers } from "../api/userApi";
import { FaCheck, FaTimes } from "react-icons/fa";
import { Spinner } from "flowbite-react";

function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);

  //const [showMore, setShowMore] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const queryClient = useQueryClient();

  function handleDeleteUser() {
    //const body = { userId: userIdToDelete };

    deleteMutate(userIdToDelete);
  }

  const {
    isPending: deleteIsPending,
    isError: deleteIsError,
    isSuccess: deleteIsSuccess,
    data: deleteData,
    error: deleteError,
    mutate: deleteMutate,
  } = useMutation({
    mutationFn: (userIdToDelete) => deleteUser(userIdToDelete),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setShowDeletePopup(false);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const { data, status, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["users"],
      queryFn: (props) => getUsers(props),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        let count = 0;
        for (let i in allPages) {
          count = count + allPages[i].length;
        }

        return lastPage.length === 0 ? undefined : count;
      },
    });

  // if (status === "success") {
  //   console.log(data);
  // }

  if (status === "pending") {
    return <Spinner />;
  }

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300">
      {data?.pages?.[0].length > 0 ? (
        <>
          <Table hoverable className="shadow:md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {data?.pages?.map((page) =>
              page.map((user) => (
                <Table.Body className="divide-y" key={user._id}>
                  <Table.Row>
                    <Table.Cell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-11 h-11 object-cover bg-gray-500 rounded-full"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>
                      {user.isAdmin ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowDeletePopup(true);
                          setUserIdToDelete(user._id);
                        }}
                        className="font-medium text-red-500 hover:underline cursor-pointer"
                      >
                        Delete
                      </span>
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
        <p> You have no users yet</p>
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
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={handleDeleteUser}
                disabled={deleteIsPending}
              >
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

export default DashUsers;
