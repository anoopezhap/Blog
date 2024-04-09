import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { getRecentPosts } from "../api/postApi";
import { useQuery } from "@tanstack/react-query";
import PostCard from "../components/PostCard";

function Home() {
  const {
    isPending: recentPostsIsPending,
    isSuccess: recentPostsIsSuccess,
    data: recentPostsData,
  } = useQuery({
    queryKey: ["9posts"],
    queryFn: () => getRecentPosts("desc", 9),
  });

  // if (recentPostsIsSuccess) {
  //   console.log(recentPostsData);
  // }

  return (
    <div>
      <div className="flex flex-col gap-6 lg:p-28 p-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Step into a world where technology meets creativity, where ideas flow
          freely, and where learning never stops. Join me on this exhilarating
          journey through the realms of MongoDB, Express.js, React.js, and
          Node.js as we explore the boundless possibilities of the MERN stack.
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>
      <div className="p-3 bg-amber-100">
        <CallToAction />
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {recentPostsIsSuccess ? (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="flex flex-wrap gap-4">
              {recentPostsData.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        ) : (
          <p> Is Loading </p>
        )}
        <Link
          to="/search"
          className="text-lg text-teal-500 hover:underline text-center"
        >
          View all posts
        </Link>
      </div>
    </div>
  );
}

export default Home;
