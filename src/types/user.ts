export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "PRINCIPAL";
  createdAt: Date | string;
}

export interface UserWithPermissions extends User {
  userPermissions: {
    id: string;
    permissionId: string;
    permission: {
      id: string;
      name: string;
      description: string | null;
      resource: string;
      action: string;
    };
  }[];
}

export interface Permission {
  id: string;
  name: string;
  description: string | null;
  resource: string;
  action: "view" | "create" | "edit" | "delete" | "export" | "import";
  createdAt: Date | string;
}

export interface FilterOptionsUser {
  search: string;
  role: string;
}
