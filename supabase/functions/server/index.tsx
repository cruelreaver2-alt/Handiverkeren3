import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-8d200dba/health", (c) => {
  return c.json({ status: "ok" });
});

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

// Sign up a new user
app.post("/make-server-8d200dba/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, role, company } = body;

    if (!email || !password || !name || !role) {
      return c.json({ error: "email, password, name, and role are required" }, 400);
    }

    // Create Supabase admin client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
    );

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        role,
        company: company || null,
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (authError) {
      console.log("Auth error creating user:", authError);
      return c.json({ error: authError.message || "Kunne ikke opprette bruker" }, 400);
    }

    const userId = authData.user.id;

    // Create profile based on role
    if (role === "customer") {
      const customerProfile = {
        id: userId,
        name,
        email,
        memberSince: new Date().getFullYear().toString(),
        emailVerified: true,
        totalRequests: 0,
        activeRequests: 0,
        completedRequests: 0,
        createdAt: new Date().toISOString(),
      };
      await kv.set(`customer-profile:${userId}`, customerProfile);
    } else if (role === "supplier") {
      const supplierProfile = {
        id: userId,
        name,
        company: company || name,
        email,
        verified: false,
        memberSince: new Date().getFullYear().toString(),
        completedJobs: 0,
        rating: 0,
        reviewCount: 0,
        responseTime: "Ny",
        responseRate: 0,
        categories: [],
        createdAt: new Date().toISOString(),
      };
      await kv.set(`supplier-profile:${userId}`, supplierProfile);
    }

    // Send welcome email
    const dashboardUrl = role === "customer" 
      ? window.location?.origin + "/dashboard" 
      : window.location?.origin + "/leverandør-dashboard";
    
    const emailTemplate = getEmailTemplate(
      role === "customer" ? "welcome_customer" : "welcome_supplier",
      { name, dashboardUrl }
    );

    await sendEmail({
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      type: role === "customer" ? "welcome_customer" : "welcome_supplier",
      metadata: { name, role },
    });

    return c.json({ 
      userId,
      email,
      name,
      role,
      message: "Bruker opprettet og velkommen-e-post sendt!",
    }, 201);

  } catch (error) {
    console.log("Error during signup:", error);
    return c.json({ error: "Kunne ikke opprette bruker", details: String(error) }, 500);
  }
});

// Get all products or search by category/query
app.get("/make-server-8d200dba/products", async (c) => {
  try {
    const category = c.req.query("category");
    const search = c.req.query("search");
    
    // Get all products from KV store
    const allProducts = await kv.getByPrefix("product:");
    
    let filteredProducts = allProducts;
    
    // Filter by category if provided
    if (category) {
      filteredProducts = filteredProducts.filter((p: any) => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter((p: any) => 
        p.name.toLowerCase().includes(searchLower) ||
        p.brand.toLowerCase().includes(searchLower) ||
        p.model.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }
    
    return c.json({ products: filteredProducts });
  } catch (error) {
    console.log("Error fetching products:", error);
    return c.json({ error: "Failed to fetch products", details: String(error) }, 500);
  }
});

// Get product by ID
app.get("/make-server-8d200dba/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const product = await kv.get(`product:${id}`);
    
    if (!product) {
      return c.json({ error: "Product not found" }, 404);
    }
    
    return c.json({ product });
  } catch (error) {
    console.log("Error fetching product:", error);
    return c.json({ error: "Failed to fetch product", details: String(error) }, 500);
  }
});

// Initialize product database with sample data
app.post("/make-server-8d200dba/products/init", async (c) => {
  try {
    const products = [
      // Varmepumper
      {
        id: "vp-001",
        name: "Nibe F2120 Varmepumpe",
        brand: "Nibe",
        model: "F2120",
        category: "varmepumpe",
        subcategory: "luft-til-luft",
        description: "Energieffektiv luft-til-luft varmepumpe for oppvarming og kjøling",
        specs: {
          capacity: "12 kW",
          energyClass: "A+++",
          noise: "22 dB",
          coverage: "100-150 m²"
        },
        price: 35000,
        image: "https://images.unsplash.com/photo-1631545806609-ebb37c8c747c?w=400",
        requiresInstallation: true,
        installationComplexity: "medium"
      },
      {
        id: "vp-002",
        name: "Mitsubishi Electric MSZ-LN35VG",
        brand: "Mitsubishi Electric",
        model: "MSZ-LN35VG",
        category: "varmepumpe",
        subcategory: "luft-til-luft",
        description: "Premium varmepumpe med WiFi og smart styring",
        specs: {
          capacity: "3.5 kW",
          energyClass: "A+++",
          noise: "19 dB",
          coverage: "25-35 m²"
        },
        price: 22000,
        image: "https://images.unsplash.com/photo-1631545806609-ebb37c8c747c?w=400",
        requiresInstallation: true,
        installationComplexity: "medium"
      },
      {
        id: "vp-003",
        name: "Thermia Atria 10",
        brand: "Thermia",
        model: "Atria 10",
        category: "varmepumpe",
        subcategory: "bergvarme",
        description: "Komplett bergvarmepumpe for helårs oppvarming",
        specs: {
          capacity: "10 kW",
          energyClass: "A++",
          temperature: "-15°C til +25°C",
          coverage: "150-200 m²"
        },
        price: 85000,
        image: "https://images.unsplash.com/photo-1631545806609-ebb37c8c747c?w=400",
        requiresInstallation: true,
        installationComplexity: "high"
      },
      
      // Varmtvannsbereder
      {
        id: "vvb-001",
        name: "OSO Super S 200",
        brand: "OSO",
        model: "Super S 200",
        category: "varmtvannsbereder",
        subcategory: "elektrisk",
        description: "200 liters elektrisk varmtvannsbeholder med ekstra isolasjon",
        specs: {
          capacity: "200 liter",
          power: "3 kW",
          efficiency: "B",
          heatingTime: "4 timer"
        },
        price: 12500,
        image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400",
        requiresInstallation: true,
        installationComplexity: "medium"
      },
      {
        id: "vvb-002",
        name: "OSO Saga S 120",
        brand: "OSO",
        model: "Saga S 120",
        category: "varmtvannsbereder",
        subcategory: "elektrisk",
        description: "Kompakt 120 liter varmtvannsbeholder",
        specs: {
          capacity: "120 liter",
          power: "2 kW",
          efficiency: "B",
          heatingTime: "3 timer"
        },
        price: 8900,
        image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400",
        requiresInstallation: true,
        installationComplexity: "medium"
      },
      {
        id: "vvb-003",
        name: "Nibe VVM 320",
        brand: "Nibe",
        model: "VVM 320",
        category: "varmtvannsbereder",
        subcategory: "varmepumpe",
        description: "Varmtvannsbeholder med integrert varmepumpe",
        specs: {
          capacity: "180 liter",
          power: "2.3 kW",
          efficiency: "A+",
          heatingTime: "2 timer"
        },
        price: 28000,
        image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400",
        requiresInstallation: true,
        installationComplexity: "high"
      },
      
      // Elektrisk utstyr
      {
        id: "el-001",
        name: "Schneider Electric Exxact Sikringsskap",
        brand: "Schneider Electric",
        model: "Exxact WCT312",
        category: "elektrisk",
        subcategory: "sikringsskap",
        description: "Komplett sikringsskap med 12 poler",
        specs: {
          poles: "12",
          voltage: "230V",
          ratedCurrent: "63A",
          dimensions: "250x350x110mm"
        },
        price: 3500,
        image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400",
        requiresInstallation: true,
        installationComplexity: "high"
      },
      {
        id: "el-002",
        name: "Elko Plus Termostat",
        brand: "Elko",
        model: "Plus RT",
        category: "elektrisk",
        subcategory: "termostat",
        description: "Digital romtermostat med programmerbar tidsstyring",
        specs: {
          type: "Digital",
          voltage: "230V",
          maxLoad: "16A",
          features: "WiFi, App-styring"
        },
        price: 1200,
        image: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=400",
        requiresInstallation: true,
        installationComplexity: "low"
      },
      {
        id: "el-003",
        name: "ABB Automatsikring C16",
        brand: "ABB",
        model: "S201-C16",
        category: "elektrisk",
        subcategory: "automatsikring",
        description: "Enpolet automatsikring 16A C-karakteristikk",
        specs: {
          poles: "1",
          rating: "16A",
          characteristic: "C",
          breakingCapacity: "6kA"
        },
        price: 180,
        image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400",
        requiresInstallation: true,
        installationComplexity: "medium"
      },
      {
        id: "el-004",
        name: "Garo Ladestation Home 7.4kW",
        brand: "Garo",
        model: "GLB",
        category: "elektrisk",
        subcategory: "elbillading",
        description: "Hjemmelader for elbil med fast kabel",
        specs: {
          power: "7.4 kW",
          voltage: "230V",
          cable: "5 meter Type 2",
          features: "RFID, App"
        },
        price: 12900,
        image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400",
        requiresInstallation: true,
        installationComplexity: "high"
      },
      
      // Garasjeporter
      {
        id: "gp-001",
        name: "Crawford Compact Seksjonport",
        brand: "Crawford",
        model: "Compact",
        category: "garasjeport",
        subcategory: "seksjonport",
        description: "Isolert seksjonport med motor og fjernkontroll",
        specs: {
          width: "240 cm",
          height: "200 cm",
          insulation: "40mm",
          motor: "Inkludert"
        },
        price: 18500,
        image: "https://images.unsplash.com/photo-1590587784215-7a98a14b2ffc?w=400",
        requiresInstallation: true,
        installationComplexity: "high"
      },
      {
        id: "gp-002",
        name: "Normstahl Magic Garasjeport",
        brand: "Normstahl",
        model: "Magic 400",
        category: "garasjeport",
        subcategory: "seksjonport",
        description: "Premium garasjeport med silent motor",
        specs: {
          width: "250 cm",
          height: "212 cm",
          insulation: "42mm",
          motor: "ProMatic 4"
        },
        price: 24000,
        image: "https://images.unsplash.com/photo-1590587784215-7a98a14b2ffc?w=400",
        requiresInstallation: true,
        installationComplexity: "high"
      }
    ];
    
    // Store each product with product: prefix
    for (const product of products) {
      await kv.set(`product:${product.id}`, product);
    }
    
    return c.json({ 
      message: "Product database initialized successfully",
      count: products.length 
    });
  } catch (error) {
    console.log("Error initializing products:", error);
    return c.json({ error: "Failed to initialize products", details: String(error) }, 500);
  }
});

// ==========================================
// REQUEST ENDPOINTS
// ==========================================

// Create a new request
app.post("/make-server-8d200dba/requests", async (c) => {
  try {
    const body = await c.req.json();
    const requestId = `req-${Date.now()}`;
    
    const request = {
      id: requestId,
      ...body,
      status: "waiting", // waiting, active, quote_accepted, completed, cancelled
      offers: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`request:${requestId}`, request);
    
    return c.json({ request }, 201);
  } catch (error) {
    console.log("Error creating request:", error);
    return c.json({ error: "Failed to create request", details: String(error) }, 500);
  }
});

// Get all requests for a customer
app.get("/make-server-8d200dba/requests", async (c) => {
  try {
    const customerId = c.req.query("customerId");
    console.log(`[GET /requests] Loading requests. CustomerId filter: ${customerId || 'none'}`);
    
    const allRequests = await kv.getByPrefix("request:");
    console.log(`[GET /requests] Found ${allRequests.length} requests in database`);
    
    // Filter by customerId if provided
    let requests = allRequests;
    if (customerId) {
      requests = requests.filter((r: any) => r.customerId === customerId);
    }
    
    // Always include demo data for demo purposes
    if (!customerId) {
      const mockRequests = [
        {
          id: "req-demo-001",
          customerId: "customer-demo-001",
          category: "tak",
          title: "Nytt tak på enebolig - 150 kvm",
          description: "Trenger komplett nytt tak på enebolig. Eksisterende tak er 20 år gammelt og begynner å lekke. Ønsker tilbud på nye takstein, undertak, takrenner og stormklips. Huset er på 150 kvm takflate.",
          location: "Oslo",
          postalCode: "0566",
          budgetMin: 120000,
          budgetMax: 180000,
          startDate: "2026-04-15",
          asap: false,
          verifiedOnly: true,
          status: "open",
          createdAt: "2026-03-08T10:30:00Z",
          imageCount: 3,
        },
        {
          id: "req-demo-002",
          customerId: "customer-demo-002",
          category: "maling",
          title: "Male stue og gang - 80 kvm veggflate",
          description: "Ønsker å male stue, gang og trapp. Totalt ca 80 kvm veggflate. Vegger skal spakles og males hvit. Kan gjerne få tilbud på både grunning og toppstrøk. Forventer god håndverksmessig utførelse.",
          location: "Bergen",
          postalCode: "5067",
          budgetMin: 25000,
          budgetMax: 40000,
          startDate: null,
          asap: true,
          verifiedOnly: false,
          status: "open",
          createdAt: "2026-03-09T14:20:00Z",
          imageCount: 2,
        },
        {
          id: "req-demo-003",
          customerId: "customer-demo-003",
          category: "trevare",
          title: "Bygge terrasse 30 kvm",
          description: "Skal bygge ny terrasse på 30 kvm. Ønsker impregnert trelast, rekkverk og trapp ned til hagen. Grunn må planeres og det må legges fundamenter. Søker erfaren tømrer som kan ta hele jobben.",
          location: "Stavanger",
          postalCode: "4014",
          budgetMin: 80000,
          budgetMax: 120000,
          startDate: "2026-05-01",
          asap: false,
          verifiedOnly: true,
          status: "open",
          createdAt: "2026-03-07T09:15:00Z",
          imageCount: 1,
        },
        {
          id: "req-demo-004",
          customerId: "customer-demo-004",
          category: "elektrisk",
          title: "Oppgradering elektrisk anlegg - nytt sikringsskap",
          description: "Trenger oppgradering av elektrisk anlegg i eldre bolig. Må skifte sikringsskap og legge nye kurs til kjøkken og bad. Ønsker også 5 nye stikkontakter på kjøkken og 3 på bad. Må godkjennes av fagansvarlig elektriker.",
          location: "Trondheim",
          postalCode: "7044",
          budgetMin: 35000,
          budgetMax: 55000,
          startDate: "2026-04-01",
          asap: false,
          verifiedOnly: true,
          status: "open",
          createdAt: "2026-03-06T11:45:00Z",
          imageCount: 4,
        },
        {
          id: "req-demo-005",
          customerId: "customer-demo-005",
          category: "ror",
          title: "Nytt bad - rørleggerarbeid",
          description: "Pusser opp bad og trenger rørlegger. Skal ha ny dusjplate, nytt toalett, servant og blandebatteri. Må også legge gulvvarme under flisene. Totalt badareal er ca 8 kvm.",
          location: "Drammen",
          postalCode: "3019",
          budgetMin: 60000,
          budgetMax: 90000,
          startDate: null,
          asap: true,
          verifiedOnly: false,
          status: "open",
          createdAt: "2026-03-10T08:00:00Z",
          imageCount: 2,
        },
        {
          id: "req-demo-006",
          customerId: "customer-demo-006",
          category: "maling",
          title: "Utvendig maling av hus - 180 kvm",
          description: "Trenger utvendig maling av trehus. Huset er ca 180 kvm fasadeflate. Må høytrykkspyles, grunnes og males med 2 strøk. Ønsker hvit farge. Arbeidet må gjøres i tørt vær og forventer ferdig innen 2 uker.",
          location: "Fredrikstad",
          postalCode: "1606",
          budgetMin: 45000,
          budgetMax: 70000,
          startDate: "2026-06-01",
          asap: false,
          verifiedOnly: true,
          status: "open",
          createdAt: "2026-03-05T15:30:00Z",
          imageCount: 5,
        },
        {
          id: "req-demo-007",
          customerId: "customer-demo-007",
          category: "trevare",
          title: "Legging av parkett i stue - 45 kvm",
          description: "Skal legge eikeparkett i stue og kjøkken. Totalt 45 kvm. Har kjøpt parketten allerede (3-stav eik). Gulvet må planeres og det må legges dampsperre før legging. Forventer profesjonell utførelse.",
          location: "Kristiansand",
          postalCode: "4633",
          budgetMin: 35000,
          budgetMax: 50000,
          startDate: "2026-04-20",
          asap: false,
          verifiedOnly: false,
          status: "open",
          createdAt: "2026-03-09T12:00:00Z",
          imageCount: 1,
        },
        {
          id: "req-demo-008",
          customerId: "customer-demo-008",
          category: "tak",
          title: "Reparasjon av takrenner og nedløp",
          description: "Takrenner og nedløp må repareres/skiftes. Noen seksjoner er rust og lekker. Ca 25 meter takrenne og 4 nedløp må skiftes til nye i aluminium. Ønsker også å få montert løvhinder.",
          location: "Tromsø",
          postalCode: "9019",
          budgetMin: 15000,
          budgetMax: 25000,
          startDate: null,
          asap: true,
          verifiedOnly: false,
          status: "open",
          createdAt: "2026-03-10T09:30:00Z",
          imageCount: 3,
        },
      ];
      
      // Add demo requests to the list (combine with real requests if any)
      requests = [...requests, ...mockRequests];
      console.log(`[GET /requests] Added ${mockRequests.length} demo requests. Total: ${requests.length}`);
    }
    
    // Sort by createdAt descending
    requests.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return c.json({ requests });
  } catch (error) {
    console.log("Error fetching requests:", error);
    return c.json({ error: "Failed to fetch requests", details: String(error) }, 500);
  }
});

// Get a single request by ID
app.get("/make-server-8d200dba/requests/:id", async (c) => {
  try {
    const id = c.req.param("id");
    console.log(`[GET /requests/:id] Fetching request with ID: ${id}`);
    let request = await kv.get(`request:${id}`);
    console.log(`[GET /requests/:id] Database lookup: ${request ? 'Found' : 'Not found'}`);
    
    // Check if it's a demo request
    if (!request && id.startsWith("req-demo-")) {
      const mockRequests: any = {
        "req-demo-001": {
          id: "req-demo-001",
          customerId: "customer-demo-001",
          category: "tak",
          title: "Nytt tak på enebolig - 150 kvm",
          description: "Trenger komplett nytt tak på enebolig. Eksisterende tak er 20 år gammelt og begynner å lekke. Ønsker tilbud på nye takstein, undertak, takrenner og stormklips. Huset er på 150 kvm takflate.",
          location: "Oslo",
          postalCode: "0566",
          budgetMin: 120000,
          budgetMax: 180000,
          startDate: "2026-04-15",
          asap: false,
          verifiedOnly: true,
          status: "open",
          createdAt: "2026-03-08T10:30:00Z",
          imageCount: 3,
        },
        "req-demo-002": {
          id: "req-demo-002",
          customerId: "customer-demo-002",
          category: "maling",
          title: "Male stue og gang - 80 kvm veggflate",
          description: "Ønsker å male stue, gang og trapp. Totalt ca 80 kvm veggflate. Vegger skal spakles og males hvit. Kan gjerne få tilbud på både grunning og toppstrøk. Forventer god håndverksmessig utførelse.",
          location: "Bergen",
          postalCode: "5067",
          budgetMin: 25000,
          budgetMax: 40000,
          startDate: null,
          asap: true,
          verifiedOnly: false,
          status: "open",
          createdAt: "2026-03-09T14:20:00Z",
          imageCount: 2,
        },
        "req-demo-003": {
          id: "req-demo-003",
          customerId: "customer-demo-003",
          category: "trevare",
          title: "Bygge terrasse 30 kvm",
          description: "Skal bygge ny terrasse på 30 kvm. Ønsker impregnert trelast, rekkverk og trapp ned til hagen. Grunn må planeres og det må legges fundamenter. Søker erfaren tømrer som kan ta hele jobben.",
          location: "Stavanger",
          postalCode: "4014",
          budgetMin: 80000,
          budgetMax: 120000,
          startDate: "2026-05-01",
          asap: false,
          verifiedOnly: true,
          status: "open",
          createdAt: "2026-03-07T09:15:00Z",
          imageCount: 1,
        },
        "req-demo-004": {
          id: "req-demo-004",
          customerId: "customer-demo-004",
          category: "elektrisk",
          title: "Oppgradering elektrisk anlegg - nytt sikringsskap",
          description: "Trenger oppgradering av elektrisk anlegg i eldre bolig. Må skifte sikringsskap og legge nye kurs til kjøkken og bad. Ønsker også 5 nye stikkontakter på kjøkken og 3 på bad. Må godkjennes av fagansvarlig elektriker.",
          location: "Trondheim",
          postalCode: "7044",
          budgetMin: 35000,
          budgetMax: 55000,
          startDate: "2026-04-01",
          asap: false,
          verifiedOnly: true,
          status: "open",
          createdAt: "2026-03-06T11:45:00Z",
          imageCount: 4,
        },
        "req-demo-005": {
          id: "req-demo-005",
          customerId: "customer-demo-005",
          category: "ror",
          title: "Nytt bad - rørleggerarbeid",
          description: "Pusser opp bad og trenger rørlegger. Skal ha ny dusjplate, nytt toalett, servant og blandebatteri. Må også legge gulvvarme under flisene. Totalt badareal er ca 8 kvm.",
          location: "Drammen",
          postalCode: "3019",
          budgetMin: 60000,
          budgetMax: 90000,
          startDate: null,
          asap: true,
          verifiedOnly: false,
          status: "open",
          createdAt: "2026-03-10T08:00:00Z",
          imageCount: 2,
        },
        "req-demo-006": {
          id: "req-demo-006",
          customerId: "customer-demo-006",
          category: "maling",
          title: "Utvendig maling av hus - 180 kvm",
          description: "Trenger utvendig maling av trehus. Huset er ca 180 kvm fasadeflate. Må høytrykkspyles, grunnes og males med 2 strøk. Ønsker hvit farge. Arbeidet må gjøres i tørt vær og forventer ferdig innen 2 uker.",
          location: "Fredrikstad",
          postalCode: "1606",
          budgetMin: 45000,
          budgetMax: 70000,
          startDate: "2026-06-01",
          asap: false,
          verifiedOnly: true,
          status: "open",
          createdAt: "2026-03-05T15:30:00Z",
          imageCount: 5,
        },
        "req-demo-007": {
          id: "req-demo-007",
          customerId: "customer-demo-007",
          category: "trevare",
          title: "Legging av parkett i stue - 45 kvm",
          description: "Skal legge eikeparkett i stue og kjøkken. Totalt 45 kvm. Har kjøpt parketten allerede (3-stav eik). Gulvet må planeres og det må legges dampsperre før legging. Forventer profesjonell utførelse.",
          location: "Kristiansand",
          postalCode: "4633",
          budgetMin: 35000,
          budgetMax: 50000,
          startDate: "2026-04-20",
          asap: false,
          verifiedOnly: false,
          status: "open",
          createdAt: "2026-03-09T12:00:00Z",
          imageCount: 1,
        },
        "req-demo-008": {
          id: "req-demo-008",
          customerId: "customer-demo-008",
          category: "tak",
          title: "Reparasjon av takrenner og nedløp",
          description: "Takrenner og nedløp må repareres/skiftes. Noen seksjoner er rust og lekker. Ca 25 meter takrenne og 4 nedløp må skiftes til nye i aluminium. Ønsker også å få montert løvhinder.",
          location: "Tromsø",
          postalCode: "9019",
          budgetMin: 15000,
          budgetMax: 25000,
          startDate: null,
          asap: true,
          verifiedOnly: false,
          status: "open",
          createdAt: "2026-03-10T09:30:00Z",
          imageCount: 3,
        },
      };
      
      request = mockRequests[id];
      console.log(`[GET /requests/:id] Demo lookup result: ${request ? 'Found' : 'Not found'}`);
    }
    
    if (!request) {
      console.log(`[GET /requests/:id] Request not found for ID: ${id}`);
      return c.json({ error: "Request not found" }, 404);
    }
    
    return c.json({ request });
  } catch (error) {
    console.log("Error fetching request:", error);
    return c.json({ error: "Failed to fetch request", details: String(error) }, 500);
  }
});

// ==========================================
// OFFER ENDPOINTS
// ==========================================

// Create an offer for a request
app.post("/make-server-8d200dba/offers", async (c) => {
  try {
    const body = await c.req.json();
    const offerId = `offer-${Date.now()}`;
    
    const offer = {
      id: offerId,
      ...body,
      status: "pending", // pending, accepted, rejected
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`offer:${offerId}`, offer);
    
    // Update request to include this offer
    const request = await kv.get(`request:${body.requestId}`);
    if (request) {
      request.offers = [...(request.offers || []), offerId];
      request.updatedAt = new Date().toISOString();
      if (request.status === "waiting") {
        request.status = "active";
      }
      await kv.set(`request:${body.requestId}`, request);
    }
    
    return c.json({ offer }, 201);
  } catch (error) {
    console.log("Error creating offer:", error);
    return c.json({ error: "Failed to create offer", details: String(error) }, 500);
  }
});

// Get all offers for a request
app.get("/make-server-8d200dba/offers", async (c) => {
  try {
    const requestId = c.req.query("requestId");
    const supplierId = c.req.query("supplierId");
    
    const allOffers = await kv.getByPrefix("offer:");
    
    let offers = allOffers;
    
    if (requestId) {
      offers = offers.filter((o: any) => o.requestId === requestId);
    }
    
    if (supplierId) {
      offers = offers.filter((o: any) => o.supplierId === supplierId);
    }
    
    // Sort by createdAt descending
    offers.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return c.json({ offers });
  } catch (error) {
    console.log("Error fetching offers:", error);
    return c.json({ error: "Failed to fetch offers", details: String(error) }, 500);
  }
});

// Accept an offer
app.post("/make-server-8d200dba/offers/:id/accept", async (c) => {
  try {
    const id = c.req.param("id");
    const offer = await kv.get(`offer:${id}`);
    
    if (!offer) {
      return c.json({ error: "Offer not found" }, 404);
    }
    
    offer.status = "accepted";
    await kv.set(`offer:${id}`, offer);
    
    // Update request status
    const request = await kv.get(`request:${offer.requestId}`);
    if (request) {
      request.status = "quote_accepted";
      request.acceptedOfferId = id;
      request.updatedAt = new Date().toISOString();
      await kv.set(`request:${offer.requestId}`, request);
    }
    
    return c.json({ offer });
  } catch (error) {
    console.log("Error accepting offer:", error);
    return c.json({ error: "Failed to accept offer", details: String(error) }, 500);
  }
});

// ==========================================
// MESSAGE ENDPOINTS
// ==========================================

// Send a message
app.post("/make-server-8d200dba/messages", async (c) => {
  try {
    const body = await c.req.json();
    const messageId = `msg-${Date.now()}`;
    
    const message = {
      id: messageId,
      ...body,
      createdAt: new Date().toISOString(),
      read: false,
    };
    
    await kv.set(`message:${messageId}`, message);
    
    return c.json({ message }, 201);
  } catch (error) {
    console.log("Error sending message:", error);
    return c.json({ error: "Failed to send message", details: String(error) }, 500);
  }
});

// Get messages for a conversation
app.get("/make-server-8d200dba/messages", async (c) => {
  try {
    const requestId = c.req.query("requestId");
    const userId = c.req.query("userId");
    
    const allMessages = await kv.getByPrefix("message:");
    
    let messages = allMessages;
    
    // Filter by requestId and userId
    if (requestId && userId) {
      messages = messages.filter((m: any) => 
        m.requestId === requestId && 
        (m.senderId === userId || m.receiverId === userId)
      );
    }
    
    // Sort by createdAt ascending
    messages.sort((a: any, b: any) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    return c.json({ messages });
  } catch (error) {
    console.log("Error fetching messages:", error);
    return c.json({ error: "Failed to fetch messages", details: String(error) }, 500);
  }
});

// Mark message as read
app.put("/make-server-8d200dba/messages/:id/read", async (c) => {
  try {
    const id = c.req.param("id");
    const message = await kv.get(`message:${id}`);
    
    if (!message) {
      return c.json({ error: "Message not found" }, 404);
    }
    
    message.read = true;
    await kv.set(`message:${id}`, message);
    
    return c.json({ message });
  } catch (error) {
    console.log("Error marking message as read:", error);
    return c.json({ error: "Failed to mark message as read", details: String(error) }, 500);
  }
});

// ==========================================
// NOTIFICATION ENDPOINTS
// ==========================================

// Create a notification
app.post("/make-server-8d200dba/notifications", async (c) => {
  try {
    const body = await c.req.json();
    const notificationId = `notif-${Date.now()}`;
    
    const notification = {
      id: notificationId,
      ...body,
      createdAt: new Date().toISOString(),
      read: false,
    };
    
    await kv.set(`notification:${notificationId}`, notification);
    
    // TODO: Send email notification if user has email notifications enabled
    // For now, we'll just log it
    console.log(`Notification created for user ${body.userId}: ${body.title}`);
    
    return c.json({ notification }, 201);
  } catch (error) {
    console.log("Error creating notification:", error);
    return c.json({ error: "Failed to create notification", details: String(error) }, 500);
  }
});

// Get notifications for a user
app.get("/make-server-8d200dba/notifications", async (c) => {
  try {
    const userId = c.req.query("userId");
    const unreadOnly = c.req.query("unreadOnly") === "true";
    
    if (!userId) {
      return c.json({ error: "userId is required" }, 400);
    }
    
    const allNotifications = await kv.getByPrefix("notification:");
    
    let notifications = allNotifications.filter((n: any) => n.userId === userId);
    
    if (unreadOnly) {
      notifications = notifications.filter((n: any) => !n.read);
    }
    
    // Sort by createdAt descending
    notifications.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return c.json({ notifications });
  } catch (error) {
    console.log("Error fetching notifications:", error);
    return c.json({ error: "Failed to fetch notifications", details: String(error) }, 500);
  }
});

// Mark notification as read
app.put("/make-server-8d200dba/notifications/:id/read", async (c) => {
  try {
    const id = c.req.param("id");
    const notification = await kv.get(`notification:${id}`);
    
    if (!notification) {
      return c.json({ error: "Notification not found" }, 404);
    }
    
    notification.read = true;
    await kv.set(`notification:${id}`, notification);
    
    return c.json({ notification });
  } catch (error) {
    console.log("Error marking notification as read:", error);
    return c.json({ error: "Failed to mark notification as read", details: String(error) }, 500);
  }
});

// Mark all notifications as read for a user
app.put("/make-server-8d200dba/notifications/read-all", async (c) => {
  try {
    const { userId } = await c.req.json();
    
    if (!userId) {
      return c.json({ error: "userId is required" }, 400);
    }
    
    const allNotifications = await kv.getByPrefix("notification:");
    const userNotifications = allNotifications.filter((n: any) => n.userId === userId && !n.read);
    
    for (const notification of userNotifications) {
      notification.read = true;
      await kv.set(`notification:${notification.id}`, notification);
    }
    
    return c.json({ count: userNotifications.length });
  } catch (error) {
    console.log("Error marking all notifications as read:", error);
    return c.json({ error: "Failed to mark all notifications as read", details: String(error) }, 500);
  }
});

// Delete a notification
app.delete("/make-server-8d200dba/notifications/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const notification = await kv.get(`notification:${id}`);
    
    if (!notification) {
      return c.json({ error: "Notification not found" }, 404);
    }
    
    await kv.del(`notification:${id}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting notification:", error);
    return c.json({ error: "Failed to delete notification", details: String(error) }, 500);
  }
});

// Get notification preferences for a user
app.get("/make-server-8d200dba/notification-preferences/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const preferences = await kv.get(`notification-prefs:${userId}`);
    
    // Default preferences if not found
    if (!preferences) {
      return c.json({
        preferences: {
          emailNotifications: true,
          pushNotifications: true,
          newOfferEmail: true,
          offerAcceptedEmail: true,
          newMessageEmail: true,
          jobCompletedEmail: true,
          reminderEmail: true,
          marketingEmail: false,
        }
      });
    }
    
    return c.json({ preferences });
  } catch (error) {
    console.log("Error fetching notification preferences:", error);
    return c.json({ error: "Failed to fetch notification preferences", details: String(error) }, 500);
  }
});

// Update notification preferences
app.put("/make-server-8d200dba/notification-preferences/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const body = await c.req.json();
    
    await kv.set(`notification-prefs:${userId}`, body);
    
    return c.json({ preferences: body });
  } catch (error) {
    console.log("Error updating notification preferences:", error);
    return c.json({ error: "Failed to update notification preferences", details: String(error) }, 500);
  }
});

// Helper function to create notification (can be called from other endpoints)
async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  icon?: string;
}) {
  const notificationId = `notif-${Date.now()}`;
  
  const notification = {
    id: notificationId,
    ...data,
    createdAt: new Date().toISOString(),
    read: false,
  };
  
  await kv.set(`notification:${notificationId}`, notification);
  
  return notification;
}

// Helper function to send email
async function sendEmail(data: {
  to: string;
  subject: string;
  html: string;
  type: string;
  metadata?: any;
}) {
  const emailId = `email-${Date.now()}`;
  
  const email = {
    id: emailId,
    ...data,
    sentAt: new Date().toISOString(),
    status: 'sent', // In production, this would be 'pending' until confirmed
  };
  
  // Store email log
  await kv.set(`email:${emailId}`, email);
  
  // Log to console (in production, this would call Resend API)
  console.log('\n📧 EMAIL SENT:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`To: ${data.to}`);
  console.log(`Subject: ${data.subject}`);
  console.log(`Type: ${data.type}`);
  console.log(`Email ID: ${emailId}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`\n${data.html}\n`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  return email;
}

// Email templates
function getEmailTemplate(type: string, data: any): { subject: string; html: string } {
  const baseStyles = `
    <style>
      body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
      .header { background: linear-gradient(135deg, #17384E 0%, #1a4459 100%); padding: 40px 20px; text-align: center; }
      .logo { font-size: 28px; font-weight: bold; color: #ffffff; margin: 0; }
      .content { padding: 40px 30px; }
      .title { font-size: 24px; font-weight: bold; color: #111827; margin: 0 0 16px 0; }
      .text { font-size: 16px; line-height: 1.6; color: #6B7280; margin: 0 0 16px 0; }
      .button { display: inline-block; background: #E07B3E; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
      .button:hover { background: #d16f35; }
      .info-box { background: #F8FAFC; border-left: 4px solid #17384E; padding: 16px; margin: 20px 0; }
      .footer { background: #F8FAFC; padding: 30px; text-align: center; color: #6B7280; font-size: 14px; }
      .divider { height: 1px; background: #E5E7EB; margin: 24px 0; }
      .highlight { color: #E07B3E; font-weight: 600; }
      .badge { display: inline-block; background: #17384E; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    </style>
  `;

  const templates: Record<string, { subject: string; html: string }> = {
    welcome_customer: {
      subject: '🎉 Velkommen til Håndtverkeren!',
      html: `
        ${baseStyles}
        <div class="container">
          <div class="header">
            <h1 class="logo">🔨 Håndtverkeren</h1>
          </div>
          <div class="content">
            <h2 class="title">Velkommen, ${data.name}! 🎉</h2>
            <p class="text">
              Vi er glade for å ha deg med! Håndterkeren gjør det enkelt å finne verifiserte
              fagfolk og få hjelp til dine prosjekter.
            </p>
            <div class="info-box">
              <strong>Kom i gang på 3 steg:</strong>
              <ol style="margin: 12px 0 0 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Opprett din første forespørsel</li>
                <li style="margin-bottom: 8px;">Motta tilbud fra verifiserte fagfolk</li>
                <li>Velg best tilbud og få jobben gjort!</li>
              </ol>
            </div>
            <a href="${data.dashboardUrl}" class="button">Gå til mitt dashboard</a>
            <p class="text">
              Har du spørsmål? Vi er her for å hjelpe! Send oss en e-post til
              <span class="highlight">hei@håndtverkeren.no</span>
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Håndtverkeren. Alle rettigheter forbeholdt.</p>
            <p style="margin-top: 8px;">
              <a href="#" style="color: #6B7280; margin: 0 8px;">Personvern</a> |
              <a href="#" style="color: #6B7280; margin: 0 8px;">Vilkår</a> |
              <a href="#" style="color: #6B7280; margin: 0 8px;">Kontakt oss</a>
            </p>
          </div>
        </div>
      `,
    },
    
    welcome_supplier: {
      subject: '🔨 Velkommen til Håndtverkeren - Start å motta jobber!',
      html: `
        ${baseStyles}
        <div class="container">
          <div class="header">
            <h1 class="logo">🔨 Håndtverkeren</h1>
          </div>
          <div class="content">
            <h2 class="title">Velkommen, ${data.name}! 🔨</h2>
            <p class="text">
              Gratulerer med å ha blitt en del av Håndtverkeren! Du kan nå begynne å motta
              forespørsler fra kunder i ditt område.
            </p>
            <div class="info-box">
              <strong>Neste steg:</strong>
              <ol style="margin: 12px 0 0 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Fullfør din profil med portefølje</li>
                <li style="margin-bottom: 8px;">Se tilgjengelige jobber i ditt område</li>
                <li>Send tilbud og vinn jobber!</li>
              </ol>
            </div>
            <a href="${data.dashboardUrl}" class="button">Gå til leverandør-dashboard</a>
            <div class="divider"></div>
            <p class="text">
              <strong>Tips for å lykkes:</strong><br>
              • Svar raskt på forespørsler (innen 1 time)<br>
              • Hold en profesjonell profil med bilder<br>
              • Lever kvalitetsarbeid og få gode anmeldelser
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Håndterkeren. Alle rettigheter forbeholdt.</p>
          </div>
        </div>
      `,
    },

    new_request: {
      subject: `📝 Ny forespørsel: ${data.title}`,
      html: `
        ${baseStyles}
        <div class="container">
          <div class="header">
            <h1 class="logo">🔨 Håndtverkeren</h1>
          </div>
          <div class="content">
            <h2 class="title">Ny jobbforespørsel i ditt område! 📝</h2>
            <p class="text">En kunde i ${data.location} trenger hjelp med:</p>
            
            <div class="info-box">
              <h3 style="margin: 0 0 12px 0; color: #111827;">${data.title}</h3>
              <p style="margin: 0 0 8px 0;"><span class="badge">${data.category}</span></p>
              <p style="margin: 0; color: #6B7280;">${data.description}</p>
              <div class="divider"></div>
              <p style="margin: 0;">
                <strong>Budsjett:</strong> <span class="highlight">${data.budget} kr</span><br>
                <strong>Lokasjon:</strong> ${data.location}<br>
                <strong>Ønsket oppstart:</strong> ${data.startDate}
              </p>
            </div>

            <a href="${data.requestUrl}" class="button">Se forespørsel og send tilbud</a>

            <p class="text">
              <strong>⚡ Svar raskt!</strong> Studier viser at leverandører som svarer innen 1 time
              har 4x større sjanse for å vinne jobben.
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Håndterkeren. Alle rettigheter forbeholdt.</p>
            <p style="margin-top: 8px; font-size: 12px;">
              Vil du endre hvor ofte du mottar e-poster? 
              <a href="#" style="color: #6B7280;">Gå til innstillinger</a>
            </p>
          </div>
        </div>
      `,
    },

    new_offer: {
      subject: `🎉 Nytt tilbud mottatt fra ${data.supplierName}!`,
      html: `
        ${baseStyles}
        <div class="container">
          <div class="header">
            <h1 class="logo">🔨 Håndtverkeren</h1>
          </div>
          <div class="content">
            <h2 class="title">Du har mottatt et nytt tilbud! 🎉</h2>
            <p class="text">
              <strong>${data.supplierName}</strong> har sendt deg et tilbud på din forespørsel
              "<strong>${data.requestTitle}</strong>".
            </p>

            <div class="info-box">
              <h3 style="margin: 0 0 12px 0; color: #111827;">Tilbudsdetaljer</h3>
              <p style="margin: 0 0 16px 0; font-size: 32px; font-weight: bold; color: #E07B3E;">
                ${data.price} kr
              </p>
              <p style="margin: 0; color: #6B7280;">${data.description}</p>
              <div class="divider"></div>
              <p style="margin: 0;">
                <strong>Leverandør:</strong> ${data.supplierName}<br>
                <strong>Rating:</strong> ⭐ ${data.rating}/5 (${data.reviewCount} anmeldelser)<br>
                <strong>Estimert varighet:</strong> ${data.duration}
              </p>
            </div>

            <a href="${data.offerUrl}" class="button">Se tilbud og godkjenn</a>

            <p class="text">
              Du har nå mottatt <strong class="highlight">${data.totalOffers} tilbud</strong> 
              på denne forespørselen. Sammenlign tilbud og velg den beste leverandøren for jobben.
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Håndterkeren. Alle rettigheter forbeholdt.</p>
          </div>
        </div>
      `,
    },

    offer_accepted: {
      subject: '✅ Ditt tilbud ble godkjent!',
      html: `
        ${baseStyles}
        <div class="container">
          <div class="header">
            <h1 class="logo">🔨 Håndtverkeren</h1>
          </div>
          <div class="content">
            <h2 class="title">Gratulerer! Ditt tilbud ble godkjent! ✅</h2>
            <p class="text">
              <strong>${data.customerName}</strong> har godkjent ditt tilbud på
              <strong>${data.price} kr</strong> for "<strong>${data.requestTitle}</strong>".
            </p>

            <div class="info-box" style="background: #ECFDF5; border-color: #10B981;">
              <p style="margin: 0; color: #065F46;">
                <strong>💰 Betalingen er sikret!</strong><br>
                Kunden har betalt inn ${data.price} kr til vår escrow-konto.
                Pengene frigis til deg når kunden godkjenner det fullførte arbeidet.
              </p>
            </div>

            <h3 style="color: #111827; margin: 24px 0 12px 0;">Neste steg:</h3>
            <ol style="margin: 0; padding-left: 20px; color: #6B7280;">
              <li style="margin-bottom: 8px;">Ta kontakt med kunden for å avtale oppstart</li>
              <li style="margin-bottom: 8px;">Utfør jobben profesjonelt og i henhold til avtale</li>
              <li>Varsle kunden når arbeidet er fullført</li>
            </ol>

            <a href="${data.jobUrl}" class="button">Se jobbdetaljer</a>

            <div class="divider"></div>

            <p class="text">
              <strong>Kundeinformasjon:</strong><br>
              Navn: ${data.customerName}<br>
              Telefon: ${data.customerPhone}<br>
              E-post: ${data.customerEmail}
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Håndterkeren. Alle rettigheter forbeholdt.</p>
          </div>
        </div>
      `,
    },

    job_completed: {
      subject: '🎉 Jobben er fullført - Vurder leverandøren',
      html: `
        ${baseStyles}
        <div class="container">
          <div class="header">
            <h1 class="logo">🔨 Håndtverkeren</h1>
          </div>
          <div class="content">
            <h2 class="title">Jobben er markert som fullført! 🎉</h2>
            <p class="text">
              <strong>${data.supplierName}</strong> har markert jobben
              "<strong>${data.requestTitle}</strong>" som fullført.
            </p>

            <div class="info-box">
              <p style="margin: 0; color: #111827;">
                <strong>Vennligst bekreft at arbeidet er utført tilfredsstillende.</strong><br><br>
                Når du godkjenner, vil <span class="highlight">${data.price} kr</span> 
                bli frigjort fra escrow-kontoen til leverandøren.
              </p>
            </div>

            <a href="${data.approvalUrl}" class="button">Godkjenn og frigj betaling</a>

            <div class="divider"></div>

            <h3 style="color: #111827; margin: 24px 0 12px 0;">Er du fornøyd?</h3>
            <p class="text">
              Hjelp andre kunder ved å legge igjen en anmeldelse av ${data.supplierName}.
              Din tilbakemelding betyr mye for fagfolk på plattformen!
            </p>

            <a href="${data.reviewUrl}" style="display: inline-block; color: #E07B3E; text-decoration: none; font-weight: 600;">
              Skriv anmeldelse →
            </a>
          </div>
          <div class="footer">
            <p>© 2024 Håndtverkeren. Alle rettigheter forbeholdt.</p>
          </div>
        </div>
      `,
    },

    payment_released: {
      subject: '💰 Betaling frigjort - kr ' + data.amount,
      html: `
        ${baseStyles}
        <div class="container">
          <div class="header">
            <h1 class="logo">🔨 Håndtverkeren</h1>
          </div>
          <div class="content">
            <h2 class="title">Betaling frigjort! 💰</h2>
            <p class="text">
              Gratulerer! Kunden har godkjent arbeidet og betalingen er nå frigjort.
            </p>

            <div class="info-box" style="background: #ECFDF5; border-color: #10B981;">
              <p style="margin: 0 0 12px 0; font-size: 36px; font-weight: bold; color: #10B981;">
                ${data.amount} kr
              </p>
              <p style="margin: 0; color: #065F46;">
                <strong>Jobb:</strong> ${data.requestTitle}<br>
                <strong>Kunde:</strong> ${data.customerName}<br>
                <strong>Dato:</strong> ${new Date().toLocaleDateString('nb-NO')}
              </p>
            </div>

            <p class="text">
              Pengene vil bli overført til din bankkonto innen 3-5 virkedager.
            </p>

            <a href="${data.dashboardUrl}" class="button">Se mine inntekter</a>

            <div class="divider"></div>

            <p class="text">
              <strong>Takk for godt arbeid!</strong> Fortsett å levere kvalitet
              og bygge din reputasjon på Håndtverkeren.
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Håndterkeren. Alle rettigheter forbeholdt.</p>
          </div>
        </div>
      `,
    },

    new_message: {
      subject: `💬 Ny melding fra ${data.senderName}`,
      html: `
        ${baseStyles}
        <div class="container">
          <div class="header">
            <h1 class="logo">🔨 Håndtverkeren</h1>
          </div>
          <div class="content">
            <h2 class="title">Ny melding mottatt 💬</h2>
            <p class="text">
              <strong>${data.senderName}</strong> har sendt deg en melding angående
              "<strong>${data.requestTitle}</strong>".
            </p>

            <div class="info-box">
              <p style="margin: 0; color: #6B7280; font-style: italic;">
                "${data.messagePreview}"
              </p>
            </div>

            <a href="${data.messageUrl}" class="button">Les og svar på melding</a>

            <p class="text" style="font-size: 14px; color: #9CA3AF;">
              Rask kommunikasjon gir bedre resultater! Svar så snart som mulig.
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Håndterkeren. Alle rettigheter forbeholdt.</p>
          </div>
        </div>
      `,
    },

    new_review: {
      subject: `⭐ Ny anmeldelse fra ${data.customerName}`,
      html: `
        ${baseStyles}
        <div class="container">
          <div class="header">
            <h1 class="logo">🔨 Håndtverkeren</h1>
          </div>
          <div class="content">
            <h2 class="title">Du har fått en ny anmeldelse! ⭐</h2>
            <p class="text">
              <strong>${data.customerName}</strong> har vurdert arbeidet ditt på
              "<strong>${data.requestTitle}</strong>".
            </p>

            <div class="info-box">
              <p style="margin: 0 0 12px 0; font-size: 28px; color: #F59E0B;">
                ${'⭐'.repeat(data.rating)} ${data.rating}/5
              </p>
              <p style="margin: 0; color: #6B7280; font-style: italic;">
                "${data.comment}"
              </p>
            </div>

            <a href="${data.profileUrl}" class="button">Se din profil</a>

            <p class="text">
              Din gjennomsnittlige vurdering er nå <strong class="highlight">${data.averageRating}/5</strong>
              basert på <strong>${data.totalReviews}</strong> anmeldelser.
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Håndterkeren. Alle rettigheter forbeholdt.</p>
          </div>
        </div>
      `,
    },
  };

  return templates[type] || { subject: 'Melding fra Håndtverkeren', html: '<p>Ingen template funnet</p>' };
}

// ==========================================
// EMAIL ENDPOINTS
// ==========================================

// Send email
app.post("/make-server-8d200dba/emails/send", async (c) => {
  try {
    const body = await c.req.json();
    const { type, to, data } = body;

    if (!type || !to) {
      return c.json({ error: "type and to are required" }, 400);
    }

    const template = getEmailTemplate(type, data);
    const email = await sendEmail({
      to,
      subject: template.subject,
      html: template.html,
      type,
      metadata: data,
    });

    return c.json({ email }, 201);
  } catch (error) {
    console.log("Error sending email:", error);
    return c.json({ error: "Failed to send email", details: String(error) }, 500);
  }
});

// Get email logs
app.get("/make-server-8d200dba/emails", async (c) => {
  try {
    const emails = await kv.getByPrefix("email:");
    
    // Sort by sentAt descending
    emails.sort((a: any, b: any) => 
      new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    );

    return c.json({ emails });
  } catch (error) {
    console.log("Error fetching emails:", error);
    return c.json({ error: "Failed to fetch emails", details: String(error) }, 500);
  }
});

// Get single email
app.get("/make-server-8d200dba/emails/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const email = await kv.get(`email:${id}`);

    if (!email) {
      return c.json({ error: "Email not found" }, 404);
    }

    return c.json({ email });
  } catch (error) {
    console.log("Error fetching email:", error);
    return c.json({ error: "Failed to fetch email", details: String(error) }, 500);
  }
});

// Preview email template
app.post("/make-server-8d200dba/emails/preview", async (c) => {
  try {
    const body = await c.req.json();
    const { type, data } = body;

    if (!type) {
      return c.json({ error: "type is required" }, 400);
    }

    const template = getEmailTemplate(type, data);

    return c.json({ 
      subject: template.subject,
      html: template.html,
    });
  } catch (error) {
    console.log("Error previewing email:", error);
    return c.json({ error: "Failed to preview email", details: String(error) }, 500);
  }
});

// ==========================================
// PROFILE ENDPOINTS
// ==========================================

// Get supplier profile
app.get("/make-server-8d200dba/profiles/supplier/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const profile = await kv.get(`supplier-profile:${id}`);
    
    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }
    
    return c.json({ profile });
  } catch (error) {
    console.log("Error fetching supplier profile:", error);
    return c.json({ error: "Failed to fetch profile", details: String(error) }, 500);
  }
});

// Update supplier profile
app.put("/make-server-8d200dba/profiles/supplier/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const profile = {
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`supplier-profile:${id}`, profile);
    
    return c.json({ profile });
  } catch (error) {
    console.log("Error updating supplier profile:", error);
    return c.json({ error: "Failed to update profile", details: String(error) }, 500);
  }
});

// Get customer profile
app.get("/make-server-8d200dba/profiles/customer/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const profile = await kv.get(`customer-profile:${id}`);
    
    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }
    
    return c.json({ profile });
  } catch (error) {
    console.log("Error fetching customer profile:", error);
    return c.json({ error: "Failed to fetch profile", details: String(error) }, 500);
  }
});

// Update customer profile
app.put("/make-server-8d200dba/profiles/customer/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const profile = {
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`customer-profile:${id}`, profile);
    
    return c.json({ profile });
  } catch (error) {
    console.log("Error updating customer profile:", error);
    return c.json({ error: "Failed to update profile", details: String(error) }, 500);
  }
});

// Add portfolio item
app.post("/make-server-8d200dba/portfolio", async (c) => {
  try {
    const body = await c.req.json();
    const portfolioId = `portfolio-${Date.now()}`;
    
    const portfolioItem = {
      id: portfolioId,
      ...body,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`portfolio:${portfolioId}`, portfolioItem);
    
    return c.json({ portfolio: portfolioItem }, 201);
  } catch (error) {
    console.log("Error adding portfolio item:", error);
    return c.json({ error: "Failed to add portfolio item", details: String(error) }, 500);
  }
});

// Get portfolio items for supplier
app.get("/make-server-8d200dba/portfolio", async (c) => {
  try {
    const supplierId = c.req.query("supplierId");
    
    if (!supplierId) {
      return c.json({ error: "supplierId is required" }, 400);
    }
    
    const allPortfolio = await kv.getByPrefix("portfolio:");
    const supplierPortfolio = allPortfolio.filter((p: any) => p.supplierId === supplierId);
    
    // Sort by createdAt descending
    supplierPortfolio.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return c.json({ portfolio: supplierPortfolio });
  } catch (error) {
    console.log("Error fetching portfolio:", error);
    return c.json({ error: "Failed to fetch portfolio", details: String(error) }, 500);
  }
});

// Delete portfolio item
app.delete("/make-server-8d200dba/portfolio/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const portfolio = await kv.get(`portfolio:${id}`);
    
    if (!portfolio) {
      return c.json({ error: "Portfolio item not found" }, 404);
    }
    
    await kv.del(`portfolio:${id}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting portfolio item:", error);
    return c.json({ error: "Failed to delete portfolio item", details: String(error) }, 500);
  }
});

// Add review
app.post("/make-server-8d200dba/reviews", async (c) => {
  try {
    const body = await c.req.json();
    const reviewId = `review-${Date.now()}`;
    
    const review = {
      id: reviewId,
      ...body,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`review:${reviewId}`, review);
    
    return c.json({ review }, 201);
  } catch (error) {
    console.log("Error adding review:", error);
    return c.json({ error: "Failed to add review", details: String(error) }, 500);
  }
});

// Get reviews for supplier
app.get("/make-server-8d200dba/reviews", async (c) => {
  try {
    const supplierId = c.req.query("supplierId");
    
    if (!supplierId) {
      return c.json({ error: "supplierId is required" }, 400);
    }
    
    const allReviews = await kv.getByPrefix("review:");
    const supplierReviews = allReviews.filter((r: any) => r.supplierId === supplierId);
    
    // Sort by createdAt descending
    supplierReviews.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return c.json({ reviews: supplierReviews });
  } catch (error) {
    console.log("Error fetching reviews:", error);
    return c.json({ error: "Failed to fetch reviews", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);