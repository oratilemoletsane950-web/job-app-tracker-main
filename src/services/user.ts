import { User } from "@/models/user.models";
import { firebaseAuth, firestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export class UserService {

    async getUser(): Promise<User | undefined> {
        if (!firebaseAuth.currentUser) {
            return undefined;
        }

        const uid = firebaseAuth.currentUser?.uid;
        const userDoc = doc(firestore,"users", uid);
        const snapshot = await getDoc(userDoc);

        const userData = snapshot.data();

        return {
            ...(userData as User),
            id: snapshot.id
        }
    }
}