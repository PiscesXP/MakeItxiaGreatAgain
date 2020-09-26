import { useContext } from "react";
import { UserInfoContext } from "@/context/UserInfo";

function useMemberContext() {
  return useContext(UserInfoContext);
}

export { useMemberContext };
