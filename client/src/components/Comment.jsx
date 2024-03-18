import { useMutation, useQuery } from "@tanstack/react-query";
import { getCommentUser } from "../api/userApi";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { likeComment } from "../api/commentApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

function Comment({ comment }) {
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

  if (isPending) {
    return <p>IsLoading</p>;
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
        </div>
      </div>
    </div>
  );
}

export default Comment;
