import { useMutation, useQuery } from "@tanstack/react-query";
import { getCommentUser } from "../api/userApi";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { deleteComment, editComment, likeComment } from "../api/commentApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button, Textarea, Modal, Spinner } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function Comment({ comment }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentUser } = useSelector((state) => state.user);

  const { isPending, isSuccess, isError, data, error } = useQuery({
    queryKey: ["commentUser", comment.userId],
    queryFn: () => getCommentUser(comment.userId),
  });

  const commentId = comment._id;

  const {
    isPending: likeIsPending,
    isSuccess: likeIsSuccess,
    data: likeData,
    error: likeError,
    mutate: likeMutate,
  } = useMutation({
    mutationFn: (commentId) => likeComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const {
    isPending: editIsPending,
    isSuccess: editIsSuccess,
    data: editData,
    error: editError,
    mutate: editMutate,
  } = useMutation({
    mutationFn: (body) => editComment(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      setIsEditing(false);
    },
  });

  const {
    isPending: deleteIsPending,
    isSuccess: deleteIsSuccess,
    data: deleteData,
    error: deleteError,
    mutate: deleteMutate,
  } = useMutation({
    mutationFn: (commentId) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      setShowDeletePopup(false);
    },
  });

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <p>Something happend</p>;
  }

  function handleLike() {
    if (!currentUser) {
      navigate("/sign-in");
    }
    //console.log("comment Id", commentId);
    likeMutate(commentId);
  }

  function handleEdit() {
    const body = { commentId, content: editedContent };
    editMutate(body);
  }

  function handleDelete() {
    deleteMutate(commentId);
  }

  return (
    <div className="flex p-4 border-b text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          src={data.data.profilePicture}
          className="w-10 h-10 rounded-full bg-gray-200"
          alt={data.data.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            @{data.data.username}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end text-sm gap-2">
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={handleEdit}
              >
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={() => setIsEditing(false)}
                outline
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment.content}</p>
            <div className="flex items-center pt-2 text-xs gap-2 border-t max-w-fit">
              <button
                type="button"
                onClick={() => handleLike()}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                } `}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <button
                    type="button"
                    className="text-gray-400 hover:text-blue-500"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                )}
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <button
                    type="button"
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => setShowDeletePopup(true)}
                  >
                    Delete
                  </button>
                )}
            </div>
          </>
        )}

        <Modal
          show={showDeletePopup}
          onClose={() => setShowDeletePopup(false)}
          popup
          size="md"
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this post?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDelete}>
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
    </div>
  );
}

export default Comment;
