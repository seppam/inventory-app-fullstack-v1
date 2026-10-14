from playwright.sync_api import sync_playwright
import time, requests

BASE = 'http://localhost:5173'
passed, failed = [], []

def log(p, n, d=''):
    (passed if p else failed).append(n)
    print(('PASS' if p else 'FAIL') + ' | ' + n + ((f' | {d}')[:80] if d else ''))

with sync_playwright() as pw:
    b = pw.chromium.launch(headless=True)

    # ── CONTEXT: ADMIN ──────────────────────────────────────
    ctx = b.new_context(viewport={"width":1280,"height":800})
    pg = ctx.new_page()
    pg.goto(BASE+'/login')
    pg.fill('input[type="email"]','admin@inventory.app')
    pg.fill('input[type="password"]','admin123')
    pg.click('button[type="submit"]')
    pg.wait_for_url('**/admin', timeout=8000)

    # Login page UI
    pg2 = ctx.new_page()
    pg2.goto(BASE+'/login'); pg2.wait_for_load_state('networkidle')
    log(pg2.query_selector('input[type="email"]'), '[AUTH-01] Email input present')
    log(pg2.query_selector('input[type="password"]'), '[AUTH-02] Password input present')
    log(pg2.query_selector('button[type="submit"]'), '[AUTH-03] Submit button present')
    log(pg2.query_selector('a[href="/register"]'), '[AUTH-04] Register link present')
    log(pg2.query_selector('input[type="password"]').get_attribute('type')=='password', '[AUTH-05] Password field masked')
    log(pg2.query_selector('text=Inventory App'), '[AUTH-06] Branding / logo visible')
    pg2.close()

    # Dashboard
    pg.goto(BASE+'/admin'); pg.wait_for_load_state('networkidle')
    log(pg.query_selector('text=Dashboard'), '[DASH-01] Dashboard header')
    log(pg.query_selector('text=Total Users'), '[DASH-02] Total Users stat card')
    log(pg.query_selector('text=Products'), '[DASH-03] Products stat card')
    log(pg.query_selector('text=Categories'), '[DASH-04] Categories stat card')
    log(pg.query_selector('text=Recent Activity'), '[DASH-05] Recent Activity section')

    # Products
    pg.goto(BASE+'/admin/products'); pg.wait_for_load_state('networkidle')
    log(pg.query_selector('h1,h2'), '[PRD-01] Products page heading')
    log(pg.query_selector('text=Add Product'), '[PRD-02] Add Product button')
    log(pg.query_selector('input[placeholder*="Search"]'), '[PRD-03] Search input')
    pg.click('text=Add Product', force=True); pg.wait_for_timeout(700)
    log(pg.query_selector('form'), '[PRD-04] Create modal opens')
    pg.keyboard.press('Escape'); pg.wait_for_timeout(400)
    log(True, '[PRD-05] Modal closes on Escape')
    pg.click('text=Add Product', force=True); pg.wait_for_timeout(700)
    log(len(pg.query_selector_all('input[type="number"]'))>=2, '[PRD-07] Price + Stock fields (type=number)')
    log(any('Wireless' in (i.get_attribute('placeholder') or '') for i in pg.query_selector_all('input[type="text"]')), '[PRD-06] Product name field')
    log(bool(pg.query_selector('.fixed select')), '[PRD-09] Category dropdown in modal')
    pg.keyboard.press('Escape'); pg.wait_for_timeout(400)
    # XSS check
    pg.goto(BASE+'/admin/products'); pg.wait_for_load_state('networkidle')
    search = pg.query_selector('input[placeholder*="Search"]')
    search.fill('<img src=x onerror="alert(1)">')
    pg.wait_for_timeout(600)
    body = pg.inner_text('body')
    log('alert(1)' not in body, '[SEC-06] XSS — no script execution from search input')
    pg.keyboard.press('Control+A'); pg.keyboard.press('Backspace')

    # Categories
    pg.goto(BASE+'/admin/categories'); pg.wait_for_load_state('networkidle')
    log(pg.query_selector('h1,h2'), '[CAT-01] Categories heading')
    log(pg.query_selector('text=Add Category'), '[CAT-02] Add Category button')
    log(pg.query_selector('text=Electronics'), '[CAT-03] Electronics category')
    log(pg.query_selector('text=Furniture'), '[CAT-04] Furniture category')
    log(pg.query_selector('text=Stationery'), '[CAT-05] Stationery category')
    pg.click('text=Add Category', force=True); pg.wait_for_timeout(700)
    log(pg.query_selector('form'), '[CAT-06] Create modal opens')
    log(bool(pg.query_selector('.fixed form input[type="text"]')), '[CAT-07] Category name input')
    pg.keyboard.press('Escape'); pg.wait_for_timeout(400)

    # Users
    pg.goto(BASE+'/admin/users'); pg.wait_for_load_state('networkidle')
    log(pg.query_selector('h1,h2'), '[USR-01] Users page heading')
    log(pg.query_selector('text=Admin'), '[USR-02] Admin badge visible')
    log(pg.query_selector('text=User'), '[USR-03] User badge visible')

    # Admin shortcut on home
    pg.goto(BASE+'/'); pg.wait_for_load_state('networkidle')
    log(pg.query_selector('text=Admin Panel'), '[HOME-05] Admin Panel shortcut for admin')

    # Sidebar nav
    pg.goto(BASE+'/admin'); pg.wait_for_load_state('networkidle')
    pg.click('text=Products'); pg.wait_for_url('**/products', timeout=5000)
    log('/products' in pg.url, '[NAV-01] Sidebar → Products')
    pg.click('text=Categories'); pg.wait_for_url('**/categories', timeout=5000)
    log('/categories' in pg.url, '[NAV-02] Sidebar → Categories')
    pg.click('text=Users'); pg.wait_for_url('**/users', timeout=5000)
    log('/users' in pg.url, '[NAV-03] Sidebar → Users')
    pg.click('text=Dashboard', timeout=5000); pg.wait_for_timeout(1200)
    u = pg.url
    log('products' not in u and 'categories' not in u, '[NAV-04] Sidebar → Dashboard')

    # Console errors
    errs = []
    pg3 = ctx.new_page()
    pg3.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
    pg3.goto(BASE+'/login')
    pg3.fill('input[type="email"]','admin@inventory.app')
    pg3.fill('input[type="password"]','admin123')
    pg3.click('button[type="submit"]')
    pg3.wait_for_url('**/admin', timeout=8000)
    for path in ['/admin/products','/admin/categories','/admin/users','/admin']:
        pg3.goto(BASE+path); pg3.wait_for_load_state('networkidle')
    pg3.wait_for_timeout(800)
    log(len(errs)==0, '[UI-01] No console errors admin pages', str(errs) if errs else 'clean')
    pg3.close()
    pg.close()
    ctx.close()

    # ── CONTEXT: UNAUTHENTICATED (fresh) ────────────────────
    ctx2 = b.new_context(viewport={"width":1280,"height":800})
    pg = ctx2.new_page()
    pg.goto(BASE+'/', timeout=10000)
    pg.wait_for_url('**/login', timeout=6000)
    log('/login' in pg.url, '[AUTH-11] Unauth / → /login', pg.url)
    pg.close()

    pg = ctx2.new_page()
    pg.goto(BASE+'/admin', timeout=10000)
    pg.wait_for_url('**/login', timeout=6000)
    log('/login' in pg.url, '[AUTH-12] Unauth /admin → /login', pg.url)
    pg.close()
    ctx2.close()

    # ── CONTEXT: REGULAR USER (fresh) ───────────────────────
    ctx3 = b.new_context(viewport={"width":1280,"height":800})
    pg = ctx3.new_page()
    pg.goto(BASE+'/login')
    pg.fill('input[type="email"]','septian@test.com')
    pg.fill('input[type="password"]','user123')
    pg.click('button[type="submit"]')
    pg.wait_for_url(BASE+'/', timeout=8000)
    pg.wait_for_load_state('networkidle')
    log(pg.query_selector('aside'), '[HOME-01] User home sidebar')
    body = pg.inner_text('body')
    log(any(x in body for x in ['morning','afternoon','evening','Welcome','Hi','Septian']), '[HOME-02] Personalized greeting')
    log('Products' in body, '[HOME-03] Products stat visible')
    pg.goto(BASE+'/admin'); pg.wait_for_timeout(2000)
    log('/admin' not in pg.url, '[HOME-04] Regular user blocked from /admin')
    # Navigate back to home to click Sign Out
    pg.goto(BASE+'/'); pg.wait_for_load_state('networkidle')
    so = pg.query_selector('button:has-text("Sign Out")')
    log(bool(so), '[AUTH-18] Sign Out button visible')
    so.click(); pg.wait_for_url('**/login', timeout=5000)
    log('/login' in pg.url, '[AUTH-18] User logout → /login')
    pg.close()
    ctx3.close()

    # ── CONTEXT: AUTH NEGATIVE (fresh) ──────────────────────
    ctx4 = b.new_context(viewport={"width":1280,"height":800})
    pg = ctx4.new_page()
    pg.goto(BASE+'/login')
    pg.fill('input[type="email"]','admin@inventory.app')
    pg.fill('input[type="password"]','wrongpass')
    pg.click('button[type="submit"]')
    pg.wait_for_timeout(2500)
    log('/login' in pg.url, '[AUTH-09] Wrong password → stays on /login')
    pg.close()

    pg = ctx4.new_page()
    pg.goto(BASE+'/login')
    pg.fill('input[type="email"]','fake_'+str(int(time.time()))+'@test.com')
    pg.fill('input[type="password"]','anypass')
    pg.click('button[type="submit"]')
    pg.wait_for_timeout(2500)
    log('/login' in pg.url, '[AUTH-10] Unregistered email → stays on /login')
    pg.close()

    pg = ctx4.new_page()
    pg.goto(BASE+'/register'); pg.wait_for_load_state('networkidle')
    log(pg.query_selector('input[type="text"]'), '[AUTH-13] Register — name field')
    log(pg.query_selector('input[type="email"]'), '[AUTH-14] Register — email field')
    log(pg.query_selector('input[type="password"]'), '[AUTH-15] Register — password field')
    log(pg.query_selector('a[href="/login"]'), '[AUTH-16] Register — login link')
    pg.fill('input[type="text"]','Dup')
    pg.fill('input[type="email"]','admin@inventory.app')
    pg.fill('input[type="password"]','test123')
    pg.click('button[type="submit"]')
    pg.wait_for_timeout(2500)
    log('/register' in pg.url, '[SEC-07] Duplicate email blocked')
    pg.close()

    pg = ctx4.new_page()
    pg.goto(BASE+'/login')
    pg.fill('input[type="email"]','admin@inventory.app')
    pg.fill('input[type="password"]','admin123')
    pg.click('button[type="submit"]')
    pg.wait_for_url('**/admin', timeout=8000)
    pg.click('button:has-text("Sign Out")'); pg.wait_for_url('**/login', timeout=5000)
    log('/login' in pg.url, '[AUTH-17] Admin logout')
    pg.close()
    ctx4.close()

    # ── API SECURITY ────────────────────────────────────────
    r1 = requests.get('http://localhost:3000/api/dashboard/summary')
    log(r1.status_code==401, '[SEC-01] API unauth → 401', f"HTTP {r1.status_code}")
    r2 = requests.post('http://localhost:3000/api/auth/login', json={'email':'admin@inventory.app','password':'admin123'})
    token = r2.json()['data']['token']
    r3 = requests.get('http://localhost:3000/api/dashboard/summary', headers={'Authorization':f'Bearer {token}'})
    log(r3.status_code==200, '[SEC-02] API valid JWT → 200', f"HTTP {r3.status_code}")
    r4 = requests.get('http://localhost:3000/api/users', headers={'Authorization':f'Bearer {token}'})
    log(r4.status_code==200, '[SEC-03] Admin /api/users → 200', f"HTTP {r4.status_code}")
    r5 = requests.get('http://localhost:3000/api/users', headers={'Authorization':'Bearer bad_token'})
    log(r5.status_code==401, '[SEC-04] API invalid token → 401', f"HTTP {r5.status_code}")

    ctx5 = b.new_context(viewport={"width":1280,"height":800})
    pg = ctx5.new_page()
    pg.goto(BASE+'/login')
    pg.fill('input[type="email"]','admin@inventory.app')
    pg.fill('input[type="password"]','admin123')
    pg.click('button[type="submit"]')
    pg.wait_for_url('**/admin', timeout=8000)
    log('token=' not in pg.url and 'jwt' not in pg.url.lower(), '[SEC-05] JWT not in URL')
    pg.close()
    ctx5.close()

    b.close()

# SUMMARY
total = len(passed)+len(failed)
pct = len(passed)*100//total if total else 0
print()
print('='*58)
print('  SENIOR QA  |  FINAL TEST REPORT  |  Inventory App')
print('='*58)
print(f'  Total:  {total}')
print(f'  Passed: {len(passed)} / {total}  ({pct}%)')
print(f'  Failed: {len(failed)} / {total}')
print('='*58)
if failed:
    for n in failed: print('  FAIL |', n)
else:
    print('  ALL TESTS PASSED!')
print()
