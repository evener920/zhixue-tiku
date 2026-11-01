#!/usr/bin/env python3
"""重新生成单文件 index.html：内联更新后的 app.js + 最新题库数据 + 新 CSS。
用法：python3 build.py
仅做最小侵入：替换 index.html 中的数据块与末尾的 app.js 脚本块，并在 <style> 内注入新 CSS。
"""
import json, re, io

ROOT = __import__('os').path.dirname(__import__('os').path.abspath(__file__))

bank = json.load(open(f'{ROOT}/data/questions.json', encoding='utf-8'))
app_src = open(f'{ROOT}/app.js', encoding='utf-8').read()
css_src = open(f'{ROOT}/styles.css', encoding='utf-8').read()
html = open(f'{ROOT}/index.html', encoding='utf-8').read()

# 1) 用最新 styles.css 整体替换 <style>...</style> 内部（保证 index.html 始终与 styles.css 一致）
sty_open = html.index('<style>') + len('<style>')
sty_close = html.index('</style>')
html = html[:sty_open] + '\n' + css_src + '\n' + html[sty_close:]
print('CSS 已用 styles.css 整体刷新')

# 2) 替换数据块 window.EMBEDDED_BANK = {...};</script>
data_json = json.dumps(bank, ensure_ascii=False, separators=(',', ':'))
new_data = 'window.EMBEDDED_BANK = ' + data_json + ';</script>'
html, n = re.subn(r'window\.EMBEDDED_BANK\s*=\s*.*?;</script>',
                  lambda m: new_data if m.group(0).startswith('window.EMBEDDED_BANK') else m.group(0),
                  html, count=1, flags=re.S)
assert n == 1, f'数据块替换失败，匹配数={n}'

# 3) 替换末尾的 app.js 脚本块（以 const STORE_KEY 为锚）
k = html.index('const STORE_KEY')
open_idx = html.rindex('<script>', 0, k)
close_idx = html.index('</script>', k)
html = html[:open_idx] + '<script>\n' + app_src + '\n</script>' + html[close_idx + len('</script>'):]

open(f'{ROOT}/index.html', 'w', encoding='utf-8').write(html)
print('index.html 已重新生成，大小 %.2f MB' % (len(html.encode('utf-8')) / 1048576))
