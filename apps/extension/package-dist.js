const fs = require("fs");

async function createZip() {
  const { ZipArchive } = await import("archiver");

  const output = fs.createWriteStream(
    __dirname + "/karrio-extension-dist.zip"
  );

  const archive = new ZipArchive({
    zlib: { level: 9 },
  });

  archive.pipe(output);

  archive.glob("**/*", {
    cwd: __dirname,
    ignore: [
      "node_modules/**",
      ".git/**",
      ".plasmo/**",
      ".turbo/**",
      "build/**",
      "karrio-extension-dist.zip",
      "package-dist.js",
    ],
  });

  await archive.finalize();
}

createZip().catch(console.error);