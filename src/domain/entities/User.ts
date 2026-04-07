export class User {
  constructor(
    public CodUser: number,
    public Username: string,
    public Name: string,
    public email: string,
    public Password: string,
    public status: number,
    public History: string | null,
    public UserGroup: string | null,
    public ConectedStatus: number,
    public Location: string | null,
    public Imagen: string | null,
    public initial: string | null,
    public IdDept: number | null,
    public Skin: string | null,
    public ImageUser: string | null
  ) {}
}
