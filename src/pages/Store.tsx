// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StoreThemeProvider } from "@/components/store/StoreThemeProvider";
import StoreHero from "@/components/store/StoreHero";
import ProductGrid from "@/components/store/ProductGrid";
import LayoutSwitcher from "@/components/store/LayoutSwitcher";
import FloatingChatWidget from "@/components/chat/FloatingChatWidget";

interface SiteData {
  id: string;
  name: string;
  url: string;
  slug: string;
  welcome_message: string;
  currency: string;
  industry: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  category: string | null;
  stock: number | null;
}

interface StoreConfig {
  theme: Record<string, string>;
  layout: { type: "grid" | "list" | "carousel"; columns: number };
  sections: { type: string; enabled: boolean }[];
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£", NGN: "₦", KES: "KSh", GHS: "₵",
  ZAR: "R", INR: "₹", CAD: "C$", AUD: "A$", BRL: "R$",
};

function loadStoreConfig(siteId: string): StoreConfig | null {
  try {
    const raw = localStorage.getItem(`store_config_${siteId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function isSectionEnabled(config: StoreConfig | null, type: string): boolean {
  if (!config?.sections) return true; // default: all on
  const s = config.sections.find((sec) => sec.type === type);
  return s ? s.enabled : true;
}

export default function Store() {
  const { slug } = useParams<{ slug: string }>();
  const [site, setSite] = useState<SiteData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [layout, setLayout] = useState<"grid" | "list" | "carousel">("grid");
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      setLoading(true);
      try {
        const baseUrl = "https://eqemgveuvkdyectdzpzy.supabase.co";
        const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxZW1ndmV1dmtkeWVjdGR6cHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MzI1NzEsImV4cCI6MjA5MDIwODU3MX0.QixH7bgN8PsZLSYtsjPLBti7BxUV572vRIWr2mwBHvA";

        let resolvedSlug = slug;

        if (slug.startsWith("lp_")) {
          const lpResp = await fetch(
            `${baseUrl}/rest/v1/landing_pages?select=site_id&id=eq.${encodeURIComponent(slug)}&limit=1`,
            { headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` } }
          );
          const lpData = await lpResp.json();
          if (Array.isArray(lpData) && lpData.length > 0 && lpData[0].site_id) {
            resolvedSlug = lpData[0].site_id;
          }
        }

        const resp = await fetch(
          `${baseUrl}/functions/v1/get-landing-page?slug=${encodeURIComponent(resolvedSlug)}`,
          {
            headers: {
              "Content-Type": "application/json",
              apikey: apiKey,
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );

        if (!resp.ok) throw new Error("Store not found");
        const data = await resp.json();
        if (!data.business) throw new Error("Store not found");

        const siteData: SiteData = {
          id: data.business.id,
          name: data.business.name,
          url: data.business.url,
          slug: data.business.slug,
          welcome_message: data.business.welcome_message,
          currency: data.business.currency,
          industry: data.business.industry,
        };

        setSite(siteData);
        setProducts(data.products || []);

        // Load merchant's saved config
        const savedConfig = loadStoreConfig(siteData.id);
        setConfig(savedConfig);
        if (savedConfig?.layout?.type) {
          setLayout(savedConfig.layout.type);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load store");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          <p className="text-sm text-amber-800/60">Loading store...</p>
        </div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50 p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Store not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const currSymbol = CURRENCY_SYMBOLS[site.currency || "USD"] || site.currency + " ";
  const showHero = isSectionEnabled(config, "hero");
  const showProducts = isSectionEnabled(config, "products");
  const showCta = isSectionEnabled(config, "cta");
  const showChat = isSectionEnabled(config, "chatbot");

  return (
    <StoreThemeProvider siteId={site.id}>
      <div
        className="min-h-screen w-full"
        style={{
          backgroundColor: "var(--store-bg)",
          color: "var(--store-text)",
          fontFamily: "var(--store-font)",
        }}
      >
        {showHero && (
          <StoreHero
            businessName={site.name}
            welcomeMessage={site.welcome_message || "Welcome! Browse our products and chat with our AI Sales Rep."}
            chatEnabled={showChat}
            onExploreClick={() => productsRef.current?.scrollIntoView({ behavior: "smooth" })}
            onChatClick={() => {
              const chatBtn = document.querySelector('[aria-label="Open chat"]') as HTMLButtonElement;
              chatBtn?.click();
            }}
          />
        )}

        {showProducts && (
          <section ref={productsRef} className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Our Products</h2>
                <p className="text-sm opacity-60 mt-1">{products.length} products available</p>
              </div>
              <LayoutSwitcher layout={layout} onChange={setLayout} />
            </div>

            {products.length === 0 ? (
              <div className="text-center py-16 opacity-50">
                <p className="text-lg">No products available yet</p>
                <p className="text-sm mt-1">Check back soon!</p>
              </div>
            ) : (
              <ProductGrid
                products={products}
                currency={site.currency}
                currencySymbol={currSymbol}
                layout={layout}
              />
            )}
          </section>
        )}

        {showCta && (
          <section className="max-w-4xl mx-auto px-4 sm:px-8 py-12 text-center">
            <div
              className="rounded-2xl p-8 sm:p-12"
              style={{ backgroundColor: "var(--store-primary)", color: "#fff" }}
            >
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Ready to get started?</h2>
              <p className="text-sm opacity-80 mb-4">Chat with our AI Sales Rep for personalized help</p>
              <button
                onClick={() => {
                  const chatBtn = document.querySelector('[aria-label="Open chat"]') as HTMLButtonElement;
                  chatBtn?.click();
                }}
                className="px-6 py-3 rounded-xl bg-white font-bold text-sm hover:bg-white/90 transition-colors"
                style={{ color: "var(--store-primary)" }}
              >
                💬 Start Chat
              </button>
            </div>
          </section>
        )}

        <footer className="border-t border-black/5 py-8 text-center">
          <p className="text-xs opacity-40">Powered by AI Sales Rep • {site.name}</p>
        </footer>

        {showChat && (
          <FloatingChatWidget
            siteId={site.id}
            siteName={site.name}
            welcomeMessage={site.welcome_message}
          />
        )}
      </div>
    </StoreThemeProvider>
  );
}
