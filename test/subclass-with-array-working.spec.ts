import { InterfaceDeclaration, TypescriptParser } from 'typescript-parser';
import { NgOpenApiGen } from '../lib/ng-openapi-gen';
import options from './subclass-with-array-working.config.json';
import subclassWithArraySpec from './subclass-with-array-working.json';

const gen = new NgOpenApiGen(subclassWithArraySpec, options);
gen.generate();

describe('Generation tests using subclass-with-array-working.json', () => {
  it('Entity model', done => {
    const entity = gen.models.get('Entity');
    const ts = gen.templates.apply('model', entity);
    const parser = new TypescriptParser();
    parser.parseSource(ts).then(ast => {
      expect(ast.declarations.length).toBe(1);
      expect(ast.declarations[0]).toEqual(jasmine.any(InterfaceDeclaration));
      const decl = ast.declarations[0] as InterfaceDeclaration;
      expect(decl.name).toBe('Entity');
      expect(decl.properties.length).toBe(1);
      const list = decl.properties[0];
      expect(list.name).toBe('list');
      expect(list.type).toBe('Array<number>');
      done();
    });
  });

  it('Subclass model', done => {
    const subclass = gen.models.get('SubClass');
    const ts = gen.templates.apply('model', subclass);
    const parser = new TypescriptParser();
    parser.parseSource(ts).then(ast => {
      expect(ast.imports.find(i => i.libraryName === './entity')).withContext('entity import').toBeDefined();
      expect(ast.declarations.length).toBe(1);
      expect(ast.declarations[0]).toEqual(jasmine.any(InterfaceDeclaration));
      const decl = ast.declarations[0] as InterfaceDeclaration;
      expect(decl.name).toBe('SubClass');
      expect(decl.properties.length).toBe(1);
      const array = decl.properties.find(p => p.name === 'array');
      expect(array).withContext('array property').toBeDefined();
      if (array) {
        expect(array.type).toBe('Array<number>');
      }
      done();
    });
  });
});
