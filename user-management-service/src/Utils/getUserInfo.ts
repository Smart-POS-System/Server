import { NextFunction, Request, Response } from "express";

import { UserRole } from "../enums/role.enum";

export const roleHierarchy1 = {
  [UserRole.GeneralManager]: 1,
  [UserRole.RegionalManager]: 2,
  [UserRole.InventoryManager]: 3,
  [UserRole.InventorySupervisor]: 4,
  [UserRole.StoreManager]: 5,
  [UserRole.StoreSupervisor]: 6,
  [UserRole.Cashier]: 7,
};

export const roleHierarchy2 = {
  [UserRole.GeneralManager]: 1,
  [UserRole.RegionalManager]: 2,
  [UserRole.InventoryManager]: 3,
  [UserRole.InventorySupervisor]: 4,
};

export const roleHierarchy3 = {
  [UserRole.GeneralManager]: 1,
  [UserRole.RegionalManager]: 2,
  [UserRole.StoreManager]: 3,
  [UserRole.StoreSupervisor]: 4,
  [UserRole.Cashier]: 5,
};

export const lowerRole1 = [
  UserRole.InventoryManager,
  UserRole.InventorySupervisor,
];

export const lowerRole2 = [
  UserRole.StoreManager,
  UserRole.StoreSupervisor,
  UserRole.Cashier,
];

export const getCurrentUserRoleInfo = (request: any) => {
  if (!request || !request.role) {
    throw new Error("There is a problem with the logged-in user");
  }

  const currentUserRole = request.role;

  let roleHierarchy: { [key: string]: number };

  if (lowerRole1.includes(currentUserRole)) {
    roleHierarchy = roleHierarchy2;
  } else if (lowerRole2.includes(currentUserRole)) {
    roleHierarchy = roleHierarchy3;
  } else {
    roleHierarchy = roleHierarchy1;
  }

  const currentUserRoleLevel = roleHierarchy[currentUserRole];
  const allowedRoles = Object.entries(roleHierarchy)
    .filter(([_, level]) => level > currentUserRoleLevel)
    .map(([role]) => role);

  return allowedRoles;
};
