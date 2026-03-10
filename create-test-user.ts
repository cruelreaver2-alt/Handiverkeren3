/**
 * Script for å opprette testbruker for leverandør
 * Kjør: node create-test-user.ts
 */

const projectId = "bfxqoasgmtxgeyefaxks";
const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmeHFvYXNnbXR4Z2V5ZWZheGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNDIwMDIsImV4cCI6MjA4ODcxODAwMn0.8yzkvQMnnZGX3QbA48HJA9ZHw_DhrYSRXG2waSwSOIc";

async function createTestUser() {
  try {
    const url = `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/auth/signup`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        email: "test@test.no",
        password: "Test123",
        name: "Test Leverandør",
        role: "supplier",
        company: "Test AS"
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Feil ved opprettelse av bruker:");
      console.error(data);
      return;
    }

    console.log("✅ Testbruker opprettet!");
    console.log("📧 E-post: test@test.no");
    console.log("🔒 Passord: Test123");
    console.log("👤 Rolle: Leverandør");
    console.log("\nBruker-ID:", data.userId);
    console.log("\nDu kan nå logge inn på leverandørportalen.");
    
  } catch (error) {
    console.error("❌ Nettverksfeil:", error);
  }
}

createTestUser();
