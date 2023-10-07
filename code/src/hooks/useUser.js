import { Auth } from "aws-amplify";
import { useEffect, useState } from "react";

const useUser = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    (async () => {
      const response = await Auth.currentUserInfo();
      setUser(response.attributes);
    })();
  }, []);

  return user;
};
export default useUser;
