# Before/after metrics with the ws-a2 audit's definitions (analyze.py): rendered values from the computed-style
# capture at 1440 and 390, colours clustered at dE76<3 / alpha +-0.05; source counts from the three CSS files.
import json, glob, os, re, sys, collections, math
sys.path.insert(0, '/tmp/claude-0/-home-user/880ad5ad-058b-5c40-9bba-4c19903c0d78/scratchpad/ws-a2/scripts')
src = open('/tmp/claude-0/-home-user/880ad5ad-058b-5c40-9bba-4c19903c0d78/scratchpad/ws-a2/scripts/analyze.py').read()
ns = {'re': re, 'math': math}
exec(src[src.index('def parse'):src.index('TOKENS')], ns)  # parse, hexs, lab, dE
parse, hexs, dE = ns['parse'], ns['hexs'], ns['dE']
def load(root):
    D = {}
    for f in sorted(glob.glob(f'{root}/data/*__*.json')):
        s, vk = os.path.basename(f)[:-5].split('__'); D[(s, vk)] = json.load(open(f))
    return D
def clusters(D, kind):
    cnt = collections.Counter()
    for (s, v), d in D.items():
        for e in d['els']:
            if kind == 'bg': c = e['bg']
            elif kind == 'text':
                if not e['txt']: continue
                c = e['color']
            else:
                if e['bs'] in ('none', '') or float(e['bw'][:-2] or 0) == 0: continue
                c = e['bc']
            t = parse(c)
            if not t or t[3] == 0: continue
            cnt[t] += 1
    cl = []
    for t, n in sorted(cnt.items(), key=lambda kv: -kv[1]):
        for c in cl:
            if abs(c[3] - t[3]) < 0.06 and dE(c, t) < 3: break
        else: cl.append(t)
    return len(cnt), len(cl)
def distinct(D, key, filt=lambda e: True):
    c = collections.Counter()
    for d in D.values():
        for e in d['els']:
            if filt(e) and e[key] not in ('', 'none', None): c[e[key]] += 1
    return c
def rendered(root):
    D = load(root); out = {}
    for k in ('bg', 'text', 'border'): out[f'{k} colours (values / clusters)'] = '%d / %d' % clusters(D, k)
    t = lambda e: bool(e['txt'])
    out['font sizes'] = len(distinct(D, 'fs', t)); out['font weights'] = len(distinct(D, 'fw', t))
    out['line-heights'] = len(distinct(D, 'lh', t)); out['letter-spacings'] = len(distinct(D, 'ls', t))
    out['text < 14px (elements, excl. lockup descriptor)'] = sum(1 for d in D.values() for e in d['els'] if e['txt'] and float(e['fs'][:-2]) < 14 and 'INTEGRATED' not in e['txt'].upper()[:20])
    out['uppercase text elements'] = sum(1 for d in D.values() for e in d['els'] if e['txt'] and e['tt'] == 'uppercase')
    out['radii (non-zero)'] = len({e['rad'] for d in D.values() for e in d['els'] if e['rad'] not in ('0px',)})
    out['box-shadows'] = len(distinct(D, 'shadow'))
    out['backdrop-filters'] = len(distinct(D, 'bf'))
    glass = {(e['bf'], hexs(parse(e['bg'])) if parse(e['bg']) else e['bg'], e['rad']) for d in D.values() for e in d['els'] if e['bf'] != 'none'}
    out['glass recipes (filter x bg x radius)'] = len(glass)
    h1 = collections.Counter(h['fs'] for (s, v), d in D.items() if v == 'd' for h in d['heads'] if h['tag'] == 'h1')
    out['H1 sizes at 1440'] = len(h1); out['_h1'] = dict(h1)
    btn = {(round(b['h']), b['rad'], b['fs'], b['fw']) for (s, v), d in D.items() if v == 'd' for b in d['btns'] if parse(b['bg']) and parse(b['bg'])[:3] == (14, 165, 233)}
    out['primary button variants at 1440 (h x radius x size x weight)'] = len(btn); out['_btn'] = sorted(btn)
    out['routes'] = len({s for s, v in D})
    return out
def source(paths):
    css = ''.join(open(p).read() for p in paths)
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    return {
        'hex literals (distinct)': len(set(m.lower() for m in re.findall(r'#[0-9a-fA-F]{3,8}\b', css))),
        'rgb/rgba literals (distinct)': len(set(re.sub(r'\s', '', m) for m in re.findall(r'rgba?\([^)]*\)', css))),
        '!important': css.count('!important'),
        'blur radii (distinct)': len(set(re.findall(r'blur\(([\d.]+px)\)', css))),
        'box-shadow declarations (distinct)': len(set(re.sub(r'\s+', ' ', m) for m in re.findall(r'box-shadow:([^;}]*)', css))),
        'bytes': len(css),
    }
if __name__ == '__main__':
    which = sys.argv[1]
    if which == 'rendered': print(json.dumps(rendered(sys.argv[2]), indent=1))
    else: print(json.dumps(source(sys.argv[2:]), indent=1))
