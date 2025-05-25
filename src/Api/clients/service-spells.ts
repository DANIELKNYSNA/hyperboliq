import type { ApiResponse } from "../ApiClient";
import ApiClient from "../ApiClient";
import type { SpellInterface } from "@/interfaces/spell";

export default class ServiceSpellsClient extends ApiClient {
  serviceName = "Spells/"

  getSpells(): Promise<ApiResponse<SpellInterface[]>> {
    return this.get<SpellInterface[]>("")
  }

  getSpellById(id: string): Promise<ApiResponse<SpellInterface>> {
    return this.get<SpellInterface>(`${id}`)
  }
}