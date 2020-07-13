const fs = require('fs'), path = require('path'), util = require('util');

var instance = null;

function Modules() {
  if(arguments.callee._singletonInstance) {
    return arguments.callee._singletonInstance;
  }
  arguments.callee._singletonInstance = this;
  this.modules = new Map();
}

const getDirectories = source => fs.readdirSync(source, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)

Modules.prototype.loadModules = async (directory) => {
  fs.access(directory, function(err) {
    if (err) new Error(`Folder does not Exist or has Access Permission Issues: ${directory}`);
    else {
      const directories = getDirectories(directory);
      for(const dir of directories) {
        try {
          var module = require(path.join(directory, dir, `${dir}.js`));
            module.settings = require(path.join(directory, dir, `${dir}.json`));
            console.log(`Loaded Module[${module.name}] from File (/modules/${dir}/${dir}.js)`);
            console.log(`Loaded Module Settings[${module.name}] from File (/modules/${dir}/${dir}.json)`);
            if (module.settings.active) {
              module.activate();
              console.log(`Actived Module[${module.name}]`);
            }
            instance.modules.set(dir, module);

        } catch(e) {
          console.error(`Error Attempting to Load Module(${dir}) located at: ${path.join(directory, dir)}`);
          console.error(e);
        }
      }
    }
  });
}

Modules.prototype.getModulesOutput = () => {
  var data = {};
  for (var module of instance.modules.entries()) {
    var value = module[1];
    if (!value.settings.active) return;
    data[value.varname] = value.output;
  }
  return data;
}

Modules.prototype.getModule = (module) => {
    const data = instance.modules.get(module);
    if (!data) {
      return null;
    }
    else return module;
}

module.exports = function() {
  return instance || (instance = new Modules());
}();
