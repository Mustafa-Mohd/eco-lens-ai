import { supabase } from "./src/integrations/supabase/client.js";

async function run() {
  const { data, error } = await supabase.from("profiles").select("*");
  console.log(data, error);
}

run();
