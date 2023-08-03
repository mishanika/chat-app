import { collection, query, where, getDocs, addDoc, startAt, setDoc, doc, updateDoc } from "firebase/firestore";
import { firestore } from "./firebase";
import { v4 as uuid } from "uuid";

export const database = firestore;

export const addUser = async (username: string, email: string, photoURL: string) => {
  const id = uuid();

  const userCollection = collection(database, "users");
  const q = query(userCollection, where("email", "==", email));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.size === 0) {
    await setDoc(doc(database, "users", id), {
      id: id,
      username: username,
      email: email,
      photoURL: photoURL,
      rooms: ["0"],
    });
    localStorage.setItem("uuid", id);
    localStorage.setItem("photoURL", photoURL);
  } else {
    localStorage.setItem("uuid", querySnapshot.docs[0].data().id);
    localStorage.setItem("photoURL", querySnapshot.docs[0].data().photoURL);
  }
};

export const addMessage = async (userId: string, message: string, photoURL: string, chatId: string) => {};

export const findUser = async (username: string) => {
  const userCollection = collection(database, "users");
  const q = query(userCollection, where("username", ">=", username), where("username", "<=", username + "\uf8ff"));
  const querySnapshot = await getDocs(q);
  console.log(username);

  return querySnapshot.docs.map((item) => item.data());
};

export const getUserChats = async (username: string) => {
  const userCollection = collection(database, "users");
  const q = query(userCollection, where("username", ">=", username));
  const querySnapshot = await getDocs(q);
  console.log(username);

  return querySnapshot.docs.map((item) => item.data());
};
