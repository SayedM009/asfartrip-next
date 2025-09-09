import { auth } from "../../_libs/auth";
import AuthDialog from "./AuthDialog";
import UserAvatar from "./UserAvatar";

export default async function LoginButton() {
  const session = await auth();
  if (session) return <UserAvatar user={session?.user} />;
  return <AuthDialog />;
}
