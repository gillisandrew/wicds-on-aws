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

export enum FileMode {
    DIRECTORY = '040000',
    NORMAL_FILE = '100644',
    EXECUTABLE_FILE = '100755',
    SYMBOLIC_LINK = '120000',
}