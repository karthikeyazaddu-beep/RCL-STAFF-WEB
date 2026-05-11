import { Request, Response, NextFunction } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!req.session.discordId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  next();
}

export async function requireApproved(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!req.session.discordId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.discordId, req.session.discordId));
  if (!user || (user.status !== "approved" && user.role !== "owner")) {
    res.status(403).json({ error: "Access denied" });
    return;
  }
  next();
}

export async function requireHicom(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!req.session.discordId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.discordId, req.session.discordId));
  if (!user || !["owner", "hicom"].includes(user.role)) {
    res.status(403).json({ error: "HICOM access required" });
    return;
  }
  next();
}

export async function requireOwner(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!req.session.discordId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.discordId, req.session.discordId));
  if (!user || user.role !== "owner") {
    res.status(403).json({ error: "Owner access required" });
    return;
  }
  next();
}
