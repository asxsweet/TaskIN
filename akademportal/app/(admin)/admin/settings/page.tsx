"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { apiJsonSafe } from "@/lib/fetcher";

export default function AdminSystemSettingsPage() {
  const [siteName, setSiteName] = useState("");
  const [tagline, setTagline] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const [socialLinks, setSocialLinks] = useState("");
  const [emailFrom, setEmailFrom] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiJsonSafe<{
      siteName?: string;
      tagline?: string | null;
      emailFrom?: string | null;
      contactEmail?: string;
      contactPhone?: string;
      contactAddress?: string;
      socialLinks?: string;
    }>("/api/admin/settings", {}).then((d) => {
      if (d && typeof d === "object") {
        setSiteName(d.siteName ?? "");
        setTagline(d.tagline ?? "");
        setEmailFrom(d.emailFrom ?? "");
        setContactEmail(d.contactEmail ?? "");
        setContactPhone(d.contactPhone ?? "");
        setContactAddress(d.contactAddress ?? "");
        setSocialLinks(d.socialLinks ?? "");
      }
    });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        siteName,
        tagline,
        contactEmail,
        contactPhone,
        contactAddress,
        socialLinks,
        emailFrom: emailFrom || null,
      }),
    });
    setSaved(true);
  }

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-xl font-semibold">Жүйе баптаулары</h1>
      <form onSubmit={save} className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6">
        <div>
          <h2 className="text-sm font-semibold mb-3">Жалпы</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-neutral-500">Сайт атауы</label>
              <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-xs text-neutral-500">Слоган</label>
              <Input value={tagline} onChange={(e) => setTagline(e.target.value)} className="mt-1" />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold mb-3">Email жіберу</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-neutral-500">From (noreply)</label>
              <Input value={emailFrom} onChange={(e) => setEmailFrom(e.target.value)} className="mt-1" />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold mb-3">Байланыс</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-neutral-500">Email</label>
              <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-xs text-neutral-500">Телефон</label>
              <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-xs text-neutral-500">Мекенжай</label>
              <Input value={contactAddress} onChange={(e) => setContactAddress(e.target.value)} className="mt-1" />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold mb-3">Әлеуметтік желілер (JSON)</h2>
          <textarea
            className="w-full min-h-[100px] rounded-md border border-neutral-200 px-3 py-2 text-sm font-mono"
            value={socialLinks}
            onChange={(e) => setSocialLinks(e.target.value)}
          />
        </div>
        <Button type="submit">Сақтау</Button>
        {saved ? <p className="text-sm text-green-700">Сақталды</p> : null}
      </form>
    </div>
  );
}
