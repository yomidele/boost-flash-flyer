// @ts-nocheck
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase-external";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Palette, Layout, Layers, Eye, Save, ArrowLeft, Loader2,
  Grid3X3, List, GalleryHorizontalEnd, Star, MessageSquare, ShoppingBag, Megaphone, ExternalLink,
} from "lucide-react";

/* ─── types ─── */
interface StoreConfig {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    cardColor: string;
    fontFamily: string;
    borderRadius: string;
  };
  layout: {
    type: "grid" | "list" | "carousel";
    columns: number;
  };
  sections: { type: string; label: string; enabled: boolean }[];
}

const DEFAULT_CONFIG: StoreConfig = {
  theme: {
    primaryColor: "#d97706",
    secondaryColor: "#92400e",
    accentColor: "#f59e0b",
    backgroundColor: "#fefce8",
    textColor: "#1c1917",
    cardColor: "#ffffff",
    fontFamily: "'Inter', system-ui, sans-serif",
    borderRadius: "16px",
  },
  layout: { type: "grid", columns: 3 },
  sections: [
    { type: "hero", label: "Hero Banner", enabled: true },
    { type: "products", label: "Products", enabled: true },
    { type: "testimonials", label: "Testimonials", enabled: false },
    { type: "cta", label: "Call to Action", enabled: true },
    { type: "chatbot", label: "AI Chatbot", enabled: true },
  ],
};

const FONT_OPTIONS = [
  { value: "'Inter', system-ui, sans-serif", label: "Inter" },
  { value: "'Poppins', system-ui, sans-serif", label: "Poppins" },
  { value: "'Playfair Display', serif", label: "Playfair Display" },
  { value: "'Space Grotesk', system-ui, sans-serif", label: "Space Grotesk" },
  { value: "'DM Sans', system-ui, sans-serif", label: "DM Sans" },
];

const SECTION_ICONS: Record<string, typeof Star> = {
  hero: Megaphone,
  products: ShoppingBag,
  testimonials: Star,
  cta: Megaphone,
  chatbot: MessageSquare,
};

/* ─── color input ─── */
function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-10 rounded border cursor-pointer shrink-0"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 text-xs font-mono"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

/* ─── live preview ─── */
function StorePreview({ config }: { config: StoreConfig }) {
  const { theme, layout, sections } = config;
  const enabledSections = sections.filter((s) => s.enabled);
  return (
    <div
      className="rounded-xl border overflow-hidden shadow-sm text-sm"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
      }}
    >
      {enabledSections.map((s) => {
        if (s.type === "hero")
          return (
            <div
              key="hero"
              className="p-6"
              style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` }}
            >
              <div className="text-white font-bold text-lg">Your Business</div>
              <div className="text-white/70 text-xs mt-1">Welcome to our store</div>
              <div className="flex gap-2 mt-3">
                <span
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{ backgroundColor: "#fff", color: theme.primaryColor, borderRadius: theme.borderRadius }}
                >
                  Explore
                </span>
              </div>
            </div>
          );
        if (s.type === "products")
          return (
            <div key="products" className="p-4">
              <div className="font-bold text-xs mb-3">Products</div>
              <div className={`gap-2 ${layout.type === "list" ? "flex flex-col" : "grid grid-cols-3"}`}>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-lg overflow-hidden"
                    style={{ backgroundColor: theme.cardColor, borderRadius: theme.borderRadius }}
                  >
                    <div className="bg-gray-100 aspect-square" />
                    <div className="p-2">
                      <div className="text-[10px] font-medium">Product {i}</div>
                      <div className="text-[10px] font-bold" style={{ color: theme.primaryColor }}>
                        $29.99
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        if (s.type === "cta")
          return (
            <div key="cta" className="p-4 text-center" style={{ backgroundColor: theme.accentColor + "22" }}>
              <div className="text-xs font-bold">Ready to shop?</div>
              <span
                className="inline-block mt-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }}
              >
                Get Started
              </span>
            </div>
          );
        if (s.type === "chatbot")
          return (
            <div key="chatbot" className="p-4 flex justify-end">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg text-white"
                style={{ backgroundColor: theme.primaryColor }}
              >
                💬
              </div>
            </div>
          );
        return null;
      })}
    </div>
  );
}

/* ─── main page ─── */
export default function StoreCustomizer() {
  const { siteId } = useParams<{ siteId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const storageKey = `store_config_${siteId}`;

  const [config, setConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    } catch {}
    return { ...DEFAULT_CONFIG };
  });

  const { data: site, isLoading: siteLoading } = useQuery({
    queryKey: ["site", siteId],
    queryFn: async () => {
      const { data, error } = await supabase.from("sites").select("*").eq("id", siteId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!siteId,
  });

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(config));
    } catch {}
  }, [config, storageKey]);

  const updateTheme = (key: string, value: string) => {
    setConfig((c) => ({ ...c, theme: { ...c.theme, [key]: value } }));
  };

  const updateLayout = (key: string, value: any) => {
    setConfig((c) => ({ ...c, layout: { ...c.layout, [key]: value } }));
  };

  const toggleSection = (type: string) => {
    setConfig((c) => ({
      ...c,
      sections: c.sections.map((s) => (s.type === type ? { ...s, enabled: !s.enabled } : s)),
    }));
  };

  // Save to DB (chatbot_themes table for colors, localStorage for full config)
  const saveMutation = useMutation({
    mutationFn: async () => {
      // Save store theme to StoreThemeProvider's localStorage
      const storeThemeKey = `store_theme_${siteId}`;
      localStorage.setItem(
        storeThemeKey,
        JSON.stringify({
          primaryColor: config.theme.primaryColor,
          secondaryColor: config.theme.secondaryColor,
          accentColor: config.theme.accentColor,
          backgroundColor: config.theme.backgroundColor,
          textColor: config.theme.textColor,
          cardColor: config.theme.cardColor,
          fontFamily: config.theme.fontFamily,
        })
      );

      // Also try saving chatbot theme to DB
      const { data: existing } = await supabase
        .from("chatbot_themes")
        .select("id")
        .eq("site_id", siteId)
        .single();

      const themeData = {
        primary_color: config.theme.primaryColor,
        secondary_color: config.theme.secondaryColor,
        background_color: config.theme.backgroundColor,
        text_color: config.theme.textColor,
        button_color: config.theme.primaryColor,
      };

      if (existing) {
        await supabase.from("chatbot_themes").update(themeData).eq("site_id", siteId);
      } else {
        await supabase.from("chatbot_themes").insert({ site_id: siteId, ...themeData });
      }
    },
    onSuccess: () => {
      toast({ title: "Store customization saved!", description: "Changes will appear on your public storefront." });
    },
    onError: (err) => {
      toast({ title: "Saved locally", description: "Theme saved locally. DB sync may require table setup." });
    },
  });

  if (siteLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/sites"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Customize Store</h1>
            <p className="text-sm text-muted-foreground">{site?.name || "Loading..."}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {site?.slug && (
            <Button variant="outline" size="sm" asChild>
              <a href={`/store/${site.slug}`} target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4 mr-2" /> Preview Store
              </a>
            </Button>
          )}
          <Button size="sm" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="theme">
            <TabsList className="mb-4">
              <TabsTrigger value="theme" className="gap-1.5">
                <Palette className="h-3.5 w-3.5" /> Theme
              </TabsTrigger>
              <TabsTrigger value="layout" className="gap-1.5">
                <Layout className="h-3.5 w-3.5" /> Layout
              </TabsTrigger>
              <TabsTrigger value="sections" className="gap-1.5">
                <Layers className="h-3.5 w-3.5" /> Sections
              </TabsTrigger>
            </TabsList>

            {/* THEME TAB */}
            <TabsContent value="theme">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Store Theme</CardTitle>
                  <CardDescription>Customize colors and typography for your storefront</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ColorField label="Primary Color" value={config.theme.primaryColor} onChange={(v) => updateTheme("primaryColor", v)} />
                    <ColorField label="Secondary Color" value={config.theme.secondaryColor} onChange={(v) => updateTheme("secondaryColor", v)} />
                    <ColorField label="Accent Color" value={config.theme.accentColor} onChange={(v) => updateTheme("accentColor", v)} />
                    <ColorField label="Background Color" value={config.theme.backgroundColor} onChange={(v) => updateTheme("backgroundColor", v)} />
                    <ColorField label="Text Color" value={config.theme.textColor} onChange={(v) => updateTheme("textColor", v)} />
                    <ColorField label="Card Color" value={config.theme.cardColor} onChange={(v) => updateTheme("cardColor", v)} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Font Family</Label>
                      <Select value={config.theme.fontFamily} onValueChange={(v) => updateTheme("fontFamily", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {FONT_OPTIONS.map((f) => (
                            <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Border Radius</Label>
                      <Select value={config.theme.borderRadius} onValueChange={(v) => updateTheme("borderRadius", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4px">Sharp</SelectItem>
                          <SelectItem value="8px">Subtle</SelectItem>
                          <SelectItem value="12px">Rounded</SelectItem>
                          <SelectItem value="16px">Smooth</SelectItem>
                          <SelectItem value="24px">Pill</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Quick presets */}
                  <div>
                    <Label className="text-xs font-medium mb-2 block">Quick Presets</Label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: "Amber", primary: "#d97706", secondary: "#92400e", accent: "#f59e0b", bg: "#fefce8" },
                        { name: "Indigo", primary: "#4f46e5", secondary: "#312e81", accent: "#818cf8", bg: "#eef2ff" },
                        { name: "Rose", primary: "#e11d48", secondary: "#881337", accent: "#fb7185", bg: "#fff1f2" },
                        { name: "Emerald", primary: "#059669", secondary: "#064e3b", accent: "#34d399", bg: "#ecfdf5" },
                        { name: "Slate", primary: "#475569", secondary: "#1e293b", accent: "#94a3b8", bg: "#f8fafc" },
                        { name: "Purple", primary: "#7c3aed", secondary: "#4c1d95", accent: "#a78bfa", bg: "#f5f3ff" },
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => {
                            updateTheme("primaryColor", preset.primary);
                            updateTheme("secondaryColor", preset.secondary);
                            updateTheme("accentColor", preset.accent);
                            updateTheme("backgroundColor", preset.bg);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-muted/50 transition-colors"
                        >
                          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: preset.primary }} />
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* LAYOUT TAB */}
            <TabsContent value="layout">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Product Layout</CardTitle>
                  <CardDescription>Choose how products are displayed on your storefront</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-xs font-medium mb-3 block">Display Mode</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {([
                        { value: "grid", icon: Grid3X3, label: "Grid", desc: "Classic grid layout" },
                        { value: "list", icon: List, label: "List", desc: "Vertical list view" },
                        { value: "carousel", icon: GalleryHorizontalEnd, label: "Carousel", desc: "Horizontal scroll" },
                      ] as const).map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => updateLayout("type", opt.value)}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            config.layout.type === opt.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-muted-foreground/30"
                          }`}
                        >
                          <opt.icon className={`h-6 w-6 mx-auto mb-2 ${config.layout.type === opt.value ? "text-primary" : "text-muted-foreground"}`} />
                          <div className="text-sm font-medium">{opt.label}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {config.layout.type === "grid" && (
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Grid Columns (desktop)</Label>
                      <Select value={String(config.layout.columns)} onValueChange={(v) => updateLayout("columns", Number(v))}>
                        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 Columns</SelectItem>
                          <SelectItem value="3">3 Columns</SelectItem>
                          <SelectItem value="4">4 Columns</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* SECTIONS TAB */}
            <TabsContent value="sections">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Page Sections</CardTitle>
                  <CardDescription>Toggle which sections appear on your landing page</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {config.sections.map((section) => {
                      const Icon = SECTION_ICONS[section.type] || Layers;
                      return (
                        <div
                          key={section.type}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                            section.enabled ? "bg-primary/5 border-primary/20" : "border-border"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`h-4 w-4 ${section.enabled ? "text-primary" : "text-muted-foreground"}`} />
                            <div>
                              <div className="text-sm font-medium">{section.label}</div>
                              <div className="text-[10px] text-muted-foreground">
                                {section.type === "hero" && "Top banner with business name and CTA"}
                                {section.type === "products" && "Product catalog display"}
                                {section.type === "testimonials" && "Customer reviews and testimonials"}
                                {section.type === "cta" && "Call-to-action footer section"}
                                {section.type === "chatbot" && "AI sales chatbot widget"}
                              </div>
                            </div>
                          </div>
                          <Switch
                            checked={section.enabled}
                            onCheckedChange={() => toggleSection(section.type)}
                            disabled={section.type === "chatbot"} // chatbot always on
                          />
                        </div>
                      );
                    })}
                    <p className="text-[10px] text-muted-foreground mt-2">
                      💡 The AI Chatbot is always enabled for maximum sales conversion.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Eye className="h-4 w-4" />
              Live Preview
            </div>
            <StorePreview config={config} />
            <p className="text-[10px] text-muted-foreground text-center">
              This is a simplified preview. Open your store to see the full experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
