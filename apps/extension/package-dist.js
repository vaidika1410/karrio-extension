const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const output = fs.createWriteStream(
  path.join(__dirname, "karrio-extension-dist.zip")
);

const archive = archiver("zip", {
  zlib: { level: 9 },
});

archive.pipe(output);

const excluded = [
  "node_modules/**",
  ".git/**",
  ".plasmo/**",
  ".turbo/**",
  "build/**",
  "karrio-extension-dist.zip",
  "package-dist.js",
];

archive.glob("**/*", {
  cwd: __dirname,
  ignore: excluded,
});

output.on("close", () => {
  console.log(
    `Created karrio-extension-dist.zip (${archive.pointer()} bytes)`
  );
});

archive.on("error", (err) => {
  throw err;
});

archive.finalize();