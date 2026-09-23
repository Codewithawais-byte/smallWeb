import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import dns from "node:dns/promises";

dns.setServers(["1.1.1.1", "1.0.0.1", "8.8.8.8"]);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  });
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
