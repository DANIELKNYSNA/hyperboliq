import type { IApiClient } from "./ApiClient";
import ApiClient from "./ApiClient";
import ServiceHousesClient from "./clients/service-houses";
import ServiceSpellsClient from "./clients/service-spells";
import ServiceElixirsClient from "./clients/service-elixirs";

export interface ApiClients {
  generic: IApiClient;
  serviceHousesClient: ServiceHousesClient;
  serviceSpellsClient: ServiceSpellsClient;
  serviceElixirsClient: ServiceElixirsClient
}

export class ApiClientsImpl implements ApiClients {
  generic: IApiClient;
  serviceHousesClient: ServiceHousesClient;
  serviceSpellsClient: ServiceSpellsClient;
  serviceElixirsClient: ServiceElixirsClient;

  constructor() {
    this.generic = new ApiClient();
    this.serviceHousesClient = new ServiceHousesClient();
    this.serviceSpellsClient = new ServiceSpellsClient();
    this.serviceElixirsClient = new ServiceElixirsClient();
  }
}
