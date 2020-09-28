import { useContext } from "react";
import { UserInfoContext, WhoamiData } from "@/context/UserInfo";

function useMemberContext() {
  return useContext(UserInfoContext) as WhoamiData;
}

export { useMemberContext };
