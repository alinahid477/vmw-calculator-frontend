const env = process.env.NODE_ENV || 'development';
console.log(env);
const config = require(`./environments/${env.toLowerCase()}`).default;
console.log(config);
export default config;