import { useContext } from "react";
import { UserInfoContext } from "CONTEXT/UserInfo";

function useMemberContext() {
  return useContext(UserInfoContext);
}

export { useMemberContext };
