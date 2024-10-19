import "reflect-metadata";
import { LocationService } from "../src/services/locationService";
import { AppDataSource } from "../src/data-source";
import { Location } from "../src/entities/Location";
import { Types } from "../src/enums/units.enum";
import { Repository, FindOneOptions, DeepPartial } from "typeorm";

// Define a mock type for the repository
// type MockLocationRepository = {
//   save: jest.Mock<Promise<Location>, [Location]>;
//   find: jest.Mock<Promise<Location[]>, []>;
//   findOne: jest.Mock<Promise<Location | null>, [FindOneOptions<Location>]>;
// };
type MockLocationRepository = {
  save: jest.Mock<Promise<Location>, [DeepPartial<Location>]>;
  find: jest.Mock<Promise<Location[]>, []>;
  findOne: jest.Mock<Promise<Location | null>, [FindOneOptions<Location>]>;
} & Partial<Repository<Location>>;

// Mock the AppDataSource module
jest.mock("../src/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    }),
  },
}));

describe("LocationService", () => {
  const locationRepository = AppDataSource.getRepository(
    Location
  ) as MockLocationRepository;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should add a location successfully", async () => {
    const mockLocation: Location = {
      location_id: 1,
      name: "Test Location",
      type: Types.STORE,
      manager: null, // or a mock Employee if needed
      region: { location_id: 1, name: "Region 1" } as any, // Mocked Region object
      employees: [], // Empty array or mock Employees
      stocks: [], // Empty array or mock Stocks
      bills: [], // Empty array or mock Bills
    };

    locationRepository.save.mockResolvedValue(mockLocation);

    const result = await LocationService.addLocation(
      "Test Location",
      Types.STORE,
      1,
      1
    );

    expect(result).toEqual(mockLocation);
    expect(locationRepository.save).toHaveBeenCalledWith(mockLocation);
  });

  it("should fetch all locations successfully", async () => {
    const mockLocations: Location[] = [
      {
        location_id: 1,
        name: "Location 1",
        type: Types.STORE,
        manager: null,
        region: { location_id: 1, name: "Region 1" } as any,
        employees: [],
        stocks: [],
        bills: [],
      },
      {
        location_id: 2,
        name: "Location 2",
        type: Types.INVENTORY,
        manager: null,
        region: { location_id: 2, name: "Region 2" } as any,
        employees: [],
        stocks: [],
        bills: [],
      },
    ];

    locationRepository.find.mockResolvedValue(mockLocations);

    const result = await LocationService.getLocations();

    expect(result).toEqual(mockLocations);
    expect(locationRepository.find).toHaveBeenCalled();
  });

  it("should fetch a location by ID successfully", async () => {
    const mockLocation: Location = {
      location_id: 1,
      name: "Location 1",
      type: Types.STORE,
      manager: null,
      region: { location_id: 1, name: "Region 1" } as any,
      employees: [],
      stocks: [],
      bills: [],
    };

    locationRepository.findOne.mockResolvedValue(mockLocation);

    const result = await LocationService.getLocationById(1);

    expect(result).toEqual(mockLocation);
    expect(locationRepository.findOne).toHaveBeenCalledWith({
      where: { location_id: 1 },
      relations: ["manager", "region", "employees", "stocks", "bills"],
    });
  });

  it("should fetch stores successfully", async () => {
    const mockStores: Location[] = [
      {
        location_id: 1,
        name: "Store 1",
        type: Types.STORE,
        manager: null,
        region: { location_id: 1, name: "Region 1" } as any,
        employees: [],
        stocks: [],
        bills: [],
      },
      {
        location_id: 2,
        name: "Store 2",
        type: Types.STORE,
        manager: null,
        region: { location_id: 2, name: "Region 2" } as any,
        employees: [],
        stocks: [],
        bills: [],
      },
    ];

    locationRepository.find.mockResolvedValue(mockStores);

    const result = await LocationService.getStores();

    expect(result).toEqual(mockStores);
    expect(locationRepository.find).toHaveBeenCalledWith({
      where: { type: Types.STORE },
    });
  });
});
