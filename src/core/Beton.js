import { camelCase } from 'lodash';

class Beton {
  constructor() {
    this.resolvedModules = new Map();
    this.waitingModules = new Map();
  }

  define({ id, dependencies = [], init = () => {} }) {
    if (!id) {
      throw Error(
        `[BETON] You tried to define a module without id. It needs to be a string like {id: 'module-name', ...}`
      );
    }
    
    this.waitingModules.set(id, { dependencies, init });
    this.tryToResolve();
  }

  tryToResolve() {
    let resolvedANewModule = false;

    this.waitingModules.forEach(({ init, dependencies }, id) => {
      if (dependencies.every(depId => this.has(depId))) {
        const dependencyMap = dependencies.reduce((map, depId) => ({
          ...map,
          [camelCase(depId)]: this.get(depId)
        }), {});

        const module = init(dependencyMap);
        this.waitingModules.delete(id);
        this.resolvedModules.set(id, module);
        
        // Add as instance property for backward compatibility
        this[camelCase(id)] = module;
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`[BETON] Resolved module - ${id}`);
        }
        
        resolvedANewModule = true;
      }
    });

    if (resolvedANewModule) {
      this.tryToResolve();
    }
  }

  has(...ids) {
    return ids.every(id => this.resolvedModules.has(id));
  }

  get(id) {
    const module = this.resolvedModules.get(id);
    if (!module) {
      throw new Error(`[BETON] Module '${id}' not found`);
    }
    return module;
  }
}

// Create singleton instance
const instance = new Beton();
export default instance;

// For backward compatibility
window.BETON = instance;
