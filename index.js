const fs = require("fs");
const path = require("path");
const glob = require("glob");

/**
 * @param {string} filePath path to file
 * @param {string} newVersion new version number
 */
function bumpVersionInFile(filePath, newVersion) {
  const phpFile = fs.readFileSync(filePath, {
    encoding: "utf8"
  });
  const fileWithNewVersion = phpFile.replace(
    /(Version:\s*).*/,
    `\$1${newVersion}`
  );

  fs.writeFileSync(filePath, fileWithNewVersion, {
    encoding: "utf8"
  });
}

/**
 * @param {Object} pluginConfig pluginConfig
 * @param {Object} context context
 */
async function prepare({ files }, { cwd, nextRelease: { version }, logger }) {
  glob(path.join(cwd, files), function(error, foundFiles) {
    if (error) {
      logger.log("Error");
    } else {
      foundFiles.map(file => {
        logger.log("Write version %s to %s", version, path.relative(cwd, file));
        return bumpVersionInFile(file, version);
      });
    }
  });
}

module.exports = { prepare };
