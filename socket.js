import { io } from "socket.io-client";

const userEmail = localStorage.getItem("userEmail");

const apiUrl = import.meta.env.VITE_API_URL;
console.log(apiUrl);

export const socket = io(apiUrl, { query: { email: userEmail } });
