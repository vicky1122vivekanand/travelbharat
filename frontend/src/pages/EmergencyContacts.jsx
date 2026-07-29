import { ShieldAlert, Phone } from "lucide-react";

const NATIONAL_CONTACTS = [
  { label: "All-in-one Emergency (Police/Fire/Medical)", number: "112" },
  { label: "Police", number: "100" },
  { label: "Fire", number: "101" },
  { label: "Ambulance", number: "102 / 108" },
  { label: "Women's Helpline", number: "1091" },
  { label: "Tourist Helpline (Ministry of Tourism)", number: "1800-11-1363" },
  { label: "Railway Enquiry", number: "139" },
  { label: "Disaster Management Helpline", number: "1078" },
];

const TRAVEL_SAFETY_TIPS = [
  "Save a copy of your ID/passport and hotel address offline, in case of no signal.",
  "Share your live location with a trusted contact when travelling solo, especially in remote areas.",
  "Keep the nearest hospital and local police station's contact handy for your specific destination.",
  "In hill or forest regions, register with local forest/tourism offices before treks where required.",
  "For medical emergencies abroad-facing travellers, also keep your embassy/consulate contact saved.",
];

export default function EmergencyContacts() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <h1 className="flex items-center gap-2 font-display text-3xl text-indigo">
        <ShieldAlert className="h-7 w-7 text-maroon" /> Emergency Contacts
      </h1>
      <p className="mt-2 text-ink/60">
        Nationwide helpline numbers for travellers across India. Save these before you set off.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {NATIONAL_CONTACTS.map((c) => (
          <div key={c.label} className="flex items-center justify-between rounded-sm border border-ink/10 bg-white/50 p-4">
            <span className="text-sm text-ink/80">{c.label}</span>
            <a
              href={`tel:${c.number.split(" / ")[0].replace(/\s/g, "")}`}
              className="flex items-center gap-1 font-display text-lg text-maroon"
            >
              <Phone className="h-4 w-4" /> {c.number}
            </a>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-sm border-l-4 border-peacock bg-peacock/10 p-5">
        <h2 className="mb-3 font-display text-lg text-indigo">Travel Safety Tips</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-ink/70">
          {TRAVEL_SAFETY_TIPS.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>

      <p className="mt-6 text-xs text-ink/40">
        Numbers are current at time of publishing. Always verify local emergency numbers for
        your specific state or region before travelling.
      </p>
    </div>
  );
}
