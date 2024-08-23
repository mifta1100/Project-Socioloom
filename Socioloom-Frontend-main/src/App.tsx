import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import LogReg from "./pages/LogReg";
import "./App.css";
import { createContext, useEffect, useState } from "react";
import Test from "./Components/Test";

export const LoggedContext = createContext(() => {});

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.title = "Socioloom";
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
    setLoaded(true);
  }, []);

  return loaded === true ? (
    <LoggedContext.Provider value={() => setLoggedIn(!loggedIn)}>
      <Routes>
        {loggedIn ? (
          <>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="/profile/:profileId"
              element={<Home urlPath="profile" />}
            />
            <Route path="/explore" element={<Home urlPath="explore" />} />
            <Route path="/messages" element={<Home urlPath="messages" />} />
            <Route path="/chat/:chatId" element={<Home urlPath="chat" />} />
            <Route
              path="/notifications"
              element={<Home urlPath="notifications" />}
            />
            <Route path="/bookmarks" element={<Home urlPath="bookmarks" />} />
            <Route path="/test" element={<Test />} />
            <Route
              path="/post/personal/:postId"
              element={<Home urlPath="post" />}
            />
            <Route
              path="/post/interests/:postId"
              element={<Home urlPath="post" />}
            />
            <Route path="*" element={<NotFound />} />
          </>
        ) : (
          <>
            <Route path="/" element={<LogReg />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </LoggedContext.Provider>
  ) : (
    <></>
  );
}

export default App;
