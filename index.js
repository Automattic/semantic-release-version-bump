const fs = require("fs");
const path = require("path");
const glob = require("glob");

/**
 * @param {string} filePath path to file
 * @param {string} newVersion new version number
 */
function bumpVersionInFile(filePath, newVersion) {
  const fileContents = fs.readFileSync(filePath, {
    encoding: "utf8"
  });
  const versionRegex = /Version:\s*(.*)/;
  const versionMatch = fileContents.match(versionRegex);
  if (versionMatch) {
    const foundVersionNumber = versionMatch[1];

    const updatedFile = fileContents.replace(
      RegExp(foundVersionNumber, "g"),
      newVersion
    );

    fs.writeFileSync(filePath, updatedFile, {
      encoding: "utf8"
    });

    return { foundVersionNumber };
  }
}

/**
 * @param {Object} pluginConfig pluginConfig
 * @param {Object} context context
 */
async function prepare({ files }, { cwd, nextRelease: { version }, logger }) {
  // handle both array and string
  const filesArray = typeof files === "string" ? [files] : files;

  filesArray.forEach(filesMatchString => {
    glob(path.join(cwd, filesMatchString), function(error, foundFiles) {
      if (error) {
        logger.log("Error");
      } else {
        foundFiles.map(file => {
          const { foundVersionNumber } = bumpVersionInFile(file, version);
          logger.log(
            "Write version %s to %s (found: %s)",
            version,
            path.relative(cwd, file),
            foundVersionNumber
          );
        });
      }
    });
  });
}

module.exports = { prepare };
