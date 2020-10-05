function notLessThan(myRole: string, hisOrHerRole: string) {
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

function amISuperAdmin(myRole: string) {
  return myRole === "SUPER_ADMIN";
}

function amIAdmin(myRole: string) {
  return myRole === "ADMIN" || myRole === "SUPER_ADMIN";
}

export const authTest = { notLessThan, amISuperAdmin, amIAdmin };
