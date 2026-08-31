import Link from "next/link";
import { Button } from "@/components/ui/button";

// The tribe circle: members positioned evenly around a ring — the page's
// signature element. Initials + colors stand in for real member avatars.
const CIRCLE_MEMBERS = [
  { label: "J", tone: "ember" },
  { label: "M", tone: "sage" },
  { label: "A", tone: "cream" },
  { label: "R", tone: "sage" },
  { label: "K", tone: "ember" },
  { label: "S", tone: "cream" },
  { label: "T", tone: "sage" },
  { label: "N", tone: "ember" },
  { label: "P", tone: "cream" },
  { label: "D", tone: "sage" },
  { label: "L", tone: "ember" },
  { label: "B", tone: "cream" },
];

const TONE_CLASSES = {
  ember: "bg-primary text-primary-foreground",
  sage: "bg-accent text-accent-foreground",
  cream: "bg-secondary text-secondary-foreground border border-border",
};

function TribeRing() {
  const radius = 440;
  const count = CIRCLE_MEMBERS.length;

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[960px] w-[960px] -translate-x-1/2 -translate-y-1/2 md:block"
      aria-hidden="true"
    >
      <div className="relative h-full w-full animate-[spin_90s_linear_infinite] motion-reduce:animate-none">
        {/* faint ring guide so the orbit reads as intentional, not scattered */}
        <div className="absolute left-1/2 top-1/2 size-[880px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/60" />
        {CIRCLE_MEMBERS.map((m, i) => {
          const angle = (i / count) * 2 * Math.PI;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-sm font-semibold opacity-90 shadow-[0_2px_14px_rgba(0,0,0,0.4)]"
              style={{
                transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
              }}
            >
              <span
                className={`flex size-full items-center justify-center rounded-full [animation:spin_90s_linear_infinite_reverse] motion-reduce:animate-none ${TONE_CLASSES[m.tone]}`}
              >
                {m.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden bg-background">
      {/* ambient glow, kept quiet on purpose — the ring carries the design */}
      <div
        className="pointer-events-none absolute left-1/2 top-[38%] h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[110px]"
        style={{
          background:
            "radial-gradient(circle, var(--ember) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* header */}
      <header className="relative z-10 flex items-center px-6 py-6 sm:px-10">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary font-display text-sm font-semibold text-primary-foreground">
            ot
          </span>
          <span className="font-display text-lg tracking-tight text-foreground">
            OurTribe
          </span>
        </div>
      </header>

      {/* hero */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        <TribeRing />

        <div className="relative flex max-w-2xl flex-col items-center">
          <span className="mb-6 inline-flex items-center rounded-full border border-border bg-secondary/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground backdrop-blur">
            For communities and the people who run them
          </span>

          <h1 className="font-display text-5xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Your community,
            <br />
            <span className="italic text-green-700">gathered</span> in one
            place.
          </h1>

          <p className="mt-6 max-w-md text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            Manage your members, post announcements, and put events on the
            calendar — everything your tribe needs to see, in one home instead
            of a scattered group chat.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Button size="lg" className="w-48 bg-green-700">
              <Link href="/register">Register</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-48 border-border text-foreground hover:bg-secondary"
            >
              <Link href="/login">Log in</Link>
            </Button>
          </div>
        </div>
      </div>

      <footer className="relative z-10 px-6 pb-6 text-center text-xs text-muted-foreground sm:px-10">
        © {new Date().getFullYear()} OurTribe. Built for communities, by people
        who run them.
      </footer>
    </section>
  );
}
