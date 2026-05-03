const FLAG = "adminAuthenticated";
const ADMIN_USERNAME = "Usmanadmin";
const ADMIN_PASSWORD = "U$M@N@DM!N";

export function isAdminAuthenticated() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(FLAG) === "true";
}

export async function adminLogin(username: string, password: string) {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    sessionStorage.setItem(FLAG, "true");
    return true;
  }
  return false;
}

export async function adminLogout() {
  sessionStorage.removeItem(FLAG);
}
