declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      username: string;
      role: "USER" | "ADMIN";
    }

    interface Request {
      user?: User;
    }
  }
}

export {};