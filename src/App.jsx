import List from "./Components/List/List";
import Chat from "./Components/Chats/Chat";
import Details from "./Components/Details/Details";
import Login from "./Components/Login/Login";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "./Database";
import Buffer from "./Components/Buffer/Buffer";
import { useUserStore } from "./ZustandStore/useUserStore";

const App = () => {
  const { currentuser, loading, fetchUserinfo } = useUserStore();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user && user.emailVerified) {
        fetchUserinfo(user.uid);
      } else {
        fetchUserinfo(null);
      }
    });

    return () => unsub && unsub();
  }, [fetchUserinfo]);

  console.log(currentuser);

  if (loading) return <Buffer />;
  return (
    <div className="container">
      {currentuser ? (
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
};

export default App;
