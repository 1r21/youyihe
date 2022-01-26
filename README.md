## `taishan` common package

- network request
- util functions

## Usage

inject `__API_HOST__` variable is required

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

## Note

- `youyihe` is a river in front of my house
