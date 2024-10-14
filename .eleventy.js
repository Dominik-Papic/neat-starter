const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");
const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
  // Use custom Markdown parser
  const markdownLib = markdownIt({ html: true });
  eleventyConfig.setLibrary("md", markdownLib);
  
  eleventyConfig.addFilter("markdown", (content) => {
    return markdownLib.render(content);
  });

  // Human-readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLL yyyy");
  });

  // Syntax highlighting for code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // Support for YAML files
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Copy static files
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
    "./node_modules/alpinejs/dist/cdn.min.js": "./static/js/alpine.js",
    "./node_modules/prismjs/themes/prism-tomorrow.css": "./static/css/prism-tomorrow.css",
  });

  eleventyConfig.addPassthroughCopy("./src/static/img");
  eleventyConfig.addPassthroughCopy("./src/css");
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
    }
    return content;
  });

  // Collections
  eleventyConfig.addCollection("news", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/news/*.md").reverse();
  });

  eleventyConfig.addCollection("slides", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/slides/*.md");
  });

  eleventyConfig.addCollection("people", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/people/*.md");
  });

  eleventyConfig.addCollection("publications", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/publications/*.md").reverse();
  });

  eleventyConfig.addCollection("selectedPublications", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/publications/*.md").filter(item => item.data.selected).reverse();
  });

  eleventyConfig.addCollection("research", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/research/*.md");
  });

  eleventyConfig.addCollection("contact", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/contact/*.md");
  });

  eleventyConfig.addCollection("welcome", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/welcome/*.md");
  });

  eleventyConfig.addCollection("people-uvod", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/peopleuvod/*.md");
  });

  return {
    dir: {
      input: "src",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
  };
};
