import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { Landing } from "./pages/Landing";
import { Registration } from "./pages/Registration";
import { CreateRequest } from "./pages/CreateRequest";
import { MyRequests } from "./pages/MyRequests";
import { PricesAndTerms } from "./pages/PricesAndTerms";
import { EscrowPayment } from "./pages/EscrowPayment";
import { JobDetails } from "./pages/JobDetails";
import { JobApproval } from "./pages/JobApproval";
import { Pricing } from "./pages/Pricing";
import { AdminPanel } from "./pages/AdminPanel";
import { Messages } from "./pages/Messages";
import { CustomerDashboard } from "./pages/CustomerDashboard";
import { SupplierDashboard } from "./pages/SupplierDashboard";
import { AvailableJobs } from "./pages/AvailableJobs";
import { SendOffer } from "./pages/SendOffer";
import { OfferBuilder } from "./pages/OfferBuilder";
import { SimplifiedOfferBuilder } from "./pages/SimplifiedOfferBuilder";
import { MediumOfferBuilder } from "./pages/MediumOfferBuilder";
import { OfferBuilderRouter } from "./pages/OfferBuilderRouter";
import { MyOffers } from "./pages/MyOffers";
import { DemoPage } from "./pages/DemoPage";
import { NotificationCenter } from "./pages/NotificationCenter";
import { NotificationPreferences } from "./pages/NotificationPreferences";
import { SupplierProfile } from "./pages/SupplierProfile";
import { EditSupplierProfile } from "./pages/EditSupplierProfile";
import { CustomerProfile } from "./pages/CustomerProfile";
import { EditCustomerProfile } from "./pages/EditCustomerProfile";
import { SubscriptionSettings } from "./pages/SubscriptionSettings";
import { EmailPreview } from "./pages/EmailPreview";
import { Login } from "./pages/Login";
import { SupplierLogin } from "./pages/SupplierLogin";
import { Signup } from "./pages/Signup";
import { DebugJobs } from "./pages/DebugJobs";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Landing },
      { path: "demo", Component: DemoPage },
      { path: "logg-inn", Component: Login },
      { path: "leverandør-logg-inn", Component: SupplierLogin },
      { path: "registrer", Component: Signup },
      { path: "registrering", Component: Registration },
      { path: "opprett-forespørsel", Component: CreateRequest },
      { path: "mine-forespørsler", Component: MyRequests },
      { path: "dashboard", Component: CustomerDashboard },
      { path: "priser-og-vilkår", Component: PricesAndTerms },
      { path: "sperret-konto", Component: EscrowPayment },
      { path: "forespørsel/:id", Component: JobDetails },
      { path: "godkjenn-arbeid", Component: JobApproval },
      { path: "pris", Component: Pricing },
      { path: "admin", Component: AdminPanel },
      { path: "debug-jobs", Component: DebugJobs },
      { path: "email-preview", Component: EmailPreview },
      { path: "meldinger", Component: Messages },
      { path: "varslinger", Component: NotificationCenter },
      { path: "varslinger/innstillinger", Component: NotificationPreferences },
      // Customer profile routes
      { path: "kunde/:id", Component: CustomerProfile },
      { path: "rediger-kundeprofil", Component: EditCustomerProfile },
      { path: "abonnement-innstillinger", Component: SubscriptionSettings },
      // Supplier routes
      { path: "leverandør-dashboard", Component: SupplierDashboard },
      { path: "tilgjengelige-jobber", Component: AvailableJobs },
      { path: "send-tilbud/:jobId", Component: SendOffer },
      { path: "bygg-tilbud/:jobId", Component: OfferBuilderRouter },
      { path: "bygg-tilbud-enkel/:jobId", Component: SimplifiedOfferBuilder },
      { path: "bygg-tilbud-medium/:jobId", Component: MediumOfferBuilder },
      { path: "bygg-tilbud-pro/:jobId", Component: OfferBuilder },
      { path: "mine-tilbud", Component: MyOffers },
      { path: "leverandør/:id", Component: SupplierProfile },
      { path: "rediger-profil", Component: EditSupplierProfile },
    ],
  },
]);