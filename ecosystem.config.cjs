module.exports = {
  apps: [
    {
      name: "shopify-react",
      cwd: "/home/digit/Documents/ShopifyAIAdmin/shopify_react",
      script: "node_modules/.bin/serve",
      args: "-s build -l 3008",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
