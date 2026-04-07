export class Asset {
  constructor(
    public AssetId: number,
    public ElementTypeId: number,
    public BrandId: number,
    public Model: string | null,
    public Serial: string | null,
    public Year: number | null,
    public Code: string | null,
    public Status: string,
    public Condition: string | null,
    public Notes: string | null,
    public Active: boolean,
    public CreatedAt: Date
  ) {}
}
