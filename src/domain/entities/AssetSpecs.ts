export class AssetSpecs {
  constructor(
    public AssetId: number,
    public HardDrive: string | null,
    public RAM: string | null,
    public Processor: string | null
  ) {}
}
