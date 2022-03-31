export default class File {
  protected lines: string[] = [];

  protected sep: string;

  constructor(sep: string = '\r\n') {
    this.sep = sep;
  }

  public write(...lines: string[]) {
    this.lines.push(...lines);
  }

  public toString() {
    return this.lines.join(this.sep);
  }

  public addMarker(prefix: string = '//~~ ') {
    this.write(`${prefix}This is a generated file. Any modifications made will be overwritten`);
  }
}
