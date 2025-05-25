import type { HouseInterface } from "@/interfaces/house";
import type { ApiResponse } from "../ApiClient";
import ApiClient from "../ApiClient";

export default class ServiceHousesClient extends ApiClient {
  serviceName = "Houses/"

  getHouses(): Promise<ApiResponse<HouseInterface[]>> {
    return this.get<HouseInterface[]>("")
  }

  getHouseById(id: string): Promise<ApiResponse<HouseInterface>> {
    return this.get<HouseInterface>(`${id}`)
  }
}