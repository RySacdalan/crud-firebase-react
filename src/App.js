import { useEffect, useState } from "react";
import { db } from "./firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import "./App.css";

function App() {
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState(0);
  const [users, setUsers] = useState([]);
  const userCollectionRef = collection(db, "users");

  //Adding new user
  const createUser = async () => {
    await addDoc(userCollectionRef, {
      name: newName,
      age: Number(newAge),
    }).then(() => {
      setNewName("");
      setNewAge(0);
      console.log("New user added!");
    });
  };

  //updating data of user
  const updateUser = async (id, age) => {
    const userDoc = doc(db, "users", id);
    const newFields = { age: age + 1 };
    await updateDoc(userDoc, newFields);
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsers();
  }, []);

  return (
    <div className="App">
      <h1>React with firebase crud</h1>

      <input
        type="text"
        placeholder="Enter name"
        onChange={(e) => {
          setNewName(e.target.value);
        }}
        value={newName}
      />
      <input
        type="number"
        placeholder="Enter age"
        onChange={(e) => {
          setNewAge(e.target.value);
        }}
        value={newAge}
      />

      <button onClick={createUser}>Create User</button>

      {users.map((user) => {
        return (
          <div key={user.id}>
            <h2>Name: {user.name}</h2>
            <h2>Age: {user.age}</h2>
            <button
              onClick={() => {
                updateUser(user.id, user.age);
              }}
            >
              Increase Age
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default App;
