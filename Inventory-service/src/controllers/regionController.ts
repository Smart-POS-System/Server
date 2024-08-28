// // src/services/regionService.ts
// import { AppDataSource } from "../data-source";
// import { Region } from "../entities/Region";

// export class RegionController {
//     async getAllRegions() (req: Request, res: Response) => {
//         try {
//           const regionRepository = AppDataSource.getRepository(Region);
//           const regions = await regionRepository.find();
//           res.json(regions).status(201);
//         } catch (err) {
//           res.send(err).status(400).json({ msg: "Database connection Error!" });
//         }
//       }

//   }
// }
