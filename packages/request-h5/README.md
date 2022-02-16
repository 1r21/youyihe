# @1r21/request-h5

## Usage Note

> inject `__API_HOST__` variable is required

- vite

  ```js
  export default defineConfig({
    // ...
    define: {
      __API_HOST__: JSON.stringify("https://dev.example.com"),
    },
  });
  ```

- webpack

  ```js
  module.exports = {
    // ...
    plugins: [
      new webpack.DefinePlugin({
        __API_HOST__: JSON.stringify("https://dev.example.com"),
      });
    ],
  };
  ```

- babel (use `babel-plugin-transform-define`)
  ```
  {
    "plugins": [
      ["transform-define", {
        __API_HOST__: JSON.stringify("https://dev.example.com"),
      }]
    ]
  }
  ```
