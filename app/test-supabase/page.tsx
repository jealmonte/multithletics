import { createClient } from "@/lib/supabase/server"

export default async function TestSupabasePage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Supabase Test</h1>
      <pre className="mt-4 rounded border p-4 text-sm">
        {JSON.stringify({ user: data.user, error }, null, 2)}
      </pre>
    </div>
  )
}