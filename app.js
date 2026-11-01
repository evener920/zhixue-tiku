/* ===========================================================
   智学题库 v4 — 参考奶油色学习中心仪表盘重做
   布局：左固定栏 + 右"学习中心"；词库双列卡片网格；年级/科目胶囊筛选。
   数据：subjects[] → boards[] → passages[] → questions[]
   =========================================================== */

const STORE_KEY = 'quizbank_data';
const WRONG_KEY = 'quizbank_wrong';
const PROGRESS_KEY = 'quizbank_progress';

/* 内置示例题库（与 data/questions.json 一致，作为离线回退） */
const SAMPLE_BANK = {
  "version": "3.0",
  "grades": [
    "小学",
    "初中",
    "高中"
  ],
  "subjects": [
    {
      "id": "sub_chinese",
      "name": "语文",
      "icon": "📕",
      "color": "#e0533d",
      "boards": [
        {
          "id": "cn_read",
          "name": "阅读",
          "type": "reading",
          "desc": "现代文阅读，训练提取信息、概括与推断。",
          "passages": [
            {
              "id": "cn_read_p1",
              "title": "小松鼠过冬",
              "grade": "小学",
              "text": "秋天到了，树林里的果子越来越少。小松鼠蹦蹦一边储藏松果，一边发愁：冬天那么长，这些够吃吗？妈妈笑着说：“别担心，我们每天存一点，慢慢就够啦。”\n果然，整个冬天，蹦蹦靠着秋天存下的松果，过得又暖和又饱足。它明白了：提前准备，比临时着急更有用。",
              "questions": [
                {
                  "id": "cn_read_p1_q1",
                  "type": "single",
                  "stem": "小松鼠发愁的原因是？",
                  "options": [
                    "冬天太长，怕果子不够吃",
                    "找不到妈妈",
                    "不爱吃松果",
                    "天气太热"
                  ],
                  "answer": 0,
                  "explanation": "文中写小松鼠“发愁：冬天那么长，这些够吃吗”，即担心食物不足。",
                  "difficulty": "易",
                  "tags": [
                    "童话",
                    "主旨"
                  ]
                },
                {
                  "id": "cn_read_p1_q2",
                  "type": "single",
                  "stem": "妈妈告诉小松鼠要怎么做？",
                  "options": [
                    "每天存一点",
                    "去向别人要",
                    "不用准备",
                    "等冬天再找"
                  ],
                  "answer": 0,
                  "explanation": "妈妈说“我们每天存一点，慢慢就够啦”。",
                  "difficulty": "易",
                  "tags": [
                    "细节"
                  ]
                },
                {
                  "id": "cn_read_p1_q3",
                  "type": "single",
                  "stem": "这个故事告诉我们什么道理？",
                  "options": [
                    "临时着急没用，要提前准备",
                    "松果不好吃",
                    "冬天其实很短",
                    "妈妈不会帮忙"
                  ],
                  "answer": 0,
                  "explanation": "结尾点明“提前准备，比临时着急更有用”。",
                  "difficulty": "中",
                  "tags": [
                    "道理"
                  ]
                }
              ],
              "semester": "上学期"
            },
            {
              "id": "cn_read_p2",
              "title": "坚持的力量",
              "grade": "初中",
              "text": "有个年轻人向一位书法家请教成功的秘诀。书法家让他每天写一百个大字，坚持一个月。年轻人照做了，可一个月后水平并无明显长进，便想放弃。\n书法家问他：“你写的纸用了多少？”年轻人说：“三十张。”书法家说：“再写三十张，再来问我。”又过一个月，年轻人的字果然有了神采。\n原来，所谓的天赋，常常是看不见的日积月累。把一件简单的事重复做、认真做，时间自会给出答案。",
              "questions": [
                {
                  "id": "cn_read_p2_q1",
                  "type": "single",
                  "stem": "年轻人最初为什么想放弃？",
                  "options": [
                    "水平没有明显长进",
                    "书法家批评了他",
                    "没有纸了",
                    "他觉得太累"
                  ],
                  "answer": 0,
                  "explanation": "文中写“一个月后水平并无明显长进，便想放弃”。",
                  "difficulty": "中",
                  "tags": [
                    "叙事"
                  ]
                },
                {
                  "id": "cn_read_p2_q2",
                  "type": "single",
                  "stem": "书法家让年轻人再写三十张，是为了？",
                  "options": [
                    "惩罚他",
                    "让他继续积累练习",
                    "浪费纸张",
                    "拖延时间"
                  ],
                  "answer": 1,
                  "explanation": "后续年轻人字“有了神采”，说明是让他继续积累。",
                  "difficulty": "中",
                  "tags": [
                    "推断"
                  ]
                },
                {
                  "id": "cn_read_p2_q3",
                  "type": "single",
                  "stem": "本文主要说明什么？",
                  "options": [
                    "天赋决定一切",
                    "日积月累的坚持很重要",
                    "书法家很严厉",
                    "写字很简单"
                  ],
                  "answer": 1,
                  "explanation": "结尾点明“天赋常常是看不见的日积月累”。",
                  "difficulty": "难",
                  "tags": [
                    "主旨"
                  ]
                }
              ],
              "semester": "下学期"
            },
            {
              "id": "cn_read_p3",
              "title": "信息时代的专注力",
              "grade": "高中",
              "text": "打开手机，平均不到十分钟我们就会忍不住看一眼通知；读完一篇长文前，手指已经滑向了下一条短视频。注意力，正在成为这个时代最稀缺的资源。\n研究表明，频繁的任务切换会显著拖慢思考深度。当我们一边回消息一边写报告，表面高效，实则错误率上升、创意下降。真正的专注，不是更长时间地坐在桌前，而是主动屏蔽干扰、为重要的事留出整块时间。\n保护专注力，或许从关掉一个不必要的推送开始。",
              "questions": [
                {
                  "id": "cn_read_p3_q1",
                  "type": "single",
                  "stem": "作者认为当下最稀缺的资源是？",
                  "options": [
                    "金钱",
                    "注意力",
                    "时间",
                    "能源"
                  ],
                  "answer": 1,
                  "explanation": "文中直接说“注意力，正在成为这个时代最稀缺的资源”。",
                  "difficulty": "中",
                  "tags": [
                    "议论"
                  ]
                },
                {
                  "id": "cn_read_p3_q2",
                  "type": "single",
                  "stem": "频繁的任务切换会导致？",
                  "options": [
                    "思考更深入",
                    "错误率上升、创意下降",
                    "效率翻倍",
                    "更加专注"
                  ],
                  "answer": 1,
                  "explanation": "第二段指出“错误率上升、创意下降”。",
                  "difficulty": "难",
                  "tags": [
                    "分析"
                  ]
                },
                {
                  "id": "cn_read_p3_q3",
                  "type": "single",
                  "stem": "作者建议如何保护专注力？",
                  "options": [
                    "多开几个推送",
                    "主动屏蔽干扰、留出整块时间",
                    "不停切换任务",
                    "少睡觉"
                  ],
                  "answer": 1,
                  "explanation": "第三段提出“主动屏蔽干扰、为重要的事留出整块时间”。",
                  "difficulty": "难",
                  "tags": [
                    "建议"
                  ]
                }
              ],
              "semester": "上学期"
            }
          ]
        },
        {
          "id": "cn_poem",
          "name": "古诗文",
          "type": "reading",
          "desc": "课内古诗文默写与赏析。",
          "passages": [
            {
              "id": "cn_poem_p1",
              "title": "《静夜思》李白",
              "grade": "初中",
              "text": "《静夜思》［唐］李白\n床前明月光，疑是地上霜。\n举头望明月，低头思故乡。",
              "questions": [
                {
                  "id": "cn_poem_p1_q1",
                  "type": "single",
                  "stem": "这首诗的作者是？",
                  "options": [
                    "李白",
                    "杜甫",
                    "白居易",
                    "王维"
                  ],
                  "answer": 0,
                  "explanation": "诗题已标明作者为李白。",
                  "difficulty": "易",
                  "tags": [
                    "作者"
                  ]
                },
                {
                  "id": "cn_poem_p1_q2",
                  "type": "single",
                  "stem": "这首诗主要表达了诗人怎样的情感？",
                  "options": [
                    "思念故乡",
                    "喜爱春天",
                    "赞美山水",
                    "忧国忧民"
                  ],
                  "answer": 0,
                  "explanation": "末句“低头思故乡”点明思乡之情。",
                  "difficulty": "易",
                  "tags": [
                    "情感"
                  ]
                },
                {
                  "id": "cn_poem_p1_q3",
                  "type": "single",
                  "stem": "“疑是地上霜”中的“疑”意思是？",
                  "options": [
                    "好像",
                    "怀疑",
                    "确定",
                    "害怕"
                  ],
                  "answer": 0,
                  "explanation": "“疑”在此处意为“好像、仿佛”。",
                  "difficulty": "中",
                  "tags": [
                    "词义"
                  ]
                }
              ],
              "semester": "下学期"
            }
          ]
        },
        {
          "id": "cn_basic",
          "name": "基础知识",
          "type": "practice",
          "desc": "字词音形义与语言运用。",
          "passages": [
            {
              "id": "cn_basic_p1",
              "title": "基础知识练习",
              "grade": "初中",
              "text": "",
              "questions": [
                {
                  "id": "cn_basic_p1_q1",
                  "type": "single",
                  "stem": "下列词语中没有错别字的是？",
                  "options": [
                    "再接再厉",
                    "迫不急待",
                    "一如继往",
                    "默守成规"
                  ],
                  "answer": 0,
                  "explanation": "其余应为：迫不及待、一如既往、墨守成规。",
                  "difficulty": "中",
                  "tags": [
                    "错别字"
                  ]
                },
                {
                  "id": "cn_basic_p1_q2",
                  "type": "single",
                  "stem": "“举一反三”中“反”的意思是？",
                  "options": [
                    "类推",
                    "相反",
                    "返回",
                    "反抗"
                  ],
                  "answer": 0,
                  "explanation": "“举一反三”指从一件事类推而知许多事。",
                  "difficulty": "中",
                  "tags": [
                    "词义"
                  ]
                }
              ],
              "semester": "上学期"
            }
          ]
        }
      ]
    },
    {
      "id": "sub_math",
      "name": "数学",
      "icon": "📐",
      "color": "#2f9e6e",
      "boards": [
        {
          "id": "math_wrong",
          "name": "易错专项",
          "type": "practice",
          "desc": "高频易错题集中突破，练会为止。",
          "passages": [
            {
              "id": "math_wrong_p1",
              "title": "易错专项 · 折扣问题",
              "grade": "初中",
              "text": "某商品原价 100 元，打八折后售价多少元？",
              "questions": [
                {
                  "id": "math_wrong_p1_q1",
                  "type": "fill",
                  "stem": "打八折后的售价是 ____ 元。",
                  "answer": "80",
                  "explanation": "100 × 0.8 = 80（元）。",
                  "difficulty": "易",
                  "tags": [
                    "百分数",
                    "折扣"
                  ]
                }
              ],
              "semester": "下学期"
            },
            {
              "id": "math_wrong_p2",
              "title": "易错专项 · 导数",
              "grade": "高中",
              "text": "已知函数 f(x) = x²，求 f'(2)。",
              "questions": [
                {
                  "id": "math_wrong_p2_q1",
                  "type": "fill",
                  "stem": "f'(2) = ____。",
                  "answer": "4",
                  "explanation": "f'(x) = 2x，故 f'(2) = 4。",
                  "difficulty": "中",
                  "tags": [
                    "导数"
                  ]
                }
              ],
              "semester": "上学期"
            }
          ]
        },
        {
          "id": "math_drill",
          "name": "专项练习",
          "type": "practice",
          "desc": "针对薄弱考点专项突破。",
          "passages": [
            {
              "id": "math_drill_p1",
              "title": "专项 · 一元一次方程",
              "grade": "初中",
              "text": "解方程：2x + 3 = 11。",
              "questions": [
                {
                  "id": "math_drill_p1_q1",
                  "type": "fill",
                  "stem": "方程的解为 x = ____。",
                  "answer": "4",
                  "explanation": "2x = 8，x = 4。",
                  "difficulty": "易",
                  "tags": [
                    "方程"
                  ]
                }
              ],
              "semester": "下学期"
            }
          ]
        },
        {
          "id": "math_exam",
          "name": "真题卷",
          "type": "practice",
          "desc": "历年真题演练。",
          "passages": [
            {
              "id": "math_exam_p1",
              "title": "真题 · 集合",
              "grade": "高中",
              "text": "已知集合 A = {1, 2}，B = {2, 3}。",
              "questions": [
                {
                  "id": "math_exam_p1_q1",
                  "type": "single",
                  "stem": "A ∩ B = ?",
                  "options": [
                    "{2}",
                    "{1}",
                    "{1, 2, 3}",
                    "∅"
                  ],
                  "answer": 0,
                  "explanation": "交集取两集合公共元素，即 {2}。",
                  "difficulty": "易",
                  "tags": [
                    "集合"
                  ]
                }
              ],
              "semester": "上学期"
            }
          ]
        }
      ]
    },
    {
      "id": "sub_english",
      "name": "英语",
      "icon": "🔤",
      "color": "#3b6ef5",
      "boards": [
        {
          "id": "en_listen",
          "name": "听力",
          "type": "listening",
          "desc": "对话与播报，听音抓关键信息。",
          "passages": [
            {
              "id": "en_listen_p1",
              "title": "At the Zoo（在动物园）",
              "grade": "小学",
              "text": "Listen to the dialogue.\nA: Look, a big elephant! Do you like elephants?\nB: Yes! And I like the red balloon in my hand.\nA: How many balloons do you have?\nB: I have three. One red, one blue, and one yellow.\nA: Great! Let's see the pandas next.",
              "questions": [
                {
                  "id": "en_listen_p1_q1",
                  "type": "single",
                  "stem": "他们首先看到什么动物？",
                  "options": [
                    "大象 Elephant",
                    "熊猫 Panda",
                    "老虎 Tiger",
                    "狮子 Lion"
                  ],
                  "answer": 0,
                  "explanation": "A 说 “Look, a big elephant!”",
                  "difficulty": "易",
                  "tags": [
                    "数字",
                    "动物"
                  ]
                },
                {
                  "id": "en_listen_p1_q2",
                  "type": "single",
                  "stem": "B 手里有几个气球？",
                  "options": [
                    "两个",
                    "三个",
                    "四个",
                    "一个"
                  ],
                  "answer": 1,
                  "explanation": "B 说 “I have three.”",
                  "difficulty": "易",
                  "tags": [
                    "数字"
                  ]
                },
                {
                  "id": "en_listen_p1_q3",
                  "type": "single",
                  "stem": "其中一个气球是什么颜色？",
                  "options": [
                    "绿色",
                    "红色",
                    "黑色",
                    "白色"
                  ],
                  "answer": 1,
                  "explanation": "B 说有 “one red, one blue, and one yellow”，包含红色。",
                  "difficulty": "中",
                  "tags": [
                    "颜色"
                  ]
                }
              ],
              "semester": "下学期"
            },
            {
              "id": "en_listen_p2",
              "title": "A Phone Call（一通电话）",
              "grade": "初中",
              "text": "Listen to the phone call.\nMom: Hi sweetie, how was your exam today?\nTom: It was okay, but math was a bit hard.\nMom: Don't worry. Did you eat lunch?\nTom: Yes, I had noodles with Lisa at twelve.\nMom: Good. I'll pick you up at five. Love you!\nTom: Love you too, Mom.",
              "questions": [
                {
                  "id": "en_listen_p2_q1",
                  "type": "single",
                  "stem": "Tom 觉得考试怎么样？",
                  "options": [
                    "数学有点难",
                    "非常简单",
                    "没及格",
                    "没参加"
                  ],
                  "answer": 0,
                  "explanation": "Tom 说 “math was a bit hard”。",
                  "difficulty": "易",
                  "tags": [
                    "日常"
                  ]
                },
                {
                  "id": "en_listen_p2_q2",
                  "type": "single",
                  "stem": "Tom 午饭吃了什么？",
                  "options": [
                    "面条 Noodles",
                    "米饭 Rice",
                    "面包 Bread",
                    "披萨 Pizza"
                  ],
                  "answer": 0,
                  "explanation": "Tom 说 “I had noodles with Lisa”。",
                  "difficulty": "易",
                  "tags": [
                    "饮食"
                  ]
                },
                {
                  "id": "en_listen_p2_q3",
                  "type": "single",
                  "stem": "妈妈几点来接 Tom？",
                  "options": [
                    "五点",
                    "十二点",
                    "三点",
                    "八点"
                  ],
                  "answer": 0,
                  "explanation": "Mom 说 “I'll pick you up at five.”",
                  "difficulty": "中",
                  "tags": [
                    "时间"
                  ]
                }
              ],
              "semester": "上学期"
            },
            {
              "id": "en_listen_p3",
              "title": "A Weather Report（天气预报）",
              "grade": "高中",
              "text": "Listen to the short weather report.\nGood morning. Today will be mostly sunny with a high of twenty-two degrees. Winds will be light from the west. Tonight, clouds will move in and there is a thirty percent chance of rain after midnight. Tomorrow looks cooler, around seventeen degrees, with showers in the afternoon. If you plan to travel, expect some delays after lunch. Have a great day!",
              "questions": [
                {
                  "id": "en_listen_p3_q1",
                  "type": "single",
                  "stem": "今天的最高气温是多少？",
                  "options": [
                    "17度",
                    "22度",
                    "30度",
                    "12度"
                  ],
                  "answer": 1,
                  "explanation": "播报说 “a high of twenty-two degrees”。",
                  "difficulty": "中",
                  "tags": [
                    "天气"
                  ]
                },
                {
                  "id": "en_listen_p3_q2",
                  "type": "single",
                  "stem": "今晚可能什么时候下雨？",
                  "options": [
                    "中午前",
                    "午夜后",
                    "早上",
                    "不会下雨"
                  ],
                  "answer": 1,
                  "explanation": "有 “a thirty percent chance of rain after midnight”。",
                  "difficulty": "中",
                  "tags": [
                    "天气"
                  ]
                },
                {
                  "id": "en_listen_p3_q3",
                  "type": "single",
                  "stem": "明天出行可能遇到什么？",
                  "options": [
                    "没有延误",
                    "午饭后有些延误",
                    "航班取消",
                    "路况完美"
                  ],
                  "answer": 1,
                  "explanation": "播报提醒 “expect some delays after lunch”。",
                  "difficulty": "难",
                  "tags": [
                    "推断"
                  ]
                }
              ],
              "semester": "下学期"
            }
          ]
        },
        {
          "id": "en_read",
          "name": "阅读",
          "type": "reading",
          "desc": "说明与思辨短文，训练主旨与态度。",
          "passages": [
            {
              "id": "en_read_p1",
              "title": "The Internet and Us",
              "grade": "初中",
              "text": "The internet has changed how we learn, shop, and talk to friends. With a phone, we can watch videos, send messages, and find answers in seconds. This convenience is amazing.\nHowever, spending too much time online can hurt us. Some people scroll for hours and forget to sleep or meet friends in real life. Others believe everything they read without checking.\nThe key is balance. Use the internet as a tool, not a master. When we control our screen time, technology helps us instead of controlling us.",
              "questions": [
                {
                  "id": "en_read_p1_q1",
                  "type": "single",
                  "stem": "What is the main idea of the first paragraph?",
                  "options": [
                    "The internet is only for fun",
                    "The internet brings great convenience",
                    "Phones are dangerous",
                    "We should avoid the internet"
                  ],
                  "answer": 1,
                  "explanation": "首段讲手机能看视频、发消息、秒查答案，“This convenience is amazing”。",
                  "difficulty": "中",
                  "tags": [
                    "主旨"
                  ]
                },
                {
                  "id": "en_read_p1_q2",
                  "type": "single",
                  "stem": "According to the passage, a problem of too much online time is that people ___.",
                  "options": [
                    "learn faster",
                    "may forget to sleep or meet friends",
                    "save more money",
                    "read more books"
                  ],
                  "answer": 1,
                  "explanation": "第二段说有人“forget to sleep or meet friends in real life”。",
                  "difficulty": "中",
                  "tags": [
                    "细节"
                  ]
                },
                {
                  "id": "en_read_p1_q3",
                  "type": "single",
                  "stem": "What does the author suggest?",
                  "options": [
                    "Use the internet with balance",
                    "Delete all apps",
                    "Never go online",
                    "Buy a new phone"
                  ],
                  "answer": 0,
                  "explanation": "末段首句 “The key is balance.”",
                  "difficulty": "难",
                  "tags": [
                    "态度"
                  ]
                }
              ],
              "semester": "上学期"
            },
            {
              "id": "en_read_p2",
              "title": "The Quiet Power of Reading",
              "grade": "高中",
              "text": "Reading is often praised for building vocabulary, but its deeper value lies elsewhere. When we read a novel, we temporarily step into another person's mind. This mental simulation of others' thoughts and feelings strengthens what psychologists call “theory of mind” — the ability to understand that other people may hold beliefs different from our own.\nA growing body of research suggests that frequent readers are better at reading social cues and showing empathy in real life. In one study, people who read literary fiction performed better on tests measuring social perception than those who read non-fiction or nothing at all.\nNone of this requires speed. In fact, slow, attentive reading may matter more than the number of books finished. The point is not to consume texts, but to dwell in them.",
              "questions": [
                {
                  "id": "en_read_p2_q1",
                  "type": "single",
                  "stem": "According to the passage, the deeper value of reading is that it ___.",
                  "options": [
                    "builds a large vocabulary quickly",
                    "helps us understand others' minds",
                    "improves writing speed",
                    "replaces real-life social contact"
                  ],
                  "answer": 1,
                  "explanation": "文中说阅读强化 “theory of mind”，即理解他人想法。",
                  "difficulty": "难",
                  "tags": [
                    "推断"
                  ]
                },
                {
                  "id": "en_read_p2_q2",
                  "type": "single",
                  "stem": "What did the study find?",
                  "options": [
                    "Non-fiction readers had the best social perception",
                    "Literary fiction readers scored higher on social perception tests",
                    "Reading speed determines empathy",
                    "Non-readers are the most empathetic"
                  ],
                  "answer": 1,
                  "explanation": "研究发现读文学小说者在社会感知测试中表现更好。",
                  "difficulty": "难",
                  "tags": [
                    "研究"
                  ]
                },
                {
                  "id": "en_read_p2_q3",
                  "type": "single",
                  "stem": "What is the author's attitude toward reading speed?",
                  "options": [
                    "Faster is always better",
                    "Slow, attentive reading may matter more",
                    "Speed is the only thing that counts",
                    "Speed should be maximized"
                  ],
                  "answer": 1,
                  "explanation": "作者说“slow, attentive reading may matter more”。",
                  "difficulty": "难",
                  "tags": [
                    "态度"
                  ]
                }
              ],
              "semester": "下学期"
            }
          ]
        },
        {
          "id": "en_vocab",
          "name": "词汇",
          "type": "practice",
          "desc": "核心词汇辨析与拼写。",
          "passages": [
            {
              "id": "en_vocab_p1",
              "title": "词汇积累",
              "grade": "初中",
              "text": "",
              "questions": [
                {
                  "id": "en_vocab_p1_q1",
                  "type": "single",
                  "stem": "The opposite of 'happy' is ____.",
                  "options": [
                    "sad",
                    "big",
                    "cold",
                    "fast"
                  ],
                  "answer": 0,
                  "explanation": "happy 的反义词是 sad。",
                  "difficulty": "易",
                  "tags": [
                    "反义词"
                  ]
                },
                {
                  "id": "en_vocab_p1_q2",
                  "type": "single",
                  "stem": "A place where you borrow books is a ____.",
                  "options": [
                    "library",
                    "kitchen",
                    "garden",
                    "station"
                  ],
                  "answer": 0,
                  "explanation": "借书的地方是 library（图书馆）。",
                  "difficulty": "易",
                  "tags": [
                    "名词"
                  ]
                },
                {
                  "id": "en_vocab_p1_q3",
                  "type": "single",
                  "stem": "Choose the correct spelling:",
                  "options": [
                    "receipt",
                    "reciept",
                    "receit",
                    "reciet"
                  ],
                  "answer": 0,
                  "explanation": "正确拼写为 receipt。",
                  "difficulty": "中",
                  "tags": [
                    "拼写"
                  ]
                }
              ],
              "semester": "上学期"
            }
          ]
        },
        {
          "id": "en_grammar",
          "name": "语法",
          "type": "practice",
          "desc": "时态、主谓一致等基础语法。",
          "passages": [
            {
              "id": "en_grammar_p1",
              "title": "语法训练",
              "grade": "初中",
              "text": "",
              "questions": [
                {
                  "id": "en_grammar_p1_q1",
                  "type": "single",
                  "stem": "She ___ to school every day.",
                  "options": [
                    "goes",
                    "go",
                    "going",
                    "went"
                  ],
                  "answer": 0,
                  "explanation": "主语第三人称单数，一般现在时用 goes。",
                  "difficulty": "易",
                  "tags": [
                    "时态"
                  ]
                },
                {
                  "id": "en_grammar_p1_q2",
                  "type": "single",
                  "stem": "There ___ some milk in the glass.",
                  "options": [
                    "is",
                    "are",
                    "be",
                    "am"
                  ],
                  "answer": 0,
                  "explanation": "milk 不可数，用 is。",
                  "difficulty": "易",
                  "tags": [
                    "主谓一致"
                  ]
                }
              ],
              "semester": "下学期"
            }
          ]
        }
      ]
    }
  ],
  "semesters": [
    "上学期",
    "下学期"
  ]
};
/* ----------------------- 状态 ----------------------- */
let BANK = null;
let GRADES = [];
let SEMESTERS = [];
let currentGrade = '全部';
let currentSemester = '全部';
let currentSubjectFilter = '全部';
let currentBoard = { sid: null, bid: null };
const quiz = { subjectId: null, boardId: null, mode: 'passage', items: [], index: 0, answers: {} };

/* ----------------------- 工具 ----------------------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const uid = p => p + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

function loadBank() { try { return JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) {} return null; }
function saveBank() { localStorage.setItem(STORE_KEY, JSON.stringify(BANK)); }
function getProgress() { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; } catch (e) { return {}; } }
function getWrong() { try { return JSON.parse(localStorage.getItem(WRONG_KEY)) || []; } catch (e) { return []; } }
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function answerLabel(i) { return String.fromCharCode(65 + i); }
function getSubject(id) { return BANK.subjects.find(s => s.id === id); }
function getBoard(sid, bid) { const s = getSubject(sid); return s && s.boards.find(b => b.id === bid); }
function norm(s) { return String(s == null ? '' : s).trim().toLowerCase().replace(/\s+/g, ''); }
function typeName(t) { return { single: '单选', multiple: '多选', fill: '填空', essay: '解答', reading: '阅读', listening: '听力', practice: '练习' }[t] || t; }

/* ----------------------- 图标体系 ----------------------- */
const ICONS = {
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5.5C10 4.3 7 3.9 4.5 4.2v14.3c2.5.3 5.5-.1 7.5-1.3 2 1.2 5 1.6 7.5 1.3V4.2C17 3.9 14 4.3 12 5.5z"/><path d="M12 5.5v13.8"/></svg>',
  wrong: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1.1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1.1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5.5v13l11-6.5z"/></svg>',
  replay: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1"/><path d="M3.5 4.5v4.5h4.5"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9a2 2 0 0 0-3-3L5 17v3z"/><path d="M14.5 6.5l3 3"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6.5 7l1 13a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2l1-13"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>',
  dot: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="12" r="4"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 6l-6 6 6 6"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v10m0 0l-4-4m4 4l4-4M5 19h14"/></svg>'
};
function icon(name) { return ICONS[name] || ''; }
function mountIcons() { document.querySelectorAll('[data-icon]').forEach(el => { const n = el.getAttribute('data-icon'); if (ICONS[n]) el.innerHTML = ICONS[n]; }); }
function closeDrawer() { const sb = document.querySelector('.sidebar'); if (sb) sb.classList.remove('open'); const sc = document.getElementById('scrim'); if (sc) sc.classList.remove('show'); }

function isCorrect(q, sel) {
  if (q.type === 'essay') return null;
  if (q.type === 'multiple') {
    if (!Array.isArray(sel) || !Array.isArray(q.answer)) return false;
    if (sel.length !== q.answer.length) return false;
    const a = [...sel].sort(), b = [...q.answer].sort();
    return a.every((v, i) => v === b[i]);
  }
  if (q.type === 'fill') {
    const ans = Array.isArray(q.answer) ? q.answer : [q.answer];
    return ans.map(norm).includes(norm(sel));
  }
  return sel === q.answer;
}
function formatAnswer(q, val) {
  if (val === undefined || val === null || (Array.isArray(val) && val.length === 0)) return '';
  if (q.type === 'multiple') return (Array.isArray(val) ? val : [val]).map(i => answerLabel(i) + '. ' + q.options[i]).join('； ');
  if (q.type === 'single') return answerLabel(val) + '. ' + q.options[val];
  return String(val);
}
function diffTag(d) {
  const c = d === '易' ? 'var(--accent)' : d === '难' ? 'var(--orange)' : '#b0894a';
  return d ? `<span class="q-meta" style="color:${c}">［${d}］</span>` : '';
}
function passageMatch(p) {
  if (currentSemester !== '全部' && (p.semester || '') !== currentSemester) return false;
  return currentGrade === '全部' || !p.grade || p.grade === currentGrade;
}
function filteredPassages(board) { return board.passages.filter(passageMatch); }

/* ----------------------- 视图 ----------------------- */
function showView(name) {
  $$('.view').forEach(v => v.classList.remove('active'));
  $('#view-' + name).classList.add('active');
  $$('.side-item').forEach(b => b.classList.toggle('active', b.dataset.view === name));
  window.scrollTo(0, 0);
}

/* 筛选胶囊 */
function renderFilters() {
  const sp = $('#semester-pills'); sp.innerHTML = '';
  ['全部', ...SEMESTERS].forEach(g => {
    const b = document.createElement('button');
    b.className = 'pill' + (g === currentSemester ? ' active' : '');
    b.textContent = g;
    b.onclick = () => { currentSemester = g; renderHome(); };
    sp.appendChild(b);
  });
  const gp = $('#grade-pills'); gp.innerHTML = '';
  ['全部', ...GRADES].forEach(g => {
    const b = document.createElement('button');
    b.className = 'pill' + (g === currentGrade ? ' active' : '');
    b.textContent = g;
    b.onclick = () => { currentGrade = g; renderHome(); };
    gp.appendChild(b);
  });
  const sc = $('#subject-chips'); sc.innerHTML = '';
  const all = document.createElement('button');
  all.className = 'pill' + (currentSubjectFilter === '全部' ? ' active' : '');
  all.textContent = '全部科目';
  all.onclick = () => { currentSubjectFilter = '全部'; renderHome(); };
  sc.appendChild(all);
  BANK.subjects.forEach(s => {
    const b = document.createElement('button');
    b.className = 'pill' + (s.id === currentSubjectFilter ? ' active' : '');
    b.textContent = s.name;
    b.onclick = () => { currentSubjectFilter = s.id === currentSubjectFilter ? '全部' : s.id; renderHome(); };
    sc.appendChild(b);
  });
  const add = document.createElement('button');
  add.className = 'pill add'; add.textContent = '＋ 科目';
  add.onclick = () => openSubjectForm(null, renderHome);
  sc.appendChild(add);
}

/* 首页 */
function renderHome() {
  renderFilters();
  let subjCount = 0, boardCount = 0, qCount = 0;
  const wrong = getWrong().length;
  BANK.subjects.forEach(s => {
    if (currentSubjectFilter !== '全部' && s.id !== currentSubjectFilter) return;
    subjCount++;
    s.boards.forEach(b => {
      const fps = filteredPassages(b);
      if (!fps.length) return;
      boardCount++; qCount += fps.reduce((n, p) => n + p.questions.length, 0);
    });
  });
  $('#stat-subjects').textContent = subjCount;
  $('#stat-boards').textContent = boardCount;
  $('#stat-questions').textContent = qCount;
  $('#stat-wrong').textContent = wrong;

  const grid = $('#board-grid');
  grid.innerHTML = '';
  let any = false;
  BANK.subjects.forEach(s => {
    if (currentSubjectFilter !== '全部' && s.id !== currentSubjectFilter) return;
    s.boards.forEach(b => {
      const fps = filteredPassages(b);
      if (!fps.length) return;
      any = true;
      const qTotal = fps.reduce((n, p) => n + p.questions.length, 0);
      const prog = getProgress()[b.id];
      const done = prog ? prog.done : 0;
      const mastery = done ? Math.round(prog.correct / done * 100) : 0;
      const card = document.createElement('div');
      card.className = 'lib-card';
      card.style.borderLeft = '4px solid ' + (s.color || '#5B8A72');
      card.innerHTML = `
        <div class="lc-top"><span class="lc-subject">${escapeHtml(s.name)}</span></div>
        <div class="lc-name">${escapeHtml(b.name)}</div>
        <div class="lc-count">共 ${qTotal} 题</div>
        <div class="lc-bar"><div class="lc-bar-fill" style="width:${mastery}%"></div></div>
        <div class="lc-meta">掌握 ${mastery}% · 已练 ${done} 题</div>`;
      card.onclick = () => openBoard(s.id, b.id);
      grid.appendChild(card);
    });
  });
  if (!any) grid.innerHTML = '<div class="empty">当前筛选下暂无板块，换一个年级或科目试试。</div>';
  renderDashboard();
}

/* 仪表盘：继续学习 / 待巩固 / 薄弱点 */
function boardMeta(bid) {
  for (const s of (BANK.subjects || [])) for (const b of (s.boards || [])) if (b.id === bid) return { s, b };
  return null;
}
function renderDashboard() {
  const prog = getProgress();
  let best = null;
  for (const id in prog) { const p = prog[id]; if (p && p.ts && (!best || p.ts > best.p.ts)) best = { id, p }; }
  const cc = document.getElementById('continue-card');
  if (best) {
    const m = boardMeta(best.id);
    if (m) {
      const mastery = best.p.done ? Math.round(best.p.correct / best.p.done * 100) : 0;
      cc.innerHTML = '<div class="dash-title">继续学习</div>'
        + '<div class="dash-name">' + escapeHtml(m.s.name) + ' · ' + escapeHtml(m.b.name) + '</div>'
        + '<div class="dash-meta">已练习 ' + best.p.done + ' 题 · 掌握 ' + mastery + '%</div>'
        + '<div class="lc-bar"><div class="lc-bar-fill" style="width:' + mastery + '%"></div></div>'
        + '<div class="bd-actions" style="margin-top:14px;"><button class="btn primary sm" id="btn-continue">继续练习</button></div>';
      const bc = document.getElementById('btn-continue'); if (bc) bc.onclick = () => startPractice(m.s.id, m.b.id);
    } else { cc.innerHTML = emptyContinue(); }
  } else { cc.innerHTML = emptyContinue(); }
  const gl = document.getElementById('btn-go-lib'); if (gl) gl.onclick = () => showView('home');

  const wrong = getWrong();
  const rc = document.getElementById('review-card');
  if (wrong.length) {
    const r = wrong[0];
    rc.innerHTML = '<div class="dash-title">待巩固 · 间隔复习</div>'
      + '<div class="score-num" style="font-size:30px;">' + wrong.length + '</div>'
      + '<div class="dash-meta" style="margin-bottom:6px;">道错题待复习</div>'
      + '<div class="dash-meta">' + escapeHtml(r.subjectName) + ' · ' + escapeHtml(r.boardName) + '</div>'
      + '<div class="bd-actions" style="margin-top:12px;"><button class="btn ghost sm" id="btn-go-wrong">去错题本</button></div>';
    const gw = document.getElementById('btn-go-wrong'); if (gw) gw.onclick = () => { showView('wrong'); renderWrong(); };
  } else {
    rc.innerHTML = '<div class="dash-title">待巩固 · 间隔复习</div><div class="dash-meta">还没有错题，保持住！</div>';
  }

  const tagCount = {};
  wrong.forEach(r => (r.q.tags || []).forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; }));
  const top = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const wc = document.getElementById('weak-card');
  wc.innerHTML = '<div class="dash-title">薄弱点诊断</div>'
    + (top.length ? '<div class="chip-wrap">' + top.map(([t, c]) => '<span class="weak-chip">' + escapeHtml(t) + ' <b>' + c + '</b></span>').join('') + '</div>'
      : '<div class="dash-meta">练习后自动统计易错知识点。</div>');
}
function emptyContinue() {
  return '<div class="dash-title">继续学习</div><div class="dash-meta">还没有练习记录，挑一个板块开始吧。</div>'
    + '<div class="bd-actions" style="margin-top:12px;"><button class="btn primary sm" id="btn-go-lib">去词库</button></div>';
}

/* 板块详情 */
function openBoard(sid, bid) {
  const s = getSubject(sid), b = getBoard(sid, bid);
  if (!s || !b) return;
  currentBoard = { sid, bid };
  const fps = filteredPassages(b);
  const qTotal = fps.reduce((n, p) => n + p.questions.length, 0);
  const prog = getProgress()[b.id];
  const done = prog ? prog.done : 0;
  const mastery = done ? Math.round(prog.correct / done * 100) : 0;
  $('#board-detail').innerHTML = `
    <div class="bd-title">${escapeHtml(b.name)}</div>
    <div class="bd-crumbs">${escapeHtml(s.name)} · ${typeName(b.type)}</div>
    <div class="bd-desc">${escapeHtml(b.desc || '点击开始练习，或管理题目。')}</div>
    <div class="bd-prog">共 ${qTotal} 题 · 已练 ${done} 题 · 掌握 ${mastery}%</div>
    <div class="bd-actions">
      <button class="btn primary" data-act="practice">开始练习</button>
      <button class="btn ghost" data-act="manage">管理题目</button>
      <button class="btn ghost" data-act="edit">编辑板块</button>
      <button class="btn ghost" data-act="del">删除板块</button>
    </div>`;
  $('#board-detail').querySelector('[data-act=practice]').onclick = () => startPractice(sid, bid);
  $('#board-detail').querySelector('[data-act=manage]').onclick = () => openManageBoard(sid, bid);
  $('#board-detail').querySelector('[data-act=edit]').onclick = () => openBoardForm(sid, b);
  $('#board-detail').querySelector('[data-act=del]').onclick = () => deleteBoard(sid, bid);
  showView('board');
}

/* ----------------------- 练习 ----------------------- */
function startPractice(sid, bid) {
  const board = getBoard(sid, bid);
  const fps = filteredPassages(board);
  if (!fps.length) { alert('当前年级下该板块暂无题目，换个年级试试。'); return; }
  quiz.subjectId = sid; quiz.boardId = bid; quiz.index = 0; quiz.answers = {};
  if (quiz.mode === 'question') {
    quiz.items = [];
    fps.forEach(p => p.questions.forEach(q => quiz.items.push({ title: p.title, text: p.text, mode: board.type === 'listening' ? 'listen' : 'read', questions: [q] })));
  } else {
    quiz.items = fps.map(p => ({ title: p.title, text: p.text, mode: board.type === 'listening' ? 'listen' : 'read', questions: p.questions }));
  }
  quiz.items.forEach(it => it.questions.forEach(q => { quiz.answers[q.id] = q.type === 'multiple' ? [] : (q.type === 'fill' || q.type === 'essay' ? '' : null); }));
  showView('practice'); renderPracticeItem();
}
function renderPracticeItem() {
  stopSpeech();
  const board = getBoard(quiz.subjectId, quiz.boardId);
  const subject = getSubject(quiz.subjectId);
  const it = quiz.items[quiz.index];
  const total = quiz.items.length;
  $('#practice-crumb').textContent = `${subject.name} / ${board.name} / ${currentGrade === '全部' ? '全部年级' : currentGrade}`;
  $('#practice-progress-text').textContent = `第 ${quiz.index + 1} / ${total} 组`;
  $('#practice-bar').style.width = ((quiz.index + 1) / total * 100) + '%';
  $('#btn-prev').disabled = quiz.index === 0;
  $('#btn-next').textContent = quiz.index === total - 1 ? '提交答卷' : '下一组';
  const box = $('#practice-box');
  let html = `<div class="passage-title">${escapeHtml(it.title)}</div>`;
  if (it.mode === 'listen') {
    html += `<div class="listen-bar">
        <button class="btn primary sm" id="btn-play">${icon('play')} 播放听力</button>
        <button class="btn ghost sm" id="btn-replay">${icon('replay')} 重播</button>
        <label class="transcript-toggle"><input type="checkbox" id="transcript-chk"> 显示原文</label>
      </div>
      <div class="passage-text" id="transcript" style="display:none;">${escapeHtml(it.text)}</div>`;
  } else if (it.text) {
    html += `<div class="passage-text">${escapeHtml(it.text)}</div>`;
  }
  it.questions.forEach((q, qi) => { html += renderQuestionInput(q, qi); });
  box.innerHTML = html;
  $$('.opt input', box).forEach(input => input.addEventListener('change', () => {
    const q = it.questions.find(x => x.id === input.name);
    if (q.type === 'multiple') quiz.answers[q.id] = $$(`input[name="${q.id}"]:checked`, box).map(i => +i.value);
    else quiz.answers[q.id] = +input.value;
    $$('.opt', input.closest('.question')).forEach(l => l.classList.remove('selected'));
    if (q.type === 'multiple') $$(`input[name="${q.id}"]:checked`, box).forEach(i => i.closest('.opt').classList.add('selected'));
    else input.closest('.opt').classList.add('selected');
  }));
  $$('.fill-input', box).forEach(inp => inp.addEventListener('input', () => { quiz.answers[inp.dataset.qid] = inp.value; }));
  $$('.essay-input', box).forEach(inp => inp.addEventListener('input', () => { quiz.answers[inp.dataset.qid] = inp.value; }));
  if (it.mode === 'listen') {
    const play = () => speak(it.text, 'en-US');
    $('#btn-play').onclick = play; $('#btn-replay').onclick = play;
    $('#transcript-chk').onchange = e => { $('#transcript').style.display = e.target.checked ? 'block' : 'none'; };
  }
}
function renderQuestionInput(q, qi) {
  let body = '';
  if (q.type === 'single' || q.type === 'multiple') {
    const t = q.type === 'multiple' ? 'checkbox' : 'radio';
    body = q.options.map((opt, oi) => {
      const sel = q.type === 'multiple' ? (quiz.answers[q.id] || []).includes(oi) : quiz.answers[q.id] === oi;
      return `<label class="opt ${sel ? 'selected' : ''}"><input type="${t}" name="${q.id}" value="${oi}" ${sel ? 'checked' : ''}><span>${answerLabel(oi)}. ${escapeHtml(opt)}</span></label>`;
    }).join('');
  } else if (q.type === 'fill') {
    body = `<input class="fill-input" data-qid="${q.id}" value="${escapeHtml(quiz.answers[q.id] || '')}" placeholder="请输入答案">`;
  } else {
    body = `<textarea class="essay-input" data-qid="${q.id}" placeholder="写下你的解答…">${escapeHtml(quiz.answers[q.id] || '')}</textarea>`;
  }
  return `<div class="question" data-qid="${q.id}">
    <div class="q-stem"><span class="q-no">${qi + 1}.</span>${escapeHtml(q.stem)}${diffTag(q.difficulty)}</div>${body}</div>`;
}
function nextItem() { if (quiz.index < quiz.items.length - 1) { quiz.index++; renderPracticeItem(); } else submitPractice(); }
function submitPractice() {
  stopSpeech();
  const subject = getSubject(quiz.subjectId), board = getBoard(quiz.subjectId, quiz.boardId);
  let total = 0, correct = 0, done = 0;
  const items = [];
  quiz.items.forEach(it => it.questions.forEach(q => {
    const sel = quiz.answers[q.id];
    const ok = isCorrect(q, sel);
    if (ok === null) { items.push({ it, q, sel, ok: null }); return; }
    total++; done++; if (ok) correct++; else saveWrong(subject, board, it, q);
    items.push({ it, q, sel, ok });
  }));
  const prog = getProgress();
  const prev = prog[board.id] || { done: 0, correct: 0 };
  prog[board.id] = { done: prev.done + done, correct: prev.correct + correct, ts: Date.now() };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(prog));

  const pct = done ? Math.round(correct / done * 100) : 0;
  $('#result-summary').innerHTML = `<div class="score-num">${correct} / ${done}</div>
    <div class="score-detail">${subject.name} · ${board.name} · 正确率 ${pct}%${total < items.length ? '（含 ' + (items.length - total) + ' 道解答题需自查）' : ''}</div>`;
  const list = $('#result-list');
  list.innerHTML = ''; list.style.display = 'none';
  items.forEach((it, i) => {
    const div = document.createElement('div');
    div.className = 'card result-item';
    const ansText = formatAnswer(it.q, it.sel) || (it.q.type === 'fill' || it.q.type === 'essay' ? (it.sel || '（未作答）') : '（未作答）');
    const tag = it.ok === null ? '<span class="tag self">自查</span>' : it.ok ? '<span class="tag ok">✓ 答对</span>' : '<span class="tag no">✗ 答错</span>';
    div.innerHTML = `${tag}
      <div class="q-stem"><span class="q-no">${i + 1}.</span>${escapeHtml(it.q.stem)} <span class="q-meta">（${escapeHtml(it.it.title)}）</span></div>
      <div class="user-ans">你的答案：${ansText}</div>
      ${it.ok === false ? `<div class="user-ans">正确答案：${formatAnswer(it.q, it.q.answer)}</div>` : ''}
      ${it.ok === null ? `<div class="user-ans">参考答案：${escapeHtml(Array.isArray(it.q.answer) ? it.q.answer.join(' / ') : it.q.answer)}</div>` : ''}
      <div class="explanation">解析：${escapeHtml(it.q.explanation || '（暂无解析）')}</div>`;
    list.appendChild(div);
  });
  $('#btn-result-review').textContent = '查看解析';
  showView('result');
}

/* ----------------------- 错题本 ----------------------- */
function saveWrong(subject, board, passage, q) {
  const arr = getWrong();
  const rec = { key: q.id, subjectName: subject.name, boardName: board.name, passageTitle: passage.title, q };
  const idx = arr.findIndex(r => r.key === q.id);
  if (idx >= 0) arr[idx] = rec; else arr.push(rec);
  localStorage.setItem(WRONG_KEY, JSON.stringify(arr));
}
function renderWrong() {
  const arr = getWrong();
  const box = $('#wrong-list');
  if (!arr.length) {
    box.innerHTML = '<div class="empty">还没有错题。练习中答错的题目会自动归集到这里，并按科目 → 板块分组展示，方便你集中攻克薄弱点。'
      + '<div class="bd-actions" style="margin-top:14px;"><button class="btn primary sm" id="btn-empty-go">去做几道题</button></div></div>';
    const ge = document.getElementById('btn-empty-go');
    if (ge) ge.onclick = () => { renderHome(); showView('home'); };
    return;
  }
  // 按「科目 → 板块」分组，与全站结构一致
  const bySubject = {};
  const subjectOrder = [];
  arr.forEach(r => {
    const s = r.subjectName || '未分类';
    const b = r.boardName || '未分类';
    if (!bySubject[s]) { bySubject[s] = {}; subjectOrder.push(s); }
    if (!bySubject[s][b]) bySubject[s][b] = [];
    bySubject[s][b].push(r);
  });
  const totalBoards = subjectOrder.reduce((n, s) => n + Object.keys(bySubject[s]).length, 0);

  let html = '<div class="wrong-summary">'
    + '<span class="ws-pill">' + icon('wrong') + ' 共 <b>' + arr.length + '</b> 道错题</span>'
    + '<span class="ws-pill">' + icon('book') + ' 覆盖 <b>' + subjectOrder.length + '</b> 个科目</span>'
    + '<span class="ws-pill">' + icon('grid') + ' 涉及 <b>' + totalBoards + '</b> 个板块</span>'
    + '</div>';

  subjectOrder.forEach(s => {
    const boards = bySubject[s];
    const sCount = Object.values(boards).reduce((n, a) => n + a.length, 0);
    html += '<div class="wrong-group">';
    html += '<div class="wg-head">' + icon('book') + '<span class="wg-name">' + escapeHtml(s) + '</span><span class="wg-count">' + sCount + ' 道</span></div>';
    Object.keys(boards).forEach(b => {
      const items = boards[b];
      html += '<div class="wg-sub">' + escapeHtml(b) + ' <span class="wg-count">' + items.length + ' 道</span></div>';
      items.forEach((r, i) => {
        html += '<div class="card result-item" data-key="' + escapeHtml(r.key) + '">'
          + '<span class="tag no">✗ 答错</span>'
          + (r.passageTitle ? '<div class="user-ans">' + escapeHtml(r.passageTitle) + '</div>' : '')
          + '<div class="q-stem"><span class="q-no">' + (i + 1) + '.</span>' + escapeHtml(r.q.stem) + '</div>'
          + '<div class="user-ans">正确答案：' + formatAnswer(r.q, r.q.answer) + '</div>'
          + '<div class="explanation">解析：' + escapeHtml(r.q.explanation || '（暂无解析）') + '</div>'
          + '<div class="bd-actions" style="margin-top:10px;">'
          + '<button class="btn ghost sm" data-act="rep">重练此题</button>'
          + '<button class="btn ghost sm" data-act="rm">移除</button>'
          + '</div></div>';
      });
    });
    html += '</div>';
  });

  box.innerHTML = html;
  box.querySelectorAll('.result-item').forEach(div => {
    const key = div.dataset.key;
    div.querySelector('[data-act=rep]').onclick = () => { const r = getWrong().find(x => x.key === key); if (r) repracticeOne(r); };
    div.querySelector('[data-act=rm]').onclick = () => { const a = getWrong().filter(x => x.key !== key); localStorage.setItem(WRONG_KEY, JSON.stringify(a)); renderWrong(); renderHome(); };
  });
}
/* 预览用：?demo=1 时塞入示例错题，方便查看分组排版（看完可用「清空错题本」还原） */
function seedWrongDemo() {
  if (getWrong().length) return;
  const demo = [
    { key: 'demo_yw_1', subjectName: '语文', boardName: '阅读', passageTitle: '记叙文阅读',
      q: { id: 'demo_yw_1', type: 'single', stem: '下列加点词语在文中的含义，理解最恰当的一项是？', answer: 'B', options: ['A 表面意思', 'B 语境中的深层含义', 'C 作者本意', 'D 字面反义'], explanation: '结合上下文，词语在语境中产生深层含义，需联系全文主旨判断。', tags: ['词语理解', '主旨'] } },
    { key: 'demo_yw_2', subjectName: '语文', boardName: '阅读', passageTitle: '记叙文阅读',
      q: { id: 'demo_yw_2', type: 'single', stem: '关于本文写作手法，说法正确的一项是？', answer: 'C', options: ['A 对比', 'B 夸张', 'C 借景抒情', 'D 欲扬先抑'], explanation: '全文以景物描写烘托情感，属借景抒情。', tags: ['写作手法', '主旨'] } },
    { key: 'demo_math_1', subjectName: '数学', boardName: '易错专项', passageTitle: '易错专项 · 折扣问题',
      q: { id: 'demo_math_1', type: 'fill', stem: '某商品原价 200 元，打七五折后的售价是 ____ 元。', answer: '150', explanation: '200 × 0.75 = 150（元）。', tags: ['百分数', '折扣'] } }
  ];
  localStorage.setItem(WRONG_KEY, JSON.stringify(demo));
}
function repracticeOne(r) {
  quiz.subjectId = null; quiz.boardId = null; quiz.index = 0; quiz.mode = 'question';
  quiz.items = [{ title: r.passageTitle, text: '', mode: 'read', questions: [r.q] }];
  quiz.answers = {}; quiz.answers[r.q.id] = r.q.type === 'multiple' ? [] : (r.q.type === 'fill' || r.q.type === 'essay' ? '' : null);
  showView('practice'); renderPracticeItem();
}

/* ----------------------- 弹窗与表单 ----------------------- */
function openModal(title, bodyHtml, onMount) {
  $('#modal-title').textContent = title;
  $('#modal-body').innerHTML = bodyHtml;
  $('#modal').style.display = 'flex';
  if (onMount) onMount($('#modal-body'));
}
function closeModal() { $('#modal').style.display = 'none'; }

function openSubjectManage() {
  let html = `<button class="btn primary sm" id="sm-add" style="margin-bottom:14px;">${icon('plus')} 新增科目</button>`;
  if (!BANK.subjects.length) html += '<div class="empty">暂无科目。</div>';
  BANK.subjects.forEach(s => {
    const bCount = s.boards.length;
    html += `<div class="subject-row"><span class="sr-name">${s.icon || '📘'} ${escapeHtml(s.name)} <span class="q-meta">（${bCount} 板块）</span></span>
      <span><button class="icon-btn" data-edit="${s.id}">${icon('edit')}</button> <button class="icon-btn danger" data-del="${s.id}">${icon('trash')}</button></span></div>`;
  });
  openModal('科目管理', html, () => {
    $('#sm-add').onclick = () => openSubjectForm(null, openSubjectManage);
    $$('[data-edit]', $('#modal-body')).forEach(b => b.onclick = () => openSubjectForm(BANK.subjects.find(s => s.id === b.dataset.edit), openSubjectManage));
    $$('[data-del]', $('#modal-body')).forEach(b => b.onclick = () => deleteSubject(BANK.subjects.find(s => s.id === b.dataset.del), openSubjectManage));
  });
}
function openSubjectForm(subject, onDone) {
  const isEdit = !!subject;
  const s = subject || { name: '', icon: '📘', color: '#5B8A72' };
  openModal(isEdit ? '编辑科目' : '新增科目', `
    <div class="field"><label>科目名称</label><input type="text" id="f-name" value="${escapeHtml(s.name)}" placeholder="如 物理"></div>
    <div class="field-row">
      <div class="field"><label>图标（emoji）</label><input type="text" id="f-icon" value="${escapeHtml(s.icon)}" maxlength="4"></div>
      <div class="field"><label>主题色</label><input type="color" id="f-color" value="${s.color}"></div>
    </div>
    <div class="modal-actions"><button class="btn ghost" id="f-cancel">取消</button><button class="btn primary" id="f-save">保存</button></div>
  `, () => {
    $('#f-cancel').onclick = closeModal;
    $('#f-save').onclick = () => {
      const name = $('#f-name').value.trim();
      if (!name) { alert('请填写科目名称'); return; }
      if (isEdit) { s.name = name; s.icon = $('#f-icon').value || '📘'; s.color = $('#f-color').value; }
      else BANK.subjects.push({ id: uid('sub'), name, icon: $('#f-icon').value || '📘', color: $('#f-color').value, boards: [] });
      saveBank(); closeModal(); (onDone || renderHome)();
    };
  });
}
function deleteSubject(s, onDone) {
  if (!confirm(`确定删除科目「${s.name}」及其下所有板块与题目？`)) return;
  BANK.subjects = BANK.subjects.filter(x => x.id !== s.id);
  saveBank(); (onDone || renderHome)();
}
function openBoardForm(sid, board) {
  const isEdit = !!board;
  const b = board || { name: '', type: 'practice', desc: '' };
  openModal(isEdit ? '编辑板块' : '新增板块', `
    <div class="field"><label>板块名称</label><input type="text" id="f-name" value="${escapeHtml(b.name)}" placeholder="如 阅读理解"></div>
    <div class="field"><label>板块类型</label><select id="f-type">
      <option value="reading" ${b.type === 'reading' ? 'selected' : ''}>阅读（展示语料）</option>
      <option value="listening" ${b.type === 'listening' ? 'selected' : ''}>听力（语音朗读）</option>
      <option value="practice" ${b.type === 'practice' ? 'selected' : ''}>练习（题目为主）</option>
    </select></div>
    <div class="field"><label>简介</label><textarea id="f-desc">${escapeHtml(b.desc || '')}</textarea></div>
    <div class="modal-actions"><button class="btn ghost" id="f-cancel">取消</button><button class="btn primary" id="f-save">保存</button></div>
  `, () => {
    $('#f-cancel').onclick = closeModal;
    $('#f-save').onclick = () => {
      const name = $('#f-name').value.trim();
      if (!name) { alert('请填写板块名称'); return; }
      if (isEdit) { b.name = name; b.type = $('#f-type').value; b.desc = $('#f-desc').value; }
      else { const s = getSubject(sid); s.boards.push({ id: uid('bd'), name, type: $('#f-type').value, desc: $('#f-desc').value, passages: [] }); }
      saveBank(); closeModal(); openBoard(sid, isEdit ? b.id : (getSubject(sid).boards[getSubject(sid).boards.length - 1].id));
    };
  });
}
function deleteBoard(sid, bid) {
  if (!confirm('确定删除该板块及其下所有题目？')) return;
  const s = getSubject(sid);
  s.boards = s.boards.filter(b => b.id !== bid);
  saveBank(); renderHome(); showView('home');
}

/* 管理板块：语料与题目 */
function openManageBoard(sid, bid) {
  const s = getSubject(sid); const board = getBoard(sid, bid);
  let html = `<p class="hint">板块「${escapeHtml(board.name)}」· 语料（每篇语料可含多篇题目，年级用于筛选）</p>
    <button class="btn primary sm" id="mg-add-passage">＋ 新增语料</button><div style="height:14px"></div>`;
  if (!board.passages.length) html += '<div class="empty">暂无语料，点上方按钮添加。</div>';
  board.passages.forEach(p => {
    html += `<div class="card" style="margin-bottom:12px;padding:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
        <strong>${escapeHtml(p.title)}</strong><span class="tag self">${escapeHtml(p.grade || '通用')}</span>
      </div>
      <div style="margin:8px 0;"><button class="btn ghost sm" data-pedit="${p.id}">编辑语料</button> <button class="btn ghost sm" data-pdel="${p.id}">删除语料</button> <button class="btn ghost sm" data-qadd="${p.id}">${icon('plus')} 新增题目</button></div>
      ${p.questions.map((q, i) => `<div style="display:flex;justify-content:space-between;gap:8px;padding:4px 0;border-top:1px dashed var(--line);">
        <span style="font-size:14px;">${i + 1}. ${escapeHtml(q.stem.slice(0, 38))}${q.stem.length > 38 ? '…' : ''} <span class="q-meta">[${typeName(q.type)}]</span></span>
        <span><button class="icon-btn" data-qedit="${q.id}">${icon('edit')}</button> <button class="icon-btn danger" data-qdel="${q.id}">${icon('trash')}</button></span></div>`).join('')}
    </div>`;
  });
  openModal('管理题目 · ' + board.name, html, () => {
    $('#mg-add-passage').onclick = () => openPassageForm(sid, bid, null);
    $$('[data-pedit]', $('#modal-body')).forEach(btn => btn.onclick = () => openPassageForm(sid, bid, board.passages.find(p => p.id === btn.dataset.pedit)));
    $$('[data-pdel]', $('#modal-body')).forEach(btn => btn.onclick = () => { if (confirm('删除该语料及其题目？')) { board.passages = board.passages.filter(p => p.id !== btn.dataset.pdel); saveBank(); openManageBoard(sid, bid); } });
    $$('[data-qadd]', $('#modal-body')).forEach(btn => btn.onclick = () => openQuestionForm(sid, bid, btn.dataset.qadd, null));
    $$('[data-qedit]', $('#modal-body')).forEach(btn => btn.onclick = () => {
      let found = null, pfound = null;
      board.passages.forEach(p => p.questions.forEach(q => { if (q.id === btn.dataset.qedit) { found = q; pfound = p; } }));
      openQuestionForm(sid, bid, pfound.id, found);
    });
    $$('[data-qdel]', $('#modal-body')).forEach(btn => btn.onclick = () => { board.passages.forEach(p => { p.questions = p.questions.filter(q => q.id !== btn.dataset.qdel); }); saveBank(); openManageBoard(sid, bid); });
  });
}
function openPassageForm(sid, bid, passage) {
  const isEdit = !!passage;
  const p = passage || { title: '', grade: GRADES[0] || '', text: '', questions: [] };
  openModal(isEdit ? '编辑语料' : '新增语料', `
    <div class="field"><label>语料标题</label><input type="text" id="f-title" value="${escapeHtml(p.title)}" placeholder="如 阅读训练一"></div>
    <div class="field"><label>年级（用于筛选）</label><select id="f-grade"><option value="">通用</option>${GRADES.map(g => `<option ${p.grade === g ? 'selected' : ''}>${g}</option>`).join('')}</select></div>
    <div class="field"><label>语料正文（阅读/听力材料，可空）</label><textarea id="f-text">${escapeHtml(p.text)}</textarea></div>
    <div class="modal-actions"><button class="btn ghost" id="f-cancel">取消</button><button class="btn primary" id="f-save">保存</button></div>
  `, () => {
    $('#f-cancel').onclick = () => openManageBoard(sid, bid);
    $('#f-save').onclick = () => {
      const title = $('#f-title').value.trim();
      if (!title) { alert('请填写语料标题'); return; }
      if (isEdit) { p.title = title; p.grade = $('#f-grade').value; p.text = $('#f-text').value; }
      else { const board = getBoard(sid, bid); board.passages.push({ id: uid('ps'), title, grade: $('#f-grade').value, text: $('#f-text').value, questions: [] }); }
      saveBank(); openManageBoard(sid, bid);
    };
  });
}
function openQuestionForm(sid, bid, passageId, question) {
  const isEdit = !!question;
  const q = question || { type: 'single', stem: '', options: ['', ''], answer: 0, explanation: '', difficulty: '易', tags: [], passageId };
  if (isEdit) q.passageId = passageId;
  const board = getBoard(sid, bid);
  const passageOpts = board.passages.map(p => `<option value="${p.id}" ${p.id === (question ? findPassageOf(board, question.id) : passageId) ? 'selected' : ''}>${escapeHtml(p.title)}</option>`).join('');
  openModal(isEdit ? '编辑题目' : '新增题目', `
    <div class="field-row">
      <div class="field"><label>所属语料</label><select id="f-passage">${passageOpts}</select></div>
      <div class="field"><label>题型</label><select id="f-type">
        <option value="single" ${q.type === 'single' ? 'selected' : ''}>单选</option>
        <option value="multiple" ${q.type === 'multiple' ? 'selected' : ''}>多选</option>
        <option value="fill" ${q.type === 'fill' ? 'selected' : ''}>填空</option>
        <option value="essay" ${q.type === 'essay' ? 'selected' : ''}>解答</option>
      </select></div>
    </div>
    <div class="field"><label>题干</label><textarea id="f-stem">${escapeHtml(q.stem)}</textarea></div>
    <div class="field" id="f-options-field"><label>选项（单选/多选）</label><div id="f-options">${renderOptionEditors(q)}</div>
      <button class="btn ghost sm" id="f-add-opt">${icon('plus')} 添加选项</button></div>
    <div class="field" id="f-answer-field"></div>
    <div class="field"><label>解析</label><textarea id="f-exp">${escapeHtml(q.explanation || '')}</textarea></div>
    <div class="field-row">
      <div class="field"><label>难度</label><select id="f-diff"><option>易</option><option>中</option><option>难</option></select></div>
      <div class="field"><label>标签（逗号分隔）</label><input type="text" id="f-tags" value="${escapeHtml((q.tags || []).join(','))}"></div>
    </div>
    <div class="modal-actions"><button class="btn ghost" id="f-cancel">取消</button><button class="btn primary" id="f-save">保存</button></div>
  `, (body) => {
    $('#f-cancel').onclick = () => openManageBoard(sid, bid);
    const syncTypeUI = () => { const type = $('#f-type').value; $('#f-options-field').style.display = (type === 'single' || type === 'multiple') ? '' : 'none'; renderAnswerField(q, type, body); };
    $('#f-type').onchange = syncTypeUI;
    $('#f-add-opt').onclick = () => { q.options.push(''); $('#f-options').innerHTML = renderOptionEditors(q); bindOptEditors(q); syncTypeUI(); };
    bindOptEditors(q); syncTypeUI();
    $('#f-save').onclick = () => {
      const type = $('#f-type').value;
      const stem = $('#f-stem').value.trim();
      if (!stem) { alert('请填写题干'); return; }
      const pid = $('#f-passage').value;
      const diff = $('#f-diff').value;
      const tags = $('#f-tags').value.split(/[,，]/).map(t => t.trim()).filter(Boolean);
      const exp = $('#f-exp').value;
      let answer;
      if (type === 'single') answer = +$('#f-answer').value;
      else if (type === 'multiple') answer = $$('#f-answer input:checked', body).map(i => +i.value);
      else answer = $('#f-answer-text').value;
      if ((type === 'single' || type === 'multiple') && (!q.options.filter(o => o.trim()).length)) { alert('请至少填写一个选项'); return; }
      if (type === 'multiple' && (!Array.isArray(answer) || !answer.length)) { alert('多选请至少勾选一个正确答案'); return; }
      const cleanedOpts = q.options.map(o => o.trim()).filter(o => o);
      const newQ = { id: isEdit ? question.id : uid('q'), type, stem, options: cleanedOpts, answer, explanation: exp, difficulty: diff, tags };
      const target = getBoard(sid, bid).passages.find(p => p.id === pid);
      if (isEdit) {
        const op = findPassageOf(board, question.id);
        if (op && op.id !== pid) { op.questions = op.questions.filter(x => x.id !== question.id); target.questions.push(newQ); }
        else { Object.assign(op.questions.find(x => x.id === question.id), newQ); }
      } else target.questions.push(newQ);
      saveBank(); openManageBoard(sid, bid);
    };
  });
}
function findPassageOf(board, qid) { for (const p of board.passages) if (p.questions.some(q => q.id === qid)) return p; return null; }
function renderOptionEditors(q) {
  return q.options.map((o, i) => `<div class="opt-edit"><span style="width:22px;color:var(--muted)">${answerLabel(i)}</span>
    <input type="text" data-oi="${i}" value="${escapeHtml(o)}" placeholder="选项内容"><button class="icon-btn danger" data-del="${i}">${icon('close')}</button></div>`).join('');
}
function bindOptEditors(q) {
  $$('#f-options [data-oi]').forEach(inp => inp.oninput = () => { q.options[+inp.dataset.oi] = inp.value; });
  $$('#f-options [data-del]').forEach(btn => btn.onclick = () => { if (q.options.length <= 1) return; q.options.splice(+btn.dataset.del, 1); $('#f-options').innerHTML = renderOptionEditors(q); bindOptEditors(q); if ($('#f-type').value === 'single' || $('#f-type').value === 'multiple') renderAnswerField(q, $('#f-type').value, $('#modal-body')); });
}
function renderAnswerField(q, type, body) {
  const field = $('#f-answer-field');
  if (type === 'single') {
    field.innerHTML = `<label>正确答案</label><select id="f-answer">${q.options.map((o, i) => `<option value="${i}" ${(typeof q.answer === 'number' ? q.answer : 0) === i ? 'selected' : ''}>${answerLabel(i)}. ${escapeHtml(o)}</option>`).join('')}</select>`;
  } else if (type === 'multiple') {
    const ans = Array.isArray(q.answer) ? q.answer : [];
    field.innerHTML = `<label>正确答案（可多选）</label>${q.options.map((o, i) => `<label class="opt"><input type="checkbox" value="${i}" ${ans.includes(i) ? 'checked' : ''}> ${answerLabel(i)}. ${escapeHtml(o)}</label>`).join('')}`;
  } else {
    field.innerHTML = `<label>正确答案 / 参考答案</label><input type="text" id="f-answer-text" value="${escapeHtml(typeof q.answer === 'string' ? q.answer : '')}">`;
  }
}

/* ----------------------- 导入 / 导出 ----------------------- */
function exportJson() { const blob = new Blob([JSON.stringify(BANK, null, 2)], { type: 'application/json' }); download(blob, 'quizbank.json'); ioMsg('已导出完整题库 quizbank.json', true); }
function exportCsv() {
  const rows = [['subject', 'board', 'passage', 'grade', 'semester', 'type', 'stem', 'options', 'answer', 'explanation', 'difficulty', 'tags']];
  const csvField = v => { v = String(v == null ? '' : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
  BANK.subjects.forEach(s => s.boards.forEach(b => b.passages.forEach(p => p.questions.forEach(q => {
    let answer;
    if (q.type === 'single') answer = q.options[q.answer];
    else if (q.type === 'multiple') answer = q.answer.map(i => q.options[i]).join('|');
    else answer = q.answer;
    rows.push([s.name, b.name, p.title, p.grade || '', p.semester || '', q.type, q.stem, (q.options || []).join('|'), answer, q.explanation || '', q.difficulty || '', (q.tags || []).join('|')]);
  }))));
  const csv = rows.map(r => r.map(csvField).join(',')).join('\n');
  download(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }), 'quizbank.csv');
  ioMsg('已导出题目 quizbank.csv（可用 Excel 打开）', true);
}
function download(blob, name) { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url); }
function validateBank(obj) {
  if (!obj || !Array.isArray(obj.subjects)) return '缺少 subjects 数组';
  for (const s of obj.subjects) {
    if (!s.id || !s.name || !Array.isArray(s.boards)) return `科目“${s.name || s.id}”结构不完整`;
    for (const b of s.boards) {
      if (!b.id || !b.name || !Array.isArray(b.passages)) return `板块“${b.name || b.id}”结构不完整`;
      for (const p of b.passages) {
        if (!p.id || !p.title || !Array.isArray(p.questions)) return `语料“${p.title || p.id}”结构不完整`;
        for (const q of p.questions) {
          if (!q.id || !q.stem || !Array.isArray(q.options)) return `题目“${q.id}”结构不完整`;
          if (q.type === 'multiple' && !Array.isArray(q.answer)) return `多选题目“${q.id}”answer 必须为数组`;
        }
      }
    }
  }
  return null;
}
function importJsonFile(file) {
  const reader = new FileReader();
  reader.onload = () => { try {
    const obj = JSON.parse(reader.result); const err = validateBank(obj);
    if (err) { ioMsg('导入失败：' + err, false); return; }
    BANK = obj; GRADES = obj.grades || GRADES; SEMESTERS = obj.semesters || SEMESTERS; saveBank(); currentGrade = '全部'; currentSemester = '全部'; currentSubjectFilter = '全部'; renderHome(); ioMsg('JSON 导入成功，已替换题库！', true);
  } catch (e) { ioMsg('导入失败：JSON 解析错误', false); } };
  reader.readAsText(file);
}
function importCsvFile(file) {
  const reader = new FileReader();
  reader.onload = () => { try {
    const rows = parseCsv(reader.result); if (rows.length < 2) { ioMsg('CSV 无数据行', false); return; }
    const head = rows[0].map(h => h.trim()); const idx = k => head.indexOf(k);
    let added = 0;
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r]; if (!row.length || !row[idx('stem')]) continue;
      const sName = row[idx('subject')] || '未命名科目'; const bName = row[idx('board')] || '未命名板块';
      const pTitle = row[idx('passage')] || '默认语料'; const grade = row[idx('grade')] || '';
      const semester = row[idx('semester')] || '';
      const type = row[idx('type')] || 'single'; const stem = row[idx('stem')];
      const options = (row[idx('options')] || '').split('|').map(o => o.trim()).filter(o => o);
      const answerRaw = row[idx('answer')] || ''; let answer;
      if (type === 'single') answer = Math.max(0, options.findIndex(o => o === answerRaw));
      else if (type === 'multiple') answer = answerRaw.split('|').map(o => options.findIndex(x => x === o.trim())).filter(i => i >= 0);
      else answer = answerRaw;
      const q = { id: uid('q'), type, stem, options: (type === 'fill' || type === 'essay') ? [] : options, answer, explanation: row[idx('explanation')] || '', difficulty: row[idx('difficulty')] || '易', tags: (row[idx('tags')] || '').split('|').map(t => t.trim()).filter(Boolean) };
      let subj = BANK.subjects.find(s => s.name === sName);
      if (!subj) { subj = { id: uid('sub'), name: sName, icon: '📘', color: '#5B8A72', boards: [] }; BANK.subjects.push(subj); }
      let board = subj.boards.find(b => b.name === bName);
      if (!board) { board = { id: uid('bd'), name: bName, type: 'practice', desc: '', passages: [] }; subj.boards.push(board); }
      let ps = board.passages.find(p => p.title === pTitle && (p.grade || '') === grade && (p.semester || '') === semester);
      if (!ps) { ps = { id: uid('ps'), title: pTitle, grade, semester, text: '', questions: [] }; board.passages.push(ps); }
      ps.questions.push(q); added++;
    }
    saveBank(); renderHome(); ioMsg(`CSV 导入成功，新增 ${added} 道题！`, true);
  } catch (e) { ioMsg('导入失败：' + e.message, false); } };
  reader.readAsText(file);
}
function parseCsv(text) {
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else { if (c === '"') q = true; else if (c === ',') { row.push(cur); cur = ''; } else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; } else if (c === '\r') {} else cur += c; }
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
  return rows;
}
function resetBank() { localStorage.removeItem(STORE_KEY); BANK = JSON.parse(JSON.stringify(SAMPLE_BANK)); GRADES = BANK.grades; SEMESTERS = BANK.semesters || []; currentGrade = '全部'; currentSemester = '全部'; currentSubjectFilter = '全部'; renderHome(); ioMsg('已恢复示例题库。', true); }
function ioMsg(text, ok) { const el = $('#io-msg'); if (!el) return; el.textContent = text; el.className = 'io-msg ' + (ok ? 'ok' : 'err'); }
function ioModalHtml() {
  return `
    <div class="io-grid">
      <div class="card io-card">
        <h3>JSON 备份 / 恢复</h3>
        <p>导出完整题库（含科目、板块、题目）用于备份；导入同名 JSON 即整体替换。</p>
        <button id="m-export-json" class="btn primary">导出 JSON</button>
        <input type="file" id="m-file-json" accept=".json,application/json" />
        <button id="m-import-json" class="btn ghost">导入 JSON</button>
      </div>
      <div class="card io-card">
        <h3>CSV 批量题目</h3>
        <p>导出全部题目为 CSV（可用 Excel 打开）；导入 CSV 会按"科目/板块"名称匹配或自动新建，并追加题目。</p>
        <button id="m-export-csv" class="btn primary">导出 CSV</button>
        <input type="file" id="m-file-csv" accept=".csv,text/csv" />
        <button id="m-import-csv" class="btn ghost">导入 CSV</button>
      </div>
      <div class="card io-card">
        <h3>恢复示例</h3>
        <p>清空本地改动，恢复到内置示例题库（语文/数学/英语）。</p>
        <button id="m-reset" class="btn ghost">恢复示例题库</button>
      </div>
    </div>
    <div id="io-msg" class="io-msg"></div>
    <div class="csv-help">
      <strong>CSV 模板（首行表头）：</strong>
      <code>subject,board,passage,grade,semester,type,stem,options,answer,explanation,difficulty,tags</code>
      <br/>说明：type 取值 single/multiple/fill/essay；options 多个用 <code>|</code> 分隔；answer 单选填选项<em>文字</em>、多选用 <code>|</code> 分隔、填空/解答填答案文字；grade / semester 可空。
    </div>`;
}
function openIoModal() {
  openModal('导入 / 导出', ioModalHtml(), (body) => {
    body.querySelector('#m-export-json').onclick = exportJson;
    body.querySelector('#m-export-csv').onclick = exportCsv;
    body.querySelector('#m-import-json').onclick = () => { const f = body.querySelector('#m-file-json').files[0]; if (!f) { ioMsg('请先选择 JSON 文件', false); return; } importJsonFile(f); };
    body.querySelector('#m-import-csv').onclick = () => { const f = body.querySelector('#m-file-csv').files[0]; if (!f) { ioMsg('请先选择 CSV 文件', false); return; } importCsvFile(f); };
    body.querySelector('#m-reset').onclick = resetBank;
  });
}

/* ----------------------- TTS ----------------------- */
function speak(text, lang) {
  if (!('speechSynthesis' in window)) { alert('当前浏览器不支持语音朗读'); return; }
  stopSpeech();
  const clean = text.split('\n').filter(l => !/^listen to/i.test(l.trim())).join('. ');
  const utt = new SpeechSynthesisUtterance(clean);
  utt.lang = lang || 'en-US'; utt.rate = 0.95;
  window.speechSynthesis.speak(utt);
}
function stopSpeech() { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }

/* ----------------------- 事件绑定 ----------------------- */
function bindEvents() {
  $$('.side-item').forEach(b => b.onclick = () => { closeDrawer(); const v = b.dataset.view; if (v === 'io') { openIoModal(); return; } showView(v); if (v === 'wrong') renderWrong(); });
  const goIo = $('#btn-go-io'); if (goIo) goIo.onclick = () => openIoModal();
  $('#btn-board-back').onclick = () => { renderHome(); showView('home'); };
  $('#btn-subject-manage').onclick = openSubjectManage;
  $$('.child').forEach(c => c.onclick = () => { $$('.child').forEach(x => x.classList.remove('active')); c.classList.add('active'); });
  $('#btn-prev').onclick = () => { if (quiz.index > 0) { quiz.index--; renderPracticeItem(); } };
  $('#btn-next').onclick = nextItem;
  $('#btn-practice-exit').onclick = () => { stopSpeech(); renderHome(); showView('home'); };
  $$('#mode-toggle .mode-btn').forEach(b => b.onclick = () => {
    if (b.classList.contains('active')) return;
    $$('#mode-toggle .mode-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); quiz.mode = b.dataset.mode; startPractice(quiz.subjectId, quiz.boardId);
  });
  $('#btn-result-review').onclick = () => {
    const list = $('#result-list');
    if (list.style.display === 'none') { list.style.display = 'block'; $('#btn-result-review').textContent = '收起解析'; }
    else { list.style.display = 'none'; $('#btn-result-review').textContent = '查看解析'; }
  };
  $('#btn-result-home').onclick = () => { renderHome(); showView('home'); };
  $('#btn-clear-wrong').onclick = () => { if (confirm('确定清空错题本？')) { localStorage.removeItem(WRONG_KEY); renderWrong(); renderHome(); } };
  $('#modal-close').onclick = closeModal;
  $('#modal').onclick = e => { if (e.target.id === 'modal') closeModal(); };

  $$('#bottom-nav button').forEach(b => b.onclick = () => {
    const v = b.dataset.view;
    if (b.dataset.action === 'io') { closeDrawer(); openIoModal(); return; }
    if (v) { closeDrawer(); showView(v); if (v === 'wrong') renderWrong(); }
  });
  const burger = document.getElementById('hamburger');
  const scrim = document.getElementById('scrim');
  if (burger) burger.onclick = () => { document.querySelector('.sidebar').classList.add('open'); scrim.classList.add('show'); };
  if (scrim) scrim.onclick = () => closeDrawer();
  document.addEventListener('keydown', e => {
    if (!document.getElementById('view-practice').classList.contains('active')) return;
    const t = (e.target.tagName || '').toLowerCase();
    if (t === 'input' || t === 'textarea' || t === 'select') return;
    if (e.key === 'Enter') { e.preventDefault(); nextItem(); return; }
    if (/^[1-9]$/.test(e.key)) {
      let q = e.target.closest ? e.target.closest('.question') : null;
      if (!q) q = document.querySelector('.question');
      if (!q) return;
      const opts = Array.from(q.querySelectorAll('.opt'));
      const idx = +e.key - 1;
      if (idx < opts.length) { const inp = opts[idx].querySelector('input'); if (inp) { inp.checked = true; inp.dispatchEvent(new Event('change')); } }
    }
  });
}

/* ----------------------- 启动 ----------------------- */
async function init() {
  const stored = loadBank();
  if (stored) BANK = stored;
  else { try { const res = await fetch('data/questions.json'); if (res.ok) BANK = await res.json(); } catch (e) {} if (!BANK) BANK = JSON.parse(JSON.stringify(SAMPLE_BANK)); }
  GRADES = BANK.grades && BANK.grades.length ? BANK.grades : ['小学', '初中', '高中'];
  SEMESTERS = BANK.semesters && BANK.semesters.length ? BANK.semesters : ['上学期', '下学期'];
  if (new URLSearchParams(location.search).get('demo') === '1') seedWrongDemo();
  bindEvents(); mountIcons(); renderHome(); showView('home');
}
init();
