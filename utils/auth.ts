import { jwtDecode } from "jwt-decode";

class AuthService {
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp) {
        if (decoded.exp < Date.now() / 1000) {
          return true;
        } else return false;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    return localStorage.getItem("id_token");
  }
}

export default AuthService;
