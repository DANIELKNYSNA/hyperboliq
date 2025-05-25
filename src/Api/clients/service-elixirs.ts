import type { ElixirInterface } from "@/interfaces/elixirs";
import type { ApiResponse } from "../ApiClient";
import ApiClient from "../ApiClient";

export default class ServiceElixirsClient extends ApiClient {
  serviceName = "Elixirs/"

  getElixirs(): Promise<ApiResponse<ElixirInterface[]>> {
    return this.get<ElixirInterface[]>("")
  }

  getElixirById(id: string): Promise<ApiResponse<ElixirInterface>> {
    return this.get<ElixirInterface>(`${id}`)
  }
}