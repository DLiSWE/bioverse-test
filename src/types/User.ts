export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export type User = {
  id: string;
  username: string;
  password: string;
  role: Role;
  createdAt: Date;
};
