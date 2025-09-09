// app/api/auth/[...nextauth]/route.js
import { handlers } from "@/app/_libs/auth"; // Referring to the auth.ts we just created
export const { GET, POST } = handlers;
