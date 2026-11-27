# Cross-page consistency matrix (measured at 1440 unless stated) from the computed-style capture.
import json, glob, os, sys, collections, re
sys.path.insert(0, '.')
from metrics import load, parse, hexs
CODES = {'home': 'HOME', 'solutions_security': 'SEC', 'pricing': 'PRI', 'radios-equipment': 'RAD', 'ptt-radio-rental': 'REN', 'equipment-marketplace': 'EQM',
         'guard-patrol-software': 'PAT', 'guard-attendance-software': 'ATT', 'guard-marketplace': 'GMK', 'service': 'SVC', 'contact': 'CON', 'get-started': 'GST',
         'guards': 'GRD', 'guards_join': 'GJN', 'security-trust': 'TRU', 'popia': 'POP', 'privacy': 'PRV', 'terms': 'TRM', 'join_sales': 'JSL', 'about': 'ABT', 'support': 'SUP',
         'this-page-does-not-exist-a2': '404'}
def px(v): return f"{float(v[:-2]):g}" if v and v.endswith('px') else v
def row(D):
    R = {}
    for s in CODES:
        d, m = D.get((s, 'd')), D.get((s, 'm'))
        if not d: continue
        r = {}
        hdr = [e for e in d['els'] if e['sec'].startswith('header') and e['cls'].startswith('wrap')]
        r['Header pill h/w/x'] = f"{hdr[0]['h']}/{hdr[0]['w']}/{hdr[0]['x']}" if hdr else '—'
        h1 = [h for h in d['heads'] if h['tag'] == 'h1']
        r['H1 px/wt @1440'] = f"{px(h1[0]['fs'])}/{h1[0]['fw']}" if h1 else '—'
        h1m = [h for h in (m or {'heads': []})['heads'] if h['tag'] == 'h1']
        r['H1 px @390'] = px(h1m[0]['fs']) if h1m else '—'
        r['H1 top y'] = h1[0]['y'] if h1 else '—'
        h2 = collections.Counter(px(h['fs']) for h in d['heads'] if h['tag'] == 'h2' and h['w'] > 0 and 'footer' not in h['sec'])
        r['Section H2 px'] = ','.join(k for k, _ in h2.most_common(3)) or '—'
        h3 = collections.Counter(f"{px(h['fs'])}/{h['fw']}" for h in d['heads'] if h['tag'] == 'h3' and 'footer' not in h['sec'])
        r['H3 px/wt'] = ','.join(k for k, _ in h3.most_common(3)) or '—'
        cont = collections.Counter((c['x'], c['w']) for c in d['containers'] if 'wrap' in c['cls'] and not c['sec'].startswith('header'))
        r['Content x/w'] = ','.join(f'{x}/{w}' for (x, w), _ in cont.most_common(2)) or '—'
        pads = collections.Counter(px(s2['pt']) for s2 in d['sections'] if s2['tag'] == 'section')
        r['Section pad-top'] = ','.join(k for k, _ in pads.most_common(3)) or '—'
        bgs = collections.Counter(hexs(parse(s2['bg'])) for s2 in d['sections'] if s2['tag'] in ('section', 'main', 'div') and parse(s2['bg']) and parse(s2['bg'])[3] > 0)
        imgs = sum(1 for s2 in d['sections'] if 'url(' in s2['bimg'])
        grads = len({s2['bimg'][:60] for s2 in d['sections'] if 'gradient' in s2['bimg'] and 'url(' not in s2['bimg']})
        r['Section fills (solid/gradient/photo)'] = f"{len(bgs)}/{grads}/{imgs}"
        rad = collections.Counter(e['rad'] for e in d['els'] if e['rad'] not in ('0px',) and e['sec'] not in ('body',) and not e['sec'].startswith('header') and not e['sec'].startswith('footer') and (float(e['bw'][:-2] or 0) > 0 or (parse(e['bg']) and parse(e['bg'])[3] > 0)) and e['w'] > 120)
        r['Panel radii'] = ','.join(px(k) for k, _ in rad.most_common(4)) or '—'
        glass = {(e['bf'], e['rad']) for e in d['els'] if e['bf'] != 'none' and not e['sec'].startswith('header')}
        r['Glass recipes in main'] = len(glass)
        prim = collections.Counter(f"{b['h']}/{px(b['fs'])}/{b['fw']}" for b in d['btns'] if parse(b['bg']) and parse(b['bg'])[:3] == (14, 165, 233) and not b['sec'].startswith('header'))
        r['Primary btn h/size/wt'] = ','.join(k for k, _ in prim.most_common(3)) or '—'
        sec = collections.Counter(f"{b['h']}/{b['bc'][:22]}" for b in d['btns'] if b['bw'] != '0px' and not (parse(b['bg']) and parse(b['bg'])[:3] == (14, 165, 233)) and not b['sec'].startswith('header') and b['h'] >= 44)
        r['Secondary btn variants'] = len(sec)
        badges = collections.Counter(f"{px(e['fs'])}/{e['fw']}/{'pill' if e['rad'] in ('9999px', '999px') and parse(e['bg']) and parse(e['bg'])[3] > 0 else 'dot'}" for e in d['els'] if ('badge' in e['cls'] or ('rounded-full' in e['cls'] and 'inline-flex' in e['cls'])) and e['txt'])
        r['Status badge recipes'] = ','.join(badges) or '—'
        lnk = collections.Counter(hexs(parse(e['color'])) for e in d['els'] if e['tag'] == 'a' and 'link-arrow' in e['cls'] or 'so-text-link' in e['cls'])
        r['Link colours'] = ','.join(lnk) or '—'
        ic = collections.Counter(f"{i['w']}" for i in d['icons'] if i['w'] <= 24 and not i['sec'].startswith('header') and not i['sec'].startswith('footer'))
        r['Icon sizes'] = ','.join(ic) or '—'
        fields = collections.Counter(f"{f['h']}/{px(f['rad'])}/{hexs(parse(f['bg'])) if parse(f['bg']) else ''}" for f in d['fields'] if f['tag'] in ('input', 'select', 'textarea') and f['type'] not in ('checkbox', 'radio', 'hidden') and f['h'] > 20)
        r['Form controls h/radius/fill'] = ','.join(k for k, _ in fields.most_common(2)) or '—'
        foot = [s2 for s2 in d['sections'] if s2['tag'] == 'footer']
        r['Footer CTA band'] = 'yes' if any('s1-premium-footer-intro' in e['cls'] for e in d['els']) else 'no'
        r['Length screens 1440/390'] = f"{d['docH']/900:.1f}/{(m['docH']/844 if m else 0):.1f}"
        R[CODES[s]] = r
    return R
def table(Rb, Ra):
    cols = [c for c in CODES.values() if c in Ra]
    keys = list(next(iter(Ra.values())).keys())
    lines = ['| Element | ' + ' | '.join(cols) + ' |', '|---|' + '---|' * len(cols)]
    for k in keys:
        cells = []
        for c in cols:
            b = Rb.get(c, {}).get(k, '—'); a = Ra[c][k]
            cells.append(f'{a}' if str(a) == str(b) else f'~~{b}~~ → **{a}**')
        lines.append(f'| {k} | ' + ' | '.join(cells) + ' |')
    return '\n'.join(lines)
if __name__ == '__main__':
    Rb, Ra = row(load(sys.argv[1])), row(load(sys.argv[2]))
    json.dump({'before': Rb, 'after': Ra}, open(sys.argv[3] + '.json', 'w'), indent=1)
    open(sys.argv[3], 'w').write(table(Rb, Ra)); print(open(sys.argv[3]).read()[:3000])
