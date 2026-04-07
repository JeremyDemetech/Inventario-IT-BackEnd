export class AssetAssignment {
  constructor(
    public AssignmentId: number,
    public AssetId: number,
    public PersonId: number,
    public DepartmentId: number,
    public AssignedDate: string,
    public ReturnDate: string | null,
    public Notes: string | null
  ) {}
}
