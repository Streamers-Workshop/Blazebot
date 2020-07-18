const fs = require('fs');
const path = require('path');

var instance = null; // eslint-disable-line no-var

const AsciiTable = require('ascii-table');

function Processors() {
  if (arguments.callee._singletonInstance) {
    return arguments.callee._singletonInstance;
  }
  arguments.callee._singletonInstance = this;
  this.processors = new Map();
}

const processorsTable = new AsciiTable('PROCESSORS');
processorsTable.setHeading('PROCESSOR', 'STATE');

const getDirectories = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

Processors.prototype.loadProcessors = async (directory) => {
  fs.access(directory, (err) => {
    if (err) throw new Error(`Folder does not Exist or has Access Permission Issues: ${directory}`);
    else {
      const directories = getDirectories(directory);
      for (const dir of directories) {
        try {
          const processor = require(path.join(directory, dir, `${dir}.js`));
          processor.settings = require(path.join(directory, dir, `${dir}.json`));
          processorsTable.addRow(processor.name, 'LOADED');
          instance.processors.set(processor.name, processor);
          if (processor.settings.active) {
            const mod = instance.processors.get(processor.name);
            mod.activate();
            console.log(`Actived Processor[${processor.name}]`);
          }
        } catch (e) {
          console.error(
            `Error Attempting to Load Processor(${dir}) located at: ${path.join(directory, dir)}`,
          );
          console.error(e);
        }
      }
    }
    console.log(processorsTable.toString());
  });
};

Processors.prototype.getProcessorsOutput = () => {
  const data = {};
  /* eslint-disable no-unused-vars */
  for (const [key, value] of instance.processors.entries()) {
    if (value.settings.active) {
      data[value.varname] = value.output;
    }
  }
  /* eslint-enable no-unused-vars */
  return data;
};

Processors.prototype.getProcessor = (processor) => {
  const data = instance.processors.get(processor);
  if (!data) {
    return null;
  }
  return data;
};

module.exports = (() => {
  if (!instance) instance = new Processors();
  return instance;
})();
