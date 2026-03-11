import { useState, useEffect } from "react";

function Posts() {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts/1/comments")
      .then(response => response.json())
      .then(data => {
        setPosts(data.slice(0, 2));
      });
  }, []);

  return (
    <div>
      <h2>Users</h2>

      {posts.map((comment) => (
        <div key={comment.id} className="border p-4 mb-4 rounded">
            <p>{comment.name}</p>
            <span>{comment.email}</span>
            <p>{comment.body}</p>
        </div>

      ))}

    </div>
  );
}

export default Posts;