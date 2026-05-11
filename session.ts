import session from "express-session";
import connectPgSimple from "connect-pg-simple";

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set");
}

const PgStore = connectPgSimple(session);

const store = new PgStore({
  conString: process.env.DATABASE_URL,
  tableName: "sessions",
});

export const sessionMiddleware = session({
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
});

declare module "express-session" {
  interface SessionData {
    discordId?: string;
    username?: string;
    discriminator?: string;
    avatar?: string;
    accessToken?: string;
  }
}
