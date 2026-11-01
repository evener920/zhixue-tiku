#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把《每天10道应用题》282 题合并进 zhixue-tiku 的 data/questions.json。
新增一个数学 board：四年级·每天10道应用题（id=math_g4sup, type=practice），
按「打卡第X天」拆成 30 个 passage，每题 type=fill。
原库 987 题完全不动，仅在 math subject 的 boards 末尾追加新 board。
"""
import json, os

REPO = os.path.dirname(os.path.abspath(__file__))
SRC  = "/Users/evener920/WorkBuddy/2026-11-01-16-48-54/题库_每天10道应用题_四上/题库.json"
DST  = os.path.join(REPO, "data", "questions.json")

src = json.load(open(SRC, encoding="utf-8"))
bank = json.load(open(DST, encoding="utf-8"))

problems = src["problems"]

# 按 day 分组
days = {}
for p in problems:
    days.setdefault(p["day"], []).append(p)
days = dict(sorted(days.items()))

passages = []
for day in sorted(days):
    items = sorted(days[day], key=lambda x: x["no"])
    chapter = items[0]["chapter"]
    questions = []
    for p in items:
        questions.append({
            "id": f"math_g4sup_p{day:02d}_q{p['no']}",
            "type": "fill",
            "stem": p["stem"],
            "answer": p["answer"],
            "explanation": p.get("note", "") or "",
            "difficulty": "中",
            "tags": [p["chapter"], p["subtype"]],
        })
    passages.append({
        "id": f"math_g4sup_p{day:02d}",
        "title": f"打卡第{day}天 · {chapter}",
        "grade": "四年级",
        "text": f"四年级上册《每天10道应用题》· 打卡第{day}天（{chapter}）",
        "questions": questions,
        "semester": "上学期",
    })

new_board = {
    "id": "math_g4sup",
    "name": "四年级·每天10道应用题",
    "type": "practice",
    "desc": "四年级上册《每天10道应用题》共30天282题，含课内练习与课外拓展，按天打卡。",
    "passages": passages,
}

# 找到数学 subject 并追加
math = next(s for s in bank["subjects"] if s["name"] == "数学")
if any(b["id"] == new_board["id"] for b in math["boards"]):
    raise SystemExit(f"board {new_board['id']} 已存在，拒绝重复追加")
math["boards"].append(new_board)

json.dump(bank, open(DST, "w", encoding="utf-8"),
          ensure_ascii=False, indent=2)

total_new = sum(len(p["questions"]) for p in passages)
print(f"已合并：新增 board 1 个，passage {len(passages)} 个，新题 {total_new} 道")
print(f"data/questions.json 已写回，当前 math boards 数：{len(math['boards'])}")
