
import { Colis } from "../app/colis/colis_page";


export interface Client {
  id: string;
  name: string;
  phone: string;
  city: string;
  totalShipments: number;
  createdAt?: string;
}

export interface ClientInput {
  name: string;
  phone: string;
  city: string;
}

export interface ClientsPageProps {
  colisList?: Colis[];
  onOpenCreateClient?: () => void;
  onClientPress?: (client: Client) => void;
  onAddClient?: (client: Client) => void;
  onUpdateClient?: (updatedClient: Client) => void;
  onDeleteClient?: (clientId: string) => void;
  clientsList?: Client[];
}

