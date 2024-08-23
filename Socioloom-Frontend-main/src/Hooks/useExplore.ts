import { useEffect, useState } from "react";
import axios from "axios";

function useExplore(pageNumber: number, contentType: string, search: string) {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(false);

  let url = "http://localhost:3000/api/";
  if (contentType === "personal") {
    url += "posts/personal";
  } else if (contentType === "interests") url += "posts/interests";
  else if (contentType === "people") {
    url += "people";
  }

  const params = {
    pageNumber: pageNumber,
    search: search,
    explore: true,
  };

  // console.log("URL", url);
  // console.log("PARAMS", params);
  useEffect(() => {
    setPosts([]);
  }, [search, contentType]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    const cancelTokenSource = axios.CancelToken.source();
    axios
      .get(url, {
        cancelToken: cancelTokenSource.token,
        headers: {
          "x-auth-token": token,
        },
        params: params,
      })
      .then((res) => {
        // console.log("RESPONSE HEADER", res.data);
        setPosts((prevPosts) => {
          return [...new Set([...prevPosts, ...res.data])];
        });
        setHasMore(res.data.length > 0);
        setLoading(false);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          // console.log("Request canceled:", error.message);
        } else {
          setError(true);
          console.error("Error from load posts:", error.message);
        }
      });
    return () => {
      cancelTokenSource.cancel();
    };
  }, [contentType, pageNumber, search]);

  return { loading, error, posts, hasMore };
}

export default useExplore;
