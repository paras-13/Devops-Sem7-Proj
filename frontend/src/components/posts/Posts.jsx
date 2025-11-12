import Post from "../post/Post";
import { useQuery } from "@tanstack/react-query";
import "./posts.scss";
import { makeRequest } from "../../axios";

const Posts = ({ userId }) => {
  const { isPending, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      makeRequest.get("/posts?userId=" + userId).then((res) => {
        return res.data;
      }),
  });
  // console.log(data);
  //   if (isPending) return <div>Loading...</div>;
  //   if (error) return <div>Error fetching posts</div>;

  return (
    <div className="posts">
      {error
        ? "Something Went Wrong!"
        : isPending
        ? "Loading..."
        : data.map((post) => <Post post={post} key={post.id} />)}
    </div>
  );
};

export default Posts;
