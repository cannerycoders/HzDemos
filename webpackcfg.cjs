const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const { LicenseWebpackPlugin } = require("license-webpack-plugin");

// -----------------------------------------------------------------------------
// Projects
// -----------------------------------------------------------------------------
//
// Each project gets:
//   src/<name>/index.js      → _dist/<name>/index.js
//   src/<name>/index.html    → _dist/<name>/index.html
//   src/<name>/img/...       → _dist/<name>/img/...
//   src/<name>/snd/...       → _dist/<name>/snd/...
//
// Add additional projects here as they are created.
//

const projects = [
  {
    name: "index",
    source: "src",
    destination: ".",
  },
  {
    name: "quakesounds/index",
    source: "src/quakesounds",
    destination: "quakesounds"
  },
  {
    name: "grainfilter/index",
    source: "src/grainfilter",
    destination: "grainfilter"
  },
];

module.exports = (env, argv) =>
{
  const isProduction = argv.mode === "production";

  // ---------------------------------------------------------------------------
  // Entry points
  // ---------------------------------------------------------------------------

  const entry = {};

  for (const project of projects)
  {
    entry[project.name] = `./${project.source}/index.js`;
  }

  // ---------------------------------------------------------------------------
  // Static assets
  // ---------------------------------------------------------------------------
  //
  // Copy everything belonging to each project except JavaScript files.
  // JavaScript is handled by webpack.
  //
  // The directory structure beneath each project is preserved.
  
  const copyPatterns = [];

  for (const project of projects)
  {
    copyPatterns.push({
      from: project.source,
      to: project.destination,
      globOptions: {
        ignore: [
          "**/*.js",
          "**/_nopub/**",
        ],
      },
    });
  }

  return {
    mode: isProduction ? "production" : "development",
    entry,
    output: {
      path: path.resolve(__dirname, "_dist"),
      filename: "[name].js",
      clean: true,
    },
    resolve: { 
      alias: { 
        "@hzbridge": path.resolve(__dirname, "src/hzbridge"), 
      }, 
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: copyPatterns,
      }),
  
      new LicenseWebpackPlugin({
        outputFilename: "index.js.LICENSE2.txt",
        perChunkOutput: false,
        addBanner: false,
      }),
    ],
    devtool: isProduction ? false : "source-map",
    optimization: {
      minimize: isProduction,
    },
  };
};
