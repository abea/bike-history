module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "apostrophe"],
  "rules": {
    "no-console": [1, {
      "allow": ["info", "error"]
    }],
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  },
  parserOptions: {
    parser: "babel-eslint"
  }
}
