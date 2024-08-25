//import { AppDataSource } from "./../data-source";
import { AppDataSource } from "../data-source";
import bcrypt from "bcryptjs";
import { Employee } from "../entities/Employee";
import { Roles } from "../enums/roles.enum";

export const createUser = async (
  name: string,
  email: string,
  role: Roles,
  phone: string,
  image: any
) => {
  const userRepository = AppDataSource.getRepository(Employee);
  const defaultPassword = `POS${email}`;
  const hashedPassword = await bcrypt.hash(defaultPassword, 12);

  const newUser = userRepository.create({
    name,
    email,
    password: hashedPassword,
    role,
    temporary: true,
    is_active: true,
    mobile: phone,
    image: image,
    account_created_at: new Date(Date.now()),
  });

  await userRepository.save(newUser);
  return newUser;
};

export const getUserByEmailAndCurrentPassword = async (
  email: string,
  currentPassword: string
) => {
  const userRepository = AppDataSource.getRepository(Employee);

  const user = await userRepository.findOne({
    where: { email },
  });

  if (user) {
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (isPasswordValid) {
      return user;
    }
  }

  return null;
};

export const updateUserPassword = async (user: any, password: string) => {
  const userRepository = AppDataSource.getRepository(Employee);

  user.password = await bcrypt.hash(password, 12);
  user.temporary = false;
  user.password_changed_at = new Date();

  await userRepository.save(user);
  return user;
};

export const getAllUsers = async (allowedRoles: string[], queryString: any) => {
  const { page, limit, sortBy, sortOrder, name, role } = queryString;
  const userRepository = AppDataSource.getRepository(Employee);

  let queryBuilder = userRepository
    .createQueryBuilder("employee")
    .where("employee.role IN (:...allowedRoles)", { allowedRoles })
    .select([
      "employee.employee_id",
      "employee.employee_name",
      "employee.email",
      "employee.role",
      "employee.is_active",
      "employee.image",
    ]);

  if (name) {
    queryBuilder = queryBuilder.andWhere("employee.employee_name ILIKE :name", {
      name: `%${name}%`,
    });
  }

  if (role) {
    queryBuilder = queryBuilder.andWhere("employee.role = :role", { role });
  }

  const users = await queryBuilder
    .orderBy(`employee.${sortBy}`, sortOrder)
    .skip((page - 1) * limit)
    .take(limit)
    .getMany();

  return users;
};

export const getOneUser = async (id: number, allowedRoles: string[]) => {
  const userRepository = AppDataSource.getRepository(Employee);
  const user = await userRepository
    .createQueryBuilder("employee")
    .where("employee.role IN (:...allowedRoles)", { allowedRoles })
    .where("employee.employee_id = :id", { id })
    .select([
      "employee.employee_id",
      "employee.employee_name",
      "employee.email",
      "employee.role",
      "employee.is_active",
      "employee.image",
      "employee.mobile_number",
      "employee.account_created_at",
      "employee.last_login",
    ])
    .getOne();

  return user;
};

export const updateOneUser = async (
  id: number,
  allowedRoles: string[],
  data: any
) => {
  const userRepository = AppDataSource.getRepository(Employee);
  const user = await userRepository
    .createQueryBuilder("employee")
    .where("employee.role IN (:...allowedRoles)", { allowedRoles })
    .where("employee.employee_id = :id", { id })
    .getOne();

  if (!user) {
    return null;
  }

  userRepository.merge(user, data);
  await userRepository.save(user);

  return user;
};

export const deleteOneUser = async (id: number) => {
  const userRepository = AppDataSource.getRepository(Employee);
  const user = await userRepository.findOne({
    where: { employee_id: id },
  });

  if (!user) {
    return false;
  }

  user.is_active = false;
  await userRepository.save(user);
  return true;
};

export const activateOneUser = async (id: number) => {
  const userRepository = AppDataSource.getRepository(Employee);
  const user = await userRepository.findOne({
    where: { employee_id: id },
  });

  if (!user) {
    return false;
  }

  user.is_active = true;
  await userRepository.save(user);
  return true;
};

export const updateMe = async (id: number, data: any) => {
  const userRepository = AppDataSource.getRepository(Employee);
  const user = await userRepository
    .createQueryBuilder("employee")
    .where("employee.employee_id = :id", { id })
    .getOne();

  if (!user) {
    return null;
  }

  userRepository.merge(user, data);
  await userRepository.save(user);

  return user;
};
