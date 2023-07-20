import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth";

const handler: unknown = NextAuth(authOptions);

export { handler as GET, handler as POST };
