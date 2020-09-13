function notLessThan(myRole, hisOrHerRole) {
  switch (myRole) {
    case "MEMBER":
      return false;
    case "ADMIN":
      return hisOrHerRole !== "SUPER_ADMIN";
    case "SUPER_ADMIN":
      return true;
    default:
      return false;
  }
}

function amISuperAdmin(myRole) {
  return myRole === "SUPER_ADMIN";
}

function amIAdmin(myRole) {
  return myRole === "ADMIN" || myRole === "SUPER_ADMIN";
}

const authTest = { notLessThan, amISuperAdmin, amIAdmin };

export { authTest };
