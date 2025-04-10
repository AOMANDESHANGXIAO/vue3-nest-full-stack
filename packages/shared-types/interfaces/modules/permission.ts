export interface CreatePermissionDtoType {
  name: string;
  desc?: string;
}

export interface UpdatePermissionDtoType extends Partial<CreatePermissionDtoType> {}

