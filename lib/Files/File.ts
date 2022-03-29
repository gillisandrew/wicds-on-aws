export default class File {
    protected _lines: string[] = []

    constructor(protected sep = '\r\n') {}

    public write(...lines: string[]) {
        this._lines.push(...lines)
    }

    public toString() {
        return this._lines.join(this.sep)
    }
}