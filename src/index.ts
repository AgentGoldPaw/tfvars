enum variableType {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  list = 'list',
  map = 'map',
}

interface TFVariable<valueType> {
  name: string;
  type: variableType;
  value: valueType;
  toString(): string;
}

class Variable<valueType> {
  name: string;
  type: variableType;
  value: valueType;

  constructor(name: string, type: variableType, value: valueType) {
    this.name = name;
    this.type = type;
    this.value = value;
  }
}

class TFList extends Variable<any[]> implements TFVariable<any[]> {
  constructor(name: string, value: any[]) {
    super(name, variableType.list, value);
  }

  toString(): string {
    let result = `${this.name} = [\n`;
    this.value.forEach((value) => {
      switch (typeof value) {
        case 'string':
          result += `"${value}",\n`;
          break;
        case 'number':
          result += `${value},\n`;
          break;
        case 'boolean':
          result += `${value},\n`;
          break;
        case 'object':
          const map = new Map(Object.entries(value));
          result += `${new TFMap('', map)}\n`;
          break;
        default:
          break;
      }
    });
    return result + ']';
  }
}

class TFMap
  extends Variable<Map<string, any>>
  implements TFVariable<Map<string, any>>
{
  constructor(name: string, value: Map<string, any>) {
    super(name, variableType.map, value);
  }

  toString(): string {
    let result = '';
    if (this.name !== '') {
      result = `${this.name} = object({\n`;
    } else {
      result = `object({\n`;
    }

    this.value.forEach((value, key) => {
      switch (typeof value) {
        case 'string':
          result += `   ${new TFString(key, value)}\n`;
          break;
        case 'number':
          result += `   ${new TFNumber(key, value)}\n`;
          break;
        case 'boolean':
          result += `   ${new TFBoolean(key, value)}\n`;
          break;
        case 'object':
          result += `   ${new TFMap(key, value)}\n`;
          break;
        default:
          break;
      }
    });
    return result + '})';
  }
}

class TFString extends Variable<string> implements TFVariable<string> {
  constructor(name: string, value: string) {
    super(name, variableType.string, value);
  }

  toString(): string {
    return `${this.name} = "${this.value}"`;
  }
}

class TFNumber extends Variable<number> implements TFVariable<number> {
  constructor(name: string, value: number) {
    super(name, variableType.number, value);
  }

  toString(): string {
    return `${this.name} = ${this.value}`;
  }
}

class TFBoolean extends Variable<boolean> implements TFVariable<boolean> {
  constructor(name: string, value: boolean) {
    super(name, variableType.boolean, value);
  }

  toString(): string {
    return `${this.name} = ${this.value}`;
  }
}

export default class TFVars {
  private filename: string;
  private variables: TFVariable<any>[] = [];
  constructor(fileName?: string) {
    if (fileName) this.filename = fileName;
  }

  public addString(name: string, value?: string): TFVars {
    return this.addVariable(name, variableType.string, value);
  }

  public addNumber(name: string, value?: number): TFVars {
    return this.addVariable(name, variableType.number, value);
  }

  public addBoolean(name: string, value?: boolean): TFVars {
    return this.addVariable(name, variableType.boolean, value);
  }

  public addMap(name: string, value?: Map<string, any>): TFVars {
    return this.addVariable(name, variableType.map, value);
  }

  public addList(name: string, value?: any[]): TFVars {
    return this.addVariable(name, variableType.list, value);
  }

  private addVariable(name: string, type: variableType, value: any): TFVars {
    switch (type) {
      case variableType.string:
        this.variables.push(new TFString(name, value));
        break;
      case variableType.number:
        this.variables.push(new TFNumber(name, value));
        break;
      case variableType.boolean:
        this.variables.push(new TFBoolean(name, value));
        break;
      case variableType.map:
        this.variables.push(new TFMap(name, value));
        break;
      case variableType.list:
        this.variables.push(new TFList(name, value));
        break;
      default:
        break;
    }
    return this;
  }

  public write(path: string): void {}

  public stdout(): void {
    console.log(this.compile());
  }

  private compile(): string {
    let result = '';
    this.variables.forEach((variable) => {
      result += `${variable}\n`;
    });
    return result;
  }
}
