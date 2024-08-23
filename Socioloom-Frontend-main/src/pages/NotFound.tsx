import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const naviagte = useNavigate();

  useEffect(() => {
    document.title = "Page Not Found";
    setTimeout(() => {
      naviagte("/");
    }, 1000);
  }, []);

  return <>Page Not Found</>;
}

export default NotFound;
