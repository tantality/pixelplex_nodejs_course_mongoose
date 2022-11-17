let languagesCounter = 0;

export class Language {
  id: number;

  constructor(
    public readonly name: string,
    public readonly code: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.id = languagesCounter;
    languagesCounter += 1;
  }
}
