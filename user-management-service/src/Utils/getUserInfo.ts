import { NextFunction, Request, Response } from "express";

import { Roles } from "../enums/roles.enum";

export const roleHierarchy1 = {
  [Roles.GENERAL_MANAGER]: 1,
  [Roles.REGIONAL_MANAGER]: 2,
  [Roles.INVENTORY_MANAGER]: 3,
  [Roles.STORE_MANAGER]: 4,
  [Roles.CASHIER]: 5,
};

export const roleHierarchy2 = {
  [Roles.GENERAL_MANAGER]: 1,
  [Roles.REGIONAL_MANAGER]: 2,
  [Roles.INVENTORY_MANAGER]: 3,
};

export const roleHierarchy3 = {
  [Roles.GENERAL_MANAGER]: 1,
  [Roles.REGIONAL_MANAGER]: 2,
  [Roles.STORE_MANAGER]: 3,
  [Roles.CASHIER]: 4,
};

export const lowerRole1 = [Roles.INVENTORY_MANAGER];

export const lowerRole2 = [Roles.STORE_MANAGER, Roles.CASHIER];

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
