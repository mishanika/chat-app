import { collection, query, where, getDocs, addDoc, startAt } from "firebase/firestore";
import { firestore } from "./firebase";
import { v4 as uuid } from "uuid";

export const database = firestore;

export const addUser = async (username: string, email: string, photoURL: string) => {
  const id = uuid();

  const userCollection = collection(database, "users");
  const q = query(userCollection, where("email", "==", email));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.size === 0) {
    await addDoc(userCollection, {
      id: id,
      username: username,
      email: email,
      photoURL: photoURL,
    });
  }
};

export const addMessage = async (userId: string, message: string, photoURL: string) => {
  const messagesCollection = collection(database, "messages");

  //   if (querySnapshot.size === 0) {
  //     await addDoc(userCollection, {
  //       id: id,
  //       username: username,
  //       email: email,
  //       photoURL: photoURL,
  //     });
  //   }
};

export const findUser = async (username: string) => {
  const userCollection = collection(database, "users");
  const q = query(userCollection, where("username", ">=", username));
  const querySnapshot = await getDocs(q);
  console.log(username);

  return querySnapshot.docs.map((item) => item.data());
};
