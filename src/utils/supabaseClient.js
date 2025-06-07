// src/utils/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rttzoqbaodauytfqowhm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0dHpvcWJhb2RhdXl0ZnFvd2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNjA3ODUsImV4cCI6MjA2NDYzNjc4NX0.VnduBq3YKbXFe2T1TQrKoRD5k13pYOU6yQzdw7R7PmA"; // ඔයාගේ anon/public key
export const supabase = createClient(supabaseUrl, supabaseKey);
