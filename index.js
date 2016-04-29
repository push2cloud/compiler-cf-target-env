const debug = require('debug')('push2cloud-compiler-cf-target-env');
const path = require('path');
const fs = require('fs');

const ref = (dir, deploymentMani, next) => {
  if (!deploymentMani.target || deploymentMani.target.type !== 'cloudfoundry') return next(null, deploymentMani);

  const pathToDeploymentManifest = path.join(dir, 'deploymentManifest.json');

  if (process.env.CF_SPACE) {
    deploymentMani.target.space = process.env.CF_SPACE;
  }

  if (process.env.CF_ORG) {
    deploymentMani.target.org = process.env.CF_ORG;
  }

  if (process.env.CF_API) {
    deploymentMani.target.api = process.env.CF_API;
  }

  // force to re-require this file
  delete require.cache[require.resolve(pathToDeploymentManifest)];

  debug(`writing ${pathToDeploymentManifest}...`);
  fs.writeFile(pathToDeploymentManifest, JSON.stringify(deploymentMani, null, 2), (err) => {
    next(err, deploymentMani);
  });
};

module.exports = {
  afterGetDeploymentManifest: ref
};
