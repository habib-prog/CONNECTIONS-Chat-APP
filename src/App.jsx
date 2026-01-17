import List from "./Components/List/List";
import Chat from "./Components/Chats/Chat";
import Details from "./Components/Details/Details";
import Login from "./Components/Login/Login";
// import { onAuthStateChanged } from "firebase/auth";
// import { useEffect, useState } from "react";
// import { auth } from "./Database";
import Buffer from "./Components/Buffer/Buffer";
import { useEffect } from "react";
import { useAuthStore } from "./ZustandStore/Authstore";

function App() {
  // const [user, setUser] = useState(null);
  // const [loading, setloading] = useState(true);
  // useEffect(() => {
  //   const unSub = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       if (user.emailVerified) {
  //         setUser(user);
  //       } else {
  //         setUser(null);
  //       }
  //     } else {
  //       setUser(null);
  //     }

  //     const timer = setTimeout(() => {
  //       setloading(false);
  //     }, 1900);

  //     return () => clearTimeout(timer);
  //   });
  //   return () => {
  //     unSub();
  //   };
  // }, []);

  // Zustand instead of raw code

  const { currentUser, loading, listenAuth } = useAuthStore();
  // Zustand used instead of raw code

  useEffect(() => {
    const unsub = listenAuth();
    return () => unsub();
  }, []);

  if (loading) return <Buffer />;
  return (
    <div className="container">
      {currentUser ? (
        <>
          <List />
          <Chat />
          <Details />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
