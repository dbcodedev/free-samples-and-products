import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/config";

export const useSaveData = (table, id, data) => {
  const saveSettings = async () => {
    await setDoc(doc(db, table, id), data);
  };
  saveSettings();
}

export const useGetData = (table) => {
  const fetch = async () => {
    const collectionRef = collection(db, table);
    const data = await getDocs(collectionRef);
    return data.docs.map(doc => (
        {...doc.data(), id: doc.id}
    ));
  };
  return fetch();
}