const fs = require('fs');
const path = require('path');

var instance = null; // eslint-disable-line no-var

const AsciiTable = require('ascii-table');

function Services() {
  if (arguments.callee._singletonInstance) {
    return arguments.callee._singletonInstance;
  }
  arguments.callee._singletonInstance = this;
  this.services = new Map();
}

const servicesTable = new AsciiTable('SERVICES');
servicesTable.setHeading('SERVICE', 'STATE');

const getDirectories = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

Services.prototype.loadServices = async (directory) => {
  fs.access(directory, (err) => {
    if (err) throw new Error(`Folder does not Exist or has Access Permission Issues: ${directory}`);
    else {
      const directories = getDirectories(directory);
      for (const dir of directories) {
        try {
          const service = require(path.join(directory, dir, `${dir}.js`));
          service.settings = require(path.join(directory, dir, `${dir}.json`));
          servicesTable.addRow(service.name, 'LOADED');
          console.log(service);
          instance.services.set(service.name, service);
          if (service.settings.active) {
            const mod = instance.services.get(service.name);
            console.log(mod);
            mod.activate();
            console.log(`Actived Service[${instance.service.name}]`);
          }
        } catch (e) {
          console.error(
            `Error Attempting to Load Service(${dir}) located at: ${path.join(directory, dir)}`,
          );
          console.error(e);
        }
      }
    }
    console.log(servicesTable.toString());
  });
};

Services.prototype.getServicesOutput = () => {
  const data = {};
  /* eslint-disable no-unused-vars */
  for (const [key, value] of instance.services.entries()) {
    if (value.settings.active) {
      data[value.varname] = value.output;
    }
  }
  /* eslint-enable no-unused-vars */
  return data;
};

Services.prototype.getService = (service) => {
  const data = instance.services.get(service);
  if (!data) {
    return null;
  }
  return data;
};

module.exports = (() => {
  if (!instance) instance = new Services();
  return instance;
})();
