const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");

module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // Human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLL yyyy");
  });

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // To Support .yaml Extension in _data
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Copy Static Files to /_site
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
    "./node_modules/alpinejs/dist/cdn.min.js": "./static/js/alpine.js",
    "./node_modules/prismjs/themes/prism-tomorrow.css": "./static/css/prism-tomorrow.css",
  });

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("./src/static/img");

  // Copy CSS Folder
  eleventyConfig.addPassthroughCopy("./src/css");

  // Copy favicon to root of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }
    return content;
  });

  // Define a collection for 'news' items
  eleventyConfig.addCollection("news", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/news/*.md").reverse(); // Ensures latest news is first
  });

  eleventyConfig.addCollection("slides", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/slides/*.md");
  });

  eleventyConfig.addCollection("people", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/people/*.md");
  });

  // Collection for all publications
  eleventyConfig.addCollection("publications", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/publications/*.md");
  });

  // Collection for selected publications
  eleventyConfig.addCollection("selectedPublications", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/publications/*.md").filter(function (item) {
      return item.data.selected === true;
    });
  });

  eleventyConfig.addCollection("research", function (collectionApi) {
      return collectionApi.getFilteredByGlob("src/research/*.md");
  });

  
  

  // Let Eleventy transform HTML files as Nunjucks
  return {
    dir: {
      input: "src",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
  };
};


