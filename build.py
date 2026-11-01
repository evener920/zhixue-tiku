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

# 1) 注入新 CSS（幂等：已存在则跳过）
NEW_CSS = """
/* ---- 听力音频播放器 + 判断题 + 任务题提示 ---- */
.listen-audio { width: 100%; max-width: 560px; height: 44px; margin-bottom: 14px; border-radius: 10px; }
.passage-topic { font-size: 13px; color: #8a8175; margin: 2px 0 12px; }
.q-instr { color: #6b6256; font-style: italic; font-weight: 500; }
.task-note { background: #FFF7E6; border: 1px solid #F0D9A8; color: #8a6d3b; border-radius: 10px; padding: 10px 12px; font-size: 13.5px; line-height: 1.6; margin: 4px 0 14px; display: flex; gap: 8px; align-items: flex-start; }
.task-note svg { flex: none; width: 16px; height: 16px; margin-top: 2px; }
"""
if '.listen-audio {' not in html:
    html = html.replace('</style>', NEW_CSS + '</style>', 1)
else:
    print('CSS 已存在，跳过注入')

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
