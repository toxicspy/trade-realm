import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Seed data on startup
  await storage.seedData();

  app.get(api.news.list.path, async (req, res) => {
    const region = req.query.region as string | undefined;
    const date = req.query.date as string | undefined;
    const news = await storage.getMarketNews(region, date);
    res.json(news);
  });

  app.get(api.indices.list.path, async (req, res) => {
    const region = req.query.region as string | undefined;
    const indices = await storage.getMarketIndices(region);
    res.json(indices);
  });

  app.get("/api/indices/india-market", async (req, res) => {
    const indices = await storage.getIndiaMarketIndices();
    res.json(indices);
  });

  app.get(api.crypto.list.path, async (req, res) => {
    const prices = await storage.getCryptoPrices();
    res.json(prices);
  });

  return httpServer;
}
