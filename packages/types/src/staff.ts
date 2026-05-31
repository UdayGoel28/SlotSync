export interface Staff {
  id: string;
  businessId: string;
  name: string;
  photoUrl?: string | null;
  workingHours: Record<string, { enabled: boolean; start: string; end: string }>;
  isActive: boolean;
}

export interface CreateStaffInput {
  name: string;
  photoUrl?: string;
  workingHours: Record<string, { enabled: boolean; start: string; end: string }>;
}

export interface UpdateStaffInput extends Partial<CreateStaffInput> {
  isActive?: boolean;
}
