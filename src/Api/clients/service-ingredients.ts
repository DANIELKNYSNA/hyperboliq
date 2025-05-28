import type { IngredientInterface } from "@/interfaces/ingredients";
import type { ApiResponse } from "../ApiClient";
import ApiClient from "../ApiClient";

export default class ServiceElixirsClient extends ApiClient {
  serviceName = "Ingredients/"

  getIngredients(): Promise<ApiResponse<IngredientInterface[]>> {
    return this.get<IngredientInterface[]>("")
  }
}