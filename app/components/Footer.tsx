import Link from "next/link";
import SignalOneLogo from "./brand/SignalOneLogo";

const groups = [
  { title: "Platforms & equipment", links: [
    ["/solutions/security","1GUARD"],["/service","1Service"],["/equipment-marketplace","Buy or rent equipment"],
    ["/guard-marketplace","Hire guards"],["/radios-equipment","Radios & tracking"],
    ["/guard-patrol-software","Patrol software"],["/guard-attendance-software","Attendance & clock-in"],
    ["/ptt-radio-rental","PTT radio rental"],["/pricing","Pricing"]
  ] },
  { title: "Start & join", links: [
    ["/get-started","Get 14 Day Free Trial"],["/contact","Talk to Signal One"],
    ["/guards","For security officers"],["/guards/join","Create a guard profile"],
    ["/join/sales","Careers"]
  ] },
  { title: "Trust & legal", links: [
    ["/security-trust","Security & trust"],["/popia","POPIA & data handling"],
    ["/privacy","Privacy"],["/terms","Terms"]
  ] },
] as const;

export default function Footer() {
  return (
    <footer className="s1-premium-footer" aria-label="Signal One footer">
      <div className="wrap s1-premium-footer-shell">
        <div className="s1-premium-footer-intro">
          <div>
            <p className="s1-footer-kicker">SIGNAL ONE · INTEGRATED SYSTEMS</p>
            <h2>Make every operation count.</h2>
            <p>Security operations. Service businesses. Mission-critical technology.</p>
          </div>
          <Link className="s1-footer-main-cta" href="/get-started">Get 14 Day Free Trial <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="s1-premium-footer-bottom">
          <div className="s1-footer-brand">
            <Link href="/" aria-label="Signal One home" className="s1-footer-logo"><SignalOneLogo size={24} tone="dark" descriptorMin={11} /></Link>
            <p>Technology built around the people and operations that keep businesses moving.</p>
            <a href="mailto:sales@signalone.co.za">sales@signalone.co.za</a>
          </div>
          <nav aria-label="Footer links" className="s1-footer-link-grid">
            {groups.map(group => (
              <details key={group.title} className="s1-footer-group" open>
                <summary>{group.title}<span aria-hidden="true">+</span></summary>
                <ul>{group.links.map(([href,label])=><li key={href}><Link href={href}>{label}</Link></li>)}</ul>
              </details>
            ))}
          </nav>
        </div>
        <div className="s1-footer-legal">
          <span>© {new Date().getFullYear()} Signal One · Integrated Systems · South Africa</span>
          <span>Prices exclude VAT unless stated.</span>
        </div>
      </div>
    </footer>
  );
}
