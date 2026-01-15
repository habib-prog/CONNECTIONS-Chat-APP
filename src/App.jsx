import List from "./Components/List/List";
import Chat from "./Components/Chats/Chat";
import Details from "./Components/Details/Details";
import Login from "./Components/Login/Login";

function App() {
  const user = true;
  return (
    <div className="container">
      {user ? (
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
