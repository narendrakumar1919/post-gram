require("dotenv").config();
require("./config/global");
require("./database");

const fastify = require("fastify")({ logger: true });

fastify.register(require("@fastify/cors"), {
  origin: "*",
  methods: ["PUT", "POST", "DELETE", "GET"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "authorization",
    "Accept-Encoding",
  ],
});

fastify.register(require("@fastify/helmet"), {
  hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
  frameguard: { action: "deny" },
  referrerPolicy: { policy: "same-origin" },
});

fastify.register(require("@fastify/formbody"));

// Declare routes
const routes = require("./routes");
routes.forEach((route) => {
  const base_path = "/api/";
  route.url = base_path + route.url;
  fastify.route(route);
});

fastify.get("/", (request, reply) => {
  reply.send({ hello: "world" });
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
