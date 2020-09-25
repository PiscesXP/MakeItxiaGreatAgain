import { useContext } from "react";
import { UserInfoContext } from "../../context/UserInfo";
import PropTypes from "prop-types";

function RequireRole(props) {
  const whoami = useContext(UserInfoContext);
  const { role: actualRole } = whoami;
  const { role: requiredRole = "管理员", custom, fallback = null } = props;
  if (typeof custom === "function") {
    const result = custom(whoami);
    if (result) {
      return props.children;
    } else {
      return fallback;
    }
  } else {
    switch (requiredRole) {
      case "管理员":
        if (actualRole === "普通成员") {
          return fallback;
        }
        break;
      case "超级账号":
        if (actualRole !== "超级账号") {
          return fallback;
        }
        break;
      default:
        break;
    }
    return props.children;
  }
}
RequireRole.prototype = {
  role: PropTypes.string,
  fallback: PropTypes.node,
  custom: PropTypes.func,
};

export { RequireRole };
