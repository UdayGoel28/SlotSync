export interface Service {
  id: string;
  businessId: string;
  name: string;
  durationMinutes: number;
  price: number;
  description?: string | null;
  isActive: boolean;
}

export interface CreateServiceInput {
  name: string;
  durationMinutes: number;
  price: number;
  description?: string;
}

export interface UpdateServiceInput extends Partial<CreateServiceInput> {
  isActive?: boolean;
}
