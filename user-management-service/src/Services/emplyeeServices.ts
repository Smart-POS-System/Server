import { NextFunction, Request, Response } from "express";
import {
  lowerRole1,
  lowerRole2,
  roleHierarchy1,
  roleHierarchy2,
  roleHierarchy3,
} from "../Utils/roleHierarchy";

export const getCurrentUserRoleInfo = (req: Request) => {
  if (!req.user || !req.user.role || !req.user.role.role_name) {
    throw new Error("There is a problem with the logged-in user");
  }

  const currentUserRole = req.user.role.role_name;

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
    .filter(([_, level]) => level >= currentUserRoleLevel)
    .map(([role]) => role);

  return allowedRoles;
};
