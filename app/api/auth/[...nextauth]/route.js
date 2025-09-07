// app/api/auth/[...nextauth]/route.js
import { handlers } from "@/app/[locale]/auth";

export const { GET, POST } = handlers;
