import { AppDataSource } from "../../index";
import { Employee } from "../../entities/Employee";
import bcrypt from "bcryptjs";

import { mockDeep, MockProxy } from "jest-mock-extended";
import { Roles } from "../../enums/roles.enum";
import { createUser } from "../../Services/emplyeeServices";

jest.mock("bcryptjs");
jest.mock("../../index", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe("createUser", () => {
  let mockRepository: MockProxy<any>;

  beforeEach(() => {
    mockRepository = mockDeep();
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");
  });

  it("should create and save a new user with hashed password", async () => {
    const user = {
      name: "John Doe",
      email: "john@example.com",
      role: Roles.GENERAL_MANAGER,
      mobile: "1234567890",
      image: "path/to/image",
    };

    mockRepository.create.mockReturnValue({
      ...user,
      password: "hashed_password",
      temporary: true,
      is_active: true,
      account_created_at: new Date(),
    });

    const result = await createUser(
      user.name,
      user.email,
      user.role,
      user.mobile,
      user.image
    ); 

    expect(bcrypt.hash).toHaveBeenCalledWith(`POS${user.email}`, 12);
    expect(AppDataSource.getRepository).toHaveBeenCalledWith(Employee);
    expect(mockRepository.create).toHaveBeenCalledWith({
      ...user,
      password: "hashed_password",
      temporary: true,
      is_active: true,
      account_created_at: expect.any(Date),
    });
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toEqual({
      ...user,
      password: "hashed_password",
      temporary: true,
      is_active: true,
      account_created_at: expect.any(Date),
    });
  });

  it("should handle errors when hashing password fails", async () => {
    const error = new Error("Hashing failed");
    (bcrypt.hash as jest.Mock).mockRejectedValue(error);

    await expect(
      createUser(
        "John Doe",
        "john@example.com",
        Roles.GENERAL_MANAGER,
        "1234567890",
        "path/to/image"
      )
    ).rejects.toThrow(error);
  });
});
