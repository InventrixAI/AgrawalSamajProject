// Configuration validation
export function validateConfig() {
  const requiredEnvVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

  const serverOnlyEnvVars = ["SUPABASE_SERVICE_ROLE_KEY"]

  // Check public env vars
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`)
    }
  }

  // Check server-only env vars (only in server context)
  if (typeof window === "undefined") {
    for (const envVar of serverOnlyEnvVars) {
      if (!process.env[envVar]) {
        console.warn(`Missing server environment variable: ${envVar}`)
      }
    }
  }
}

export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  blob: {
    token: process.env.BLOB_READ_WRITE_TOKEN,
  },
}
