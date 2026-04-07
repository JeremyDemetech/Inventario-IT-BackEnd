export class Person {
  constructor(
    public PersonId: number,
    public FullName: string,
    public DepartmentId: number,
    public Position: string | null,
    public Email: string | null,
    public Description: string | null,
    public Active: boolean,
    public CreatedAt: Date
  ) {}
}
