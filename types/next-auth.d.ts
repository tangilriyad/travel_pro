import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "admin" | "company" | "user";
      companyId?: string | null;
      companyName?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "company" | "user";
    companyId?: string | null;
    companyName?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string;
    name: string;
    email: string;
    role: "admin" | "company" | "user";
    companyId?: string | null;
    companyName?: string | null;
    picture?: string | null;
  }
} 