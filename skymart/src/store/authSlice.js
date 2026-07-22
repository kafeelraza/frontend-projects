import { createSlice } from "@reduxjs/toolkit";

const USERS_KEY = "sm_users";
const SESSION_KEY = "sm_session";

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
};

const getUsers = () => safeParse(localStorage.getItem(USERS_KEY), []);
const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));
const getSession = () => safeParse(localStorage.getItem(SESSION_KEY), null);

const stripPassword = (user) => {
  const { password: _password, ...safe } = user;
  return safe;
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getSession(),
  },
  reducers: {
    register: (state, action) => {
      const { name, email, password } = action.payload;
      const users = getUsers();
      const user = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        avatar: name.trim().charAt(0).toUpperCase(),
        joinedAt: new Date().toISOString(),
      };
      users.push(user);
      saveUsers(users);
      const safe = stripPassword(user);
      localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
      state.user = safe;
    },
    login: (state, action) => {
      const safe = stripPassword(action.payload.user);
      localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
      state.user = safe;
    },
    logout: (state) => {
      localStorage.removeItem(SESSION_KEY);
      state.user = null;
    },
  },
});

export const { register, login, logout } = authSlice.actions;
export const findUserByEmail = (email) =>
  getUsers().find((user) => user.email.toLowerCase() === email.trim().toLowerCase());
export const emailExists = (email) => Boolean(findUserByEmail(email));
export default authSlice.reducer;
