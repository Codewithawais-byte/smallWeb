"use client";

import { useEffect, useState } from "react";
import { useBrowserStack } from "@/hooks/useBrowserStack";
import {
  getPeople,
  getSite,
  getHistory,
  recordVisit,
  type Person,
  type Site,
  type Visit,
} from "@/lib/api";
import { AddressBar } from "@/components/AddressBar";
import { PersonPicker } from "@/components/PersonPicker";
import { PageViewer } from "@/components/PageViewer";
import { HistoryPanel } from "@/components/HistoryPanel";
import { SearchPanel } from "@/components/SearchPanel";
import { PublishForm } from "@/components/PublishForm";

type Tab = "history" | "search" | "publish";

export default function Home() {
  const { current, canBack, canForward, navigate, back, forward } =
    useBrowserStack();

  const [people, setPeople] = useState<Person[]>([]);
  const [personId, setPersonId] = useState<string | null>(null);
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(false);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [tab, setTab] = useState<Tab>("history");

  useEffect(() => {
    getPeople().then((p) => {
      setPeople(p);
      const saved = localStorage.getItem("personId");
      if (saved && p.some((x) => x._id === saved)) setPersonId(saved);
      else if (p[0]) setPersonId(p[0]._id);
    });
  }, []);

  useEffect(() => {
    if (personId) localStorage.setItem("personId", personId);
  }, [personId]);

  const refreshHistory = async (pid: string) =>
    setVisits(await getHistory(pid));

  useEffect(() => {
    if (personId) refreshHistory(personId);
  }, [personId]);

  async function goTo(address: string, via: string) {
    navigate(address); // update stack
    if (!personId) return;
    setLoading(true);
    const [fetched] = await Promise.all([
      getSite(address),
      recordVisit({ personId, address, via }), // write the history
    ]);
    setSite(fetched);
    setLoading(false);
    refreshHistory(personId);
  }

  useEffect(() => {
    if (!current) return;
    setLoading(true);
    getSite(current).then((s) => {
      setSite(s);
      setLoading(false);
    });
  }, [current]);

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between px-3 py-1.5 border-b border-gray-200 bg-white">
        <span className="text-sm font-semibold">the small web</span>
        <PersonPicker
          people={people}
          current={personId}
          onChange={setPersonId}
        />
      </header>

      <AddressBar
        current={current}
        canBack={canBack}
        canForward={canForward}
        onNavigate={(a) => goTo(a, "typed")}
        onBack={back}
        onForward={forward}
      />

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-white">
          {current ? (
            <PageViewer
              address={current}
              site={site}
              loading={loading}
              onNavigate={(a) => goTo(a, "link")}
            />
          ) : (
            <div className="p-6 text-sm text-gray-400">
              Type an address to start browsing.
            </div>
          )}
        </main>

        <aside className="w-72 border-l border-gray-200 bg-gray-50 flex flex-col">
          <div className="flex border-b border-gray-200 text-sm">
            {(["history", "search", "publish"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 capitalize ${
                  tab === t ? "bg-white font-medium" : "text-gray-500"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            {tab === "history" && (
              <HistoryPanel
                visits={visits}
                onJump={(a) => goTo(a, "history")}
                loading={loading}
              />
            )}
            {tab === "search" && (
              <SearchPanel onOpen={(a) => goTo(a, "search")} />
            )}
            {tab === "publish" && (
              <PublishForm
                authorId={personId}
                onPublished={(a) => goTo(a, "publish")}
              />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
