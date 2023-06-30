import { getDatabase, ref, set, get, child, equalTo, orderByChild } from "firebase/database";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { app, auth, firestore } from "./firebase";
import { v4 as uuid } from "uuid";
import { fetchSignInMethodsForEmail } from "firebase/auth";

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
  // querySnapshot.forEach((doc) => {
  //   // doc.data() is never undefined for query doc snapshots
  //   console.log(doc.id, " => ", doc.data());
  // });
  //   const userCredential = await fetchSignInMethodsForEmail(auth, email).then((signInMethods) => {
  //     return signInMethods.length > 0;
  //   });

  //console.log(user);
  //   if (!userCredential) {
  //     set(ref(database, "users/" + id), {
  //       username: username,
  //       email: email,
  //       profile_picture: photoURL,
  //     })
  //       .then(() => console.log("added"))
  //       .catch(() => console.log("not added"));
  //   }
};
