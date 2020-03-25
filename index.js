const fs = require("fs");
const path = require("path");
const glob = require("glob");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

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
  if (versionMatch && versionMatch[1]) {
    const foundVersionNumber = versionMatch[1];

    const updatedFile = fileContents.replace(
      // escape dots in version string, so they are dot character literals
      RegExp(foundVersionNumber.replace(/\./g, "\\."), "g"),
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
async function prepare(
  { files, callback },
  { cwd, nextRelease: { version }, logger }
) {
  // handle both array and string
  const filesArray = typeof files === "string" ? [files] : files;

  filesArray.forEach(filesMatchString => {
    if (filesMatchString.length) {
      const foundFiles = glob.sync(path.join(cwd, filesMatchString));
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

  if (callback) {
    logger.log(`executing callback: ${callback}`);
    const { stdout, stderr } = await exec(callback, { cwd });
    if (stdout) {
      logger.log(stdout);
    }
    if (stderr) {
      logger.error(stderr);
    }
  }
}

module.exports = { prepare };
