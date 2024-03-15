import { useQuery } from "@tanstack/react-query";
import { getCommentUser } from "../api/userApi";
import moment from "moment";

function Comment({ comment }) {
  const { isPending, isSuccess, isError, data, error } = useQuery({
    queryKey: ["commentUser", comment.userId],
    queryFn: () => getCommentUser(comment.userId),
  });

  if (isPending) {
    return <p>IsLoading</p>;
  }

  if (isError) {
    return <p>Something happend</p>;
  }

  // console.log("comment", comment.content);
  // console.log(data.data.username);

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
      </div>
    </div>
  );
}

export default Comment;
