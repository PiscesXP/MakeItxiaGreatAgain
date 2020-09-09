function notLessThan(myRole, hisOrHerRole) {
  switch (myRole) {
    case "MEMBER":
      return false;
    case "ADMIN":
      return hisOrHerRole !== "SUPER_ADMIN";
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
