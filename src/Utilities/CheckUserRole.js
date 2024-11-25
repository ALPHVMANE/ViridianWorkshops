import { ref, onValue } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth'; 
import { db, auth } from '../Config/Firebase';

const checkUserRole = (setUsername, setRole) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      return onValue(ref(db, `users/${user.uid}`), (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUsername(data.username);
          setRole(data.role);
        }
      });
    }
  });
};

export default checkUserRole;