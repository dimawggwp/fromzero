// FromZero · данные продукта (направления, мини-проекты, справочники).
// Тексты двуязычные: { ru, en }. Не меняй id: на них завязано сохранённое состояние пользователей.

export const DIRECTIONS = [
  {
    "id": "marketing",
    "name": {
      "ru": "Маркетинг",
      "en": "Marketing"
    },
    "skills": [
      "SMM",
      "Контент-план",
      "Таргет",
      "Аналитика",
      "Copywriting"
    ],
    "alt": 2140
  },
  {
    "id": "dev",
    "name": {
      "ru": "Программирование",
      "en": "Coding"
    },
    "skills": [
      "JavaScript",
      "React",
      "Git",
      "Python",
      "SQL"
    ],
    "alt": 3020
  },
  {
    "id": "design",
    "name": {
      "ru": "Дизайн",
      "en": "Design"
    },
    "skills": [
      "Figma",
      "UI/UX",
      "Типографика",
      "Прототипирование",
      "Брендинг"
    ],
    "alt": 2610
  },
  {
    "id": "analytics",
    "name": {
      "ru": "Аналитика",
      "en": "Analytics"
    },
    "skills": [
      "Excel",
      "SQL",
      "Python",
      "Визуализация",
      "Статистика"
    ],
    "alt": 2890
  },
  {
    "id": "sales",
    "name": {
      "ru": "Продажи",
      "en": "Sales"
    },
    "skills": [
      "Переговоры",
      "CRM",
      "Холодные звонки",
      "Презентации",
      "Работа с возражениями"
    ],
    "alt": 1870
  },
  {
    "id": "content",
    "name": {
      "ru": "Контент",
      "en": "Content"
    },
    "skills": [
      "Copywriting",
      "Видеомонтаж",
      "Сторителлинг",
      "SEO",
      "Редактура"
    ],
    "alt": 2330
  }
];

export const SKILL_EN = {
  "Контент-план": "Content plan",
  "Таргет": "Paid social",
  "Аналитика": "Analytics",
  "Типографика": "Typography",
  "Прототипирование": "Prototyping",
  "Брендинг": "Branding",
  "Визуализация": "Data viz",
  "Статистика": "Statistics",
  "Переговоры": "Negotiation",
  "Холодные звонки": "Cold calling",
  "Презентации": "Presenting",
  "Работа с возражениями": "Objection handling",
  "Видеомонтаж": "Video editing",
  "Сторителлинг": "Storytelling",
  "Редактура": "Editing",
  "Английский B2": "English B2",
  "Казахский": "Kazakh",
  "Командная работа": "Teamwork",
  "Публичные выступления": "Public speaking"
};
export const skillLabel = (s, lang) => (lang === "en" && SKILL_EN[s]) || s;

export const COURSES = [
  {
    "id": "1",
    "name": {
      "ru": "1 курс",
      "en": "1st year"
    }
  },
  {
    "id": "2",
    "name": {
      "ru": "2 курс",
      "en": "2nd year"
    }
  },
  {
    "id": "3",
    "name": {
      "ru": "3 курс",
      "en": "3rd year"
    }
  },
  {
    "id": "4",
    "name": {
      "ru": "4 курс",
      "en": "4th year"
    }
  },
  {
    "id": "mag",
    "name": {
      "ru": "Магистратура",
      "en": "Master's"
    }
  },
  {
    "id": "college",
    "name": {
      "ru": "Колледж",
      "en": "College"
    }
  },
  {
    "id": "grad",
    "name": {
      "ru": "Уже выпустился",
      "en": "Graduated"
    }
  }
];

export const INTERESTS = [
  {
    "id": "startups",
    "name": {
      "ru": "Стартапы",
      "en": "Startups"
    }
  },
  {
    "id": "fintech",
    "name": {
      "ru": "Финтех",
      "en": "Fintech"
    }
  },
  {
    "id": "edu",
    "name": {
      "ru": "Образование",
      "en": "Education"
    }
  },
  {
    "id": "games",
    "name": {
      "ru": "Игры",
      "en": "Games"
    }
  },
  {
    "id": "fashion",
    "name": {
      "ru": "Мода",
      "en": "Fashion"
    }
  },
  {
    "id": "food",
    "name": {
      "ru": "Еда и кафе",
      "en": "Food & cafés"
    }
  },
  {
    "id": "sport",
    "name": {
      "ru": "Спорт",
      "en": "Sport"
    }
  },
  {
    "id": "social",
    "name": {
      "ru": "Соцпроекты",
      "en": "Social impact"
    }
  },
  {
    "id": "travel",
    "name": {
      "ru": "Путешествия",
      "en": "Travel"
    }
  },
  {
    "id": "media",
    "name": {
      "ru": "Медиа",
      "en": "Media"
    }
  }
];

export const EXTRA_SKILLS = [
  "Английский B2",
  "Казахский",
  "Командная работа",
  "Canva",
  "Notion",
  "Публичные выступления"
];
export const ALL_SKILLS = Array.from(new Set(DIRECTIONS.flatMap((x) => x.skills).concat(EXTRA_SKILLS)));

// Мини-проекты: id, дней, название, цель, инструменты, план по дням, критерий, пример, навыки, строчка в резюме.
export const PROJECTS = {
  "marketing": [
    {
      "id": "m1",
      "days": 3,
      "title": {
        "ru": "Аудит соцсетей местной кофейни",
        "en": "Social audit of a local café"
      },
      "goal": {
        "ru": "Найти 5 точек роста для реального бизнеса рядом с тобой.",
        "en": "Find 5 growth levers for a real business near you."
      },
      "tools": "Instagram, Google Sheets, Canva",
      "plan": [
        {
          "ru": "Выбери бизнес, собери метрики 3 конкурентов",
          "en": "Pick a business, collect metrics of 3 competitors"
        },
        {
          "ru": "Разбери 20 последних постов: что заходит, что нет",
          "en": "Break down the last 20 posts: what works, what doesn't"
        },
        {
          "ru": "Собери отчёт на 5 слайдов и отправь владельцу",
          "en": "Build a 5-slide report and send it to the owner"
        }
      ],
      "criteria": {
        "ru": "Есть отчёт с цифрами и 5 рекомендациями",
        "en": "A report with numbers and 5 recommendations"
      },
      "example": {
        "ru": "«вовлечённость 1,2%, у конкурентов 3,4%; Reels дают ×3 охвата»",
        "en": "“engagement 1.2% vs competitors 3.4%; Reels get 3× reach”"
      },
      "skills": [
        "SMM",
        "Аналитика"
      ],
      "resumeLine": {
        "ru": "Провёл аудит соцсетей кофейни: сравнил с 3 конкурентами и предложил 5 рекомендаций по росту вовлечённости",
        "en": "Audited a café's social media against 3 competitors and proposed 5 engagement-growth recommendations"
      }
    },
    {
      "id": "m2",
      "days": 7,
      "title": {
        "ru": "Контент-план на месяц",
        "en": "One-month content plan"
      },
      "goal": {
        "ru": "Сделать план, который можно сразу запускать.",
        "en": "Build a plan that can launch tomorrow."
      },
      "tools": "Notion, Canva, Groq / ChatGPT",
      "plan": [
        {
          "ru": "Портрет аудитории и 3 рубрики",
          "en": "Audience profile and 3 content pillars"
        },
        {
          "ru": "30 тем с форматами",
          "en": "30 topics with formats"
        },
        {
          "ru": "Шаблоны обложек в Canva",
          "en": "Cover templates in Canva"
        },
        {
          "ru": "5 готовых постов",
          "en": "5 finished posts"
        },
        {
          "ru": "Календарь публикаций",
          "en": "Publishing calendar"
        },
        {
          "ru": "Тестовая публикация и замер",
          "en": "Test post and measurement"
        },
        {
          "ru": "Итоги и выводы",
          "en": "Results and takeaways"
        }
      ],
      "criteria": {
        "ru": "30 тем, 5 готовых постов, календарь",
        "en": "30 topics, 5 ready posts, a calendar"
      },
      "example": {
        "ru": "Notion-доска с 30 карточками и 5 макетами",
        "en": "A Notion board with 30 cards and 5 mockups"
      },
      "skills": [
        "Контент-план",
        "SMM",
        "Copywriting"
      ],
      "resumeLine": {
        "ru": "Разработал контент-план на 30 дней с 3 рубриками и 5 готовыми постами для локального бренда",
        "en": "Built a 30-day content plan with 3 pillars and 5 ready posts for a local brand"
      }
    },
    {
      "id": "m3",
      "days": 14,
      "title": {
        "ru": "Мини-кампания с бюджетом 5 000 ₸",
        "en": "A ₸5,000 mini ad campaign"
      },
      "goal": {
        "ru": "Запустить настоящую рекламу и посчитать стоимость заявки.",
        "en": "Run a real ad and calculate cost per lead."
      },
      "tools": "Meta Ads / VK Ads, Google Sheets",
      "plan": [
        {
          "ru": "Цель и гипотеза",
          "en": "Goal and hypothesis"
        },
        {
          "ru": "Аудитории",
          "en": "Audiences"
        },
        {
          "ru": "3 креатива",
          "en": "3 creatives"
        },
        {
          "ru": "Запуск",
          "en": "Launch"
        },
        {
          "ru": "Мониторинг 1",
          "en": "Monitoring 1"
        },
        {
          "ru": "Мониторинг 2",
          "en": "Monitoring 2"
        },
        {
          "ru": "Отключить худший креатив",
          "en": "Pause the weakest creative"
        },
        {
          "ru": "Мониторинг 3",
          "en": "Monitoring 3"
        },
        {
          "ru": "Сбор цифр",
          "en": "Collect numbers"
        },
        {
          "ru": "Расчёт CPL",
          "en": "Calculate CPL"
        },
        {
          "ru": "Выводы",
          "en": "Takeaways"
        },
        {
          "ru": "Кейс на 1 страницу",
          "en": "One-page case study"
        },
        {
          "ru": "Ревью от знакомого маркетолога",
          "en": "Review from a marketer"
        },
        {
          "ru": "Публикация кейса",
          "en": "Publish the case"
        }
      ],
      "criteria": {
        "ru": "Кейс с CPL, CTR и выводами",
        "en": "A case with CPL, CTR and takeaways"
      },
      "example": {
        "ru": "CTR 2,1%, 14 заявок, CPL 357 ₸",
        "en": "CTR 2.1%, 14 leads, CPL ₸357"
      },
      "skills": [
        "Таргет",
        "Аналитика"
      ],
      "resumeLine": {
        "ru": "Запустил таргетированную кампанию с бюджетом 5 000 ₸: получил 14 заявок, CPL 357 ₸",
        "en": "Ran a ₸5,000 paid social campaign: 14 leads at ₸357 CPL"
      }
    }
  ],
  "dev": [
    {
      "id": "d1",
      "days": 3,
      "title": {
        "ru": "Личный сайт-визитка",
        "en": "Personal landing page"
      },
      "goal": {
        "ru": "Опубликовать свой первый сайт.",
        "en": "Ship your first website."
      },
      "tools": "HTML, CSS, GitHub Pages",
      "plan": [
        {
          "ru": "Макет на бумаге и разметка",
          "en": "Paper sketch and markup"
        },
        {
          "ru": "Стили и адаптив",
          "en": "Styles and responsive layout"
        },
        {
          "ru": "Публикация на GitHub Pages",
          "en": "Publish on GitHub Pages"
        }
      ],
      "criteria": {
        "ru": "Сайт открывается по ссылке и на телефоне",
        "en": "The site opens by link and on a phone"
      },
      "example": {
        "ru": "username.github.io с 3 секциями",
        "en": "username.github.io with 3 sections"
      },
      "skills": [
        "Git",
        "JavaScript"
      ],
      "resumeLine": {
        "ru": "Сверстал и опубликовал адаптивный сайт-портфолио на GitHub Pages",
        "en": "Built and published a responsive portfolio site on GitHub Pages"
      }
    },
    {
      "id": "d2",
      "days": 7,
      "title": {
        "ru": "Трекер расходов на React",
        "en": "Expense tracker in React"
      },
      "goal": {
        "ru": "Сделать SPA с хранением данных.",
        "en": "Build an SPA that keeps its data."
      },
      "tools": "React, Vite, localStorage",
      "plan": [
        {
          "ru": "Каркас проекта",
          "en": "Project scaffold"
        },
        {
          "ru": "Форма добавления",
          "en": "Add form"
        },
        {
          "ru": "Список и удаление",
          "en": "List and delete"
        },
        {
          "ru": "Категории",
          "en": "Categories"
        },
        {
          "ru": "График по категориям",
          "en": "Chart by category"
        },
        {
          "ru": "Сохранение в localStorage",
          "en": "Persist to localStorage"
        },
        {
          "ru": "README и деплой",
          "en": "README and deploy"
        }
      ],
      "criteria": {
        "ru": "Работает добавление, удаление, график, деплой",
        "en": "Add, delete, chart and deploy all work"
      },
      "example": {
        "ru": "Приложение на Vercel + репозиторий",
        "en": "App on Vercel + repository"
      },
      "skills": [
        "React",
        "JavaScript",
        "Git"
      ],
      "resumeLine": {
        "ru": "Разработал SPA-трекер расходов на React с графиками и локальным хранением, задеплоил на Vercel",
        "en": "Built a React expense-tracker SPA with charts and local storage, deployed on Vercel"
      }
    },
    {
      "id": "d3",
      "days": 14,
      "title": {
        "ru": "REST API сервиса расписания",
        "en": "Timetable REST API"
      },
      "goal": {
        "ru": "Бэкенд с базой данных и документацией.",
        "en": "A backend with a database and docs."
      },
      "tools": "Python, FastAPI, SQLite",
      "plan": [
        {
          "ru": "Модель данных",
          "en": "Data model"
        },
        {
          "ru": "CRUD групп",
          "en": "Groups CRUD"
        },
        {
          "ru": "CRUD пар",
          "en": "Classes CRUD"
        },
        {
          "ru": "Поиск по дню",
          "en": "Search by day"
        },
        {
          "ru": "Валидация",
          "en": "Validation"
        },
        {
          "ru": "Тесты 1",
          "en": "Tests 1"
        },
        {
          "ru": "Тесты 2",
          "en": "Tests 2"
        },
        {
          "ru": "Авторизация",
          "en": "Auth"
        },
        {
          "ru": "Документация OpenAPI",
          "en": "OpenAPI docs"
        },
        {
          "ru": "Docker",
          "en": "Docker"
        },
        {
          "ru": "Деплой",
          "en": "Deploy"
        },
        {
          "ru": "Нагрузочный тест",
          "en": "Load test"
        },
        {
          "ru": "Рефакторинг",
          "en": "Refactor"
        },
        {
          "ru": "Кейс в README",
          "en": "Case study in README"
        }
      ],
      "criteria": {
        "ru": "API с тестами, документацией и деплоем",
        "en": "API with tests, docs and deploy"
      },
      "example": {
        "ru": "12 эндпоинтов, покрытие тестами 80%",
        "en": "12 endpoints, 80% test coverage"
      },
      "skills": [
        "Python",
        "SQL",
        "Git"
      ],
      "resumeLine": {
        "ru": "Спроектировал REST API расписания на FastAPI: 12 эндпоинтов, покрытие тестами 80%",
        "en": "Designed a FastAPI timetable REST API: 12 endpoints, 80% test coverage"
      }
    }
  ],
  "design": [
    {
      "id": "g1",
      "days": 3,
      "title": {
        "ru": "Редизайн экрана приложения",
        "en": "Redesign one app screen"
      },
      "goal": {
        "ru": "Улучшить реальный экран и объяснить почему.",
        "en": "Improve a real screen and explain why."
      },
      "tools": "Figma",
      "plan": [
        {
          "ru": "Выбери экран, найди 5 проблем",
          "en": "Pick a screen, find 5 problems"
        },
        {
          "ru": "Сделай новую версию",
          "en": "Design the new version"
        },
        {
          "ru": "Оформи до/после с пояснениями",
          "en": "Present before/after with notes"
        }
      ],
      "criteria": {
        "ru": "До/после + 5 аргументов",
        "en": "Before/after + 5 arguments"
      },
      "example": {
        "ru": "Редизайн экрана оплаты банковского приложения",
        "en": "Redesign of a banking app payment screen"
      },
      "skills": [
        "Figma",
        "UI/UX"
      ],
      "resumeLine": {
        "ru": "Сделал редизайн экрана мобильного приложения: устранил 5 UX-проблем, оформил кейс до/после",
        "en": "Redesigned a mobile app screen, fixing 5 UX issues, with a before/after case"
      }
    },
    {
      "id": "g2",
      "days": 7,
      "title": {
        "ru": "Айдентика для студклуба",
        "en": "Identity for a student club"
      },
      "goal": {
        "ru": "Логотип, цвета, шрифты, носители.",
        "en": "Logo, colours, type, applications."
      },
      "tools": "Figma, Illustrator",
      "plan": [
        {
          "ru": "Бриф с клубом",
          "en": "Brief with the club"
        },
        {
          "ru": "Мудборд",
          "en": "Moodboard"
        },
        {
          "ru": "3 эскиза логотипа",
          "en": "3 logo sketches"
        },
        {
          "ru": "Финальный логотип",
          "en": "Final logo"
        },
        {
          "ru": "Палитра и шрифты",
          "en": "Palette and type"
        },
        {
          "ru": "Носители: афиша, сторис",
          "en": "Poster and stories"
        },
        {
          "ru": "Гайд на 4 страницы",
          "en": "4-page guide"
        }
      ],
      "criteria": {
        "ru": "Логотип + гайд + 2 носителя, одобрено клубом",
        "en": "Logo + guide + 2 applications, approved by the club"
      },
      "example": {
        "ru": "Гайд в PDF, клуб использует афиши",
        "en": "PDF guide, the club uses the posters"
      },
      "skills": [
        "Брендинг",
        "Типографика"
      ],
      "resumeLine": {
        "ru": "Разработал айдентику для студенческого клуба: логотип, гайд и шаблоны, которые клуб использует в соцсетях",
        "en": "Created a student club identity: logo, guide and templates the club uses on social"
      }
    },
    {
      "id": "g3",
      "days": 14,
      "title": {
        "ru": "Прототип приложения + тест с 5 людьми",
        "en": "App prototype + test with 5 people"
      },
      "goal": {
        "ru": "Пройти полный цикл UX.",
        "en": "Go through a full UX cycle."
      },
      "tools": "Figma, Maze",
      "plan": [
        {
          "ru": "Проблема",
          "en": "Problem"
        },
        {
          "ru": "5 интервью",
          "en": "5 interviews"
        },
        {
          "ru": "Инсайты",
          "en": "Insights"
        },
        {
          "ru": "User flow",
          "en": "User flow"
        },
        {
          "ru": "Вайрфреймы",
          "en": "Wireframes"
        },
        {
          "ru": "Прототип v1",
          "en": "Prototype v1"
        },
        {
          "ru": "Тест 1",
          "en": "Test 1"
        },
        {
          "ru": "Правки",
          "en": "Fixes"
        },
        {
          "ru": "UI-кит",
          "en": "UI kit"
        },
        {
          "ru": "Прототип v2",
          "en": "Prototype v2"
        },
        {
          "ru": "Тест 2",
          "en": "Test 2"
        },
        {
          "ru": "Метрики",
          "en": "Metrics"
        },
        {
          "ru": "Кейс",
          "en": "Case study"
        },
        {
          "ru": "Публикация на Behance",
          "en": "Publish on Behance"
        }
      ],
      "criteria": {
        "ru": "Кейс на Behance с результатами 2 тестов",
        "en": "Behance case with 2 test rounds"
      },
      "example": {
        "ru": "Успешность задачи выросла с 40% до 90%",
        "en": "Task success went from 40% to 90%"
      },
      "skills": [
        "Прототипирование",
        "UI/UX",
        "Figma"
      ],
      "resumeLine": {
        "ru": "Провёл UX-исследование и 2 раунда тестов прототипа: успешность ключевого сценария выросла с 40% до 90%",
        "en": "Ran UX research and 2 prototype test rounds: key-flow success rose from 40% to 90%"
      }
    }
  ],
  "analytics": [
    {
      "id": "a1",
      "days": 3,
      "title": {
        "ru": "Анализ цен на аренду в твоём городе",
        "en": "Rent prices in your city"
      },
      "goal": {
        "ru": "Ответить на вопрос цифрами.",
        "en": "Answer a question with numbers."
      },
      "tools": "Google Sheets",
      "plan": [
        {
          "ru": "Собери 50 объявлений вручную",
          "en": "Collect 50 listings by hand"
        },
        {
          "ru": "Посчитай медианы по районам",
          "en": "Compute medians by district"
        },
        {
          "ru": "Сделай 2 графика и вывод",
          "en": "Make 2 charts and a conclusion"
        }
      ],
      "criteria": {
        "ru": "Таблица + 2 графика + вывод",
        "en": "Table + 2 charts + conclusion"
      },
      "example": {
        "ru": "Медиана в Бостандыкском районе на 18% выше среднего",
        "en": "Bostandyk district median is 18% above average"
      },
      "skills": [
        "Excel",
        "Визуализация"
      ],
      "resumeLine": {
        "ru": "Проанализировал 50 объявлений об аренде: выявил разброс медианных цен по районам до 18%",
        "en": "Analysed 50 rental listings and found up to 18% median price spread across districts"
      }
    },
    {
      "id": "a2",
      "days": 7,
      "title": {
        "ru": "Дашборд по открытым данным",
        "en": "Open-data dashboard"
      },
      "goal": {
        "ru": "Сделать дашборд, понятный за 10 секунд.",
        "en": "Make a dashboard readable in 10 seconds."
      },
      "tools": "Looker Studio / DataLens, data.egov.kz",
      "plan": [
        {
          "ru": "Найди датасет",
          "en": "Find a dataset"
        },
        {
          "ru": "Очистка",
          "en": "Cleaning"
        },
        {
          "ru": "3 ключевых метрики",
          "en": "3 key metrics"
        },
        {
          "ru": "Графики",
          "en": "Charts"
        },
        {
          "ru": "Фильтры",
          "en": "Filters"
        },
        {
          "ru": "Текстовые выводы",
          "en": "Written insights"
        },
        {
          "ru": "Публикация",
          "en": "Publish"
        }
      ],
      "criteria": {
        "ru": "Публичная ссылка, 3 метрики, выводы",
        "en": "Public link, 3 metrics, insights"
      },
      "example": {
        "ru": "Дашборд рождаемости по областям РК",
        "en": "Birth-rate dashboard by region of Kazakhstan"
      },
      "skills": [
        "Визуализация",
        "Статистика"
      ],
      "resumeLine": {
        "ru": "Построил публичный дашборд по открытым данным РК с 3 ключевыми метриками и фильтрами по регионам",
        "en": "Built a public dashboard on Kazakhstan open data with 3 key metrics and regional filters"
      }
    },
    {
      "id": "a3",
      "days": 14,
      "title": {
        "ru": "SQL-анализ интернет-магазина",
        "en": "SQL analysis of an online store"
      },
      "goal": {
        "ru": "Освоить SQL на реальной задаче.",
        "en": "Learn SQL on a real problem."
      },
      "tools": "PostgreSQL, Kaggle, Python",
      "plan": [
        {
          "ru": "Загрузка данных",
          "en": "Load data"
        },
        {
          "ru": "Основы SELECT",
          "en": "SELECT basics"
        },
        {
          "ru": "JOIN",
          "en": "JOIN"
        },
        {
          "ru": "Агрегации",
          "en": "Aggregations"
        },
        {
          "ru": "Когорты",
          "en": "Cohorts"
        },
        {
          "ru": "Retention",
          "en": "Retention"
        },
        {
          "ru": "Средний чек",
          "en": "Average order"
        },
        {
          "ru": "RFM",
          "en": "RFM"
        },
        {
          "ru": "Визуализация",
          "en": "Visualisation"
        },
        {
          "ru": "Гипотезы",
          "en": "Hypotheses"
        },
        {
          "ru": "A/B расчёт",
          "en": "A/B maths"
        },
        {
          "ru": "Отчёт",
          "en": "Report"
        },
        {
          "ru": "Ревью",
          "en": "Review"
        },
        {
          "ru": "GitHub",
          "en": "GitHub"
        }
      ],
      "criteria": {
        "ru": "Репозиторий с SQL и отчётом",
        "en": "Repository with SQL and a report"
      },
      "example": {
        "ru": "Retention 2-го месяца 23%, RFM-сегменты",
        "en": "Month-2 retention 23%, RFM segments"
      },
      "skills": [
        "SQL",
        "Python",
        "Статистика"
      ],
      "resumeLine": {
        "ru": "Провёл SQL-анализ 100 тыс. заказов: построил когортный retention и RFM-сегментацию",
        "en": "Analysed 100k orders in SQL: built cohort retention and RFM segmentation"
      }
    }
  ],
  "sales": [
    {
      "id": "s1",
      "days": 3,
      "title": {
        "ru": "Скрипт продаж для реального продукта",
        "en": "Sales script for a real product"
      },
      "goal": {
        "ru": "Написать и проверить скрипт.",
        "en": "Write and test a script."
      },
      "tools": "Google Docs",
      "plan": [
        {
          "ru": "Выбери продукт и ЦА",
          "en": "Pick a product and audience"
        },
        {
          "ru": "Скрипт + 5 возражений",
          "en": "Script + 5 objections"
        },
        {
          "ru": "Отыграй с 3 друзьями",
          "en": "Role-play with 3 friends"
        }
      ],
      "criteria": {
        "ru": "Скрипт + запись разборов",
        "en": "Script + recorded debriefs"
      },
      "example": {
        "ru": "Скрипт на 1 страницу, 5 возражений",
        "en": "One-page script, 5 objections"
      },
      "skills": [
        "Холодные звонки",
        "Работа с возражениями"
      ],
      "resumeLine": {
        "ru": "Составил скрипт продаж с отработкой 5 типовых возражений и протестировал его в 3 ролевых звонках",
        "en": "Wrote a sales script handling 5 common objections and tested it in 3 role-play calls"
      }
    },
    {
      "id": "s2",
      "days": 7,
      "title": {
        "ru": "Продай 10 единиц чего угодно",
        "en": "Sell 10 of anything"
      },
      "goal": {
        "ru": "Получить настоящие продажи.",
        "en": "Make real sales."
      },
      "tools": "Instagram, WhatsApp Business",
      "plan": [
        {
          "ru": "Выбери товар",
          "en": "Pick a product"
        },
        {
          "ru": "Оффер",
          "en": "Offer"
        },
        {
          "ru": "Список 50 контактов",
          "en": "List of 50 contacts"
        },
        {
          "ru": "Касания 1",
          "en": "Outreach 1"
        },
        {
          "ru": "Касания 2",
          "en": "Outreach 2"
        },
        {
          "ru": "Дожим",
          "en": "Closing"
        },
        {
          "ru": "Итоги в цифрах",
          "en": "Results in numbers"
        }
      ],
      "criteria": {
        "ru": "10 продаж, воронка в таблице",
        "en": "10 sales, funnel in a sheet"
      },
      "example": {
        "ru": "50 касаний, 18 ответов, 10 продаж",
        "en": "50 touches, 18 replies, 10 sales"
      },
      "skills": [
        "Переговоры",
        "CRM"
      ],
      "resumeLine": {
        "ru": "Продал 10 единиц товара за неделю: 50 касаний, конверсия в продажу 20%",
        "en": "Sold 10 units in a week: 50 touches, 20% conversion to sale"
      }
    },
    {
      "id": "s3",
      "days": 14,
      "title": {
        "ru": "Партнёрство для студенческого события",
        "en": "Sponsor for a student event"
      },
      "goal": {
        "ru": "Привлечь спонсора.",
        "en": "Land a sponsor."
      },
      "tools": "Canva, email, LinkedIn",
      "plan": [
        {
          "ru": "Событие",
          "en": "Event"
        },
        {
          "ru": "Пакет спонсора",
          "en": "Sponsor pack"
        },
        {
          "ru": "Список 30 компаний",
          "en": "List of 30 companies"
        },
        {
          "ru": "Письма 1",
          "en": "Emails 1"
        },
        {
          "ru": "Письма 2",
          "en": "Emails 2"
        },
        {
          "ru": "Звонки",
          "en": "Calls"
        },
        {
          "ru": "Встречи",
          "en": "Meetings"
        },
        {
          "ru": "Переговоры",
          "en": "Negotiation"
        },
        {
          "ru": "Договорённость",
          "en": "Agreement"
        },
        {
          "ru": "Исполнение",
          "en": "Delivery"
        },
        {
          "ru": "Отчёт спонсору",
          "en": "Sponsor report"
        },
        {
          "ru": "Фото",
          "en": "Photos"
        },
        {
          "ru": "Кейс",
          "en": "Case study"
        },
        {
          "ru": "Отзыв",
          "en": "Testimonial"
        }
      ],
      "criteria": {
        "ru": "Минимум 1 спонсор и отчёт",
        "en": "At least 1 sponsor and a report"
      },
      "example": {
        "ru": "2 спонсора, 150 000 ₸ и призы",
        "en": "2 sponsors, ₸150,000 and prizes"
      },
      "skills": [
        "Переговоры",
        "Презентации"
      ],
      "resumeLine": {
        "ru": "Привлёк 2 спонсоров для студенческого мероприятия на 150 000 ₸ из 30 холодных обращений",
        "en": "Secured 2 sponsors (₸150,000) for a student event from 30 cold pitches"
      }
    }
  ],
  "content": [
    {
      "id": "c1",
      "days": 3,
      "title": {
        "ru": "3 поста для бренда, который любишь",
        "en": "3 posts for a brand you love"
      },
      "goal": {
        "ru": "Показать свой голос.",
        "en": "Show your voice."
      },
      "tools": "Google Docs, Canva",
      "plan": [
        {
          "ru": "Изучи тон бренда",
          "en": "Study the brand's tone"
        },
        {
          "ru": "Напиши 3 поста",
          "en": "Write 3 posts"
        },
        {
          "ru": "Оформи и опубликуй у себя",
          "en": "Design and publish on your page"
        }
      ],
      "criteria": {
        "ru": "3 поста в едином тоне",
        "en": "3 posts in one consistent tone"
      },
      "example": {
        "ru": "Серия постов для локального кафе",
        "en": "A post series for a local café"
      },
      "skills": [
        "Copywriting",
        "Сторителлинг"
      ],
      "resumeLine": {
        "ru": "Написал серию из 3 постов в тоне локального бренда, опубликовал в портфолио",
        "en": "Wrote a 3-post series in a local brand's voice and published it in my portfolio"
      }
    },
    {
      "id": "c2",
      "days": 7,
      "title": {
        "ru": "Reels-серия на 5 роликов",
        "en": "A 5-video Reels series"
      },
      "goal": {
        "ru": "Научиться короткому видео.",
        "en": "Learn short-form video."
      },
      "tools": "CapCut",
      "plan": [
        {
          "ru": "Тема серии",
          "en": "Series theme"
        },
        {
          "ru": "Сценарии",
          "en": "Scripts"
        },
        {
          "ru": "Съёмка 1-2",
          "en": "Shoot 1-2"
        },
        {
          "ru": "Съёмка 3-5",
          "en": "Shoot 3-5"
        },
        {
          "ru": "Монтаж",
          "en": "Edit"
        },
        {
          "ru": "Публикация",
          "en": "Publish"
        },
        {
          "ru": "Анализ просмотров",
          "en": "Analyse views"
        }
      ],
      "criteria": {
        "ru": "5 роликов, отчёт по охватам",
        "en": "5 videos, reach report"
      },
      "example": {
        "ru": "Суммарно 12 000 просмотров",
        "en": "12,000 views in total"
      },
      "skills": [
        "Видеомонтаж",
        "Сторителлинг"
      ],
      "resumeLine": {
        "ru": "Снял и смонтировал серию из 5 Reels: суммарно 12 000 просмотров",
        "en": "Shot and edited a 5-Reel series: 12,000 total views"
      }
    },
    {
      "id": "c3",
      "days": 14,
      "title": {
        "ru": "SEO-статья, которая вышла в топ",
        "en": "An SEO article that ranks"
      },
      "goal": {
        "ru": "Написать статью под поисковый запрос.",
        "en": "Write an article for a search query."
      },
      "tools": "Wordstat, Search Console, Tilda",
      "plan": [
        {
          "ru": "Запрос",
          "en": "Query"
        },
        {
          "ru": "Анализ топ-10",
          "en": "Top-10 analysis"
        },
        {
          "ru": "Структура",
          "en": "Outline"
        },
        {
          "ru": "Черновик 1",
          "en": "Draft 1"
        },
        {
          "ru": "Черновик 2",
          "en": "Draft 2"
        },
        {
          "ru": "Редактура",
          "en": "Edit"
        },
        {
          "ru": "Вёрстка",
          "en": "Layout"
        },
        {
          "ru": "Публикация",
          "en": "Publish"
        },
        {
          "ru": "Индексация",
          "en": "Indexing"
        },
        {
          "ru": "Ссылки",
          "en": "Links"
        },
        {
          "ru": "Наблюдение",
          "en": "Monitoring"
        },
        {
          "ru": "Правки",
          "en": "Revisions"
        },
        {
          "ru": "Итоги",
          "en": "Results"
        },
        {
          "ru": "Кейс",
          "en": "Case study"
        }
      ],
      "criteria": {
        "ru": "Статья опубликована, позиции отслежены",
        "en": "Article live, rankings tracked"
      },
      "example": {
        "ru": "Топ-10 Google по запросу за 2 недели",
        "en": "Google top-10 for the query in 2 weeks"
      },
      "skills": [
        "SEO",
        "Copywriting",
        "Редактура"
      ],
      "resumeLine": {
        "ru": "Написал SEO-статью, вышедшую в топ-10 Google по целевому запросу за 2 недели",
        "en": "Wrote an SEO article that reached Google's top 10 for its target query in 2 weeks"
      }
    }
  ]
};

export const ALL_PROJECTS = Object.entries(PROJECTS).flatMap(([dir, list]) => list.map((p) => ({ ...p, dir })));

export const TEMPLATES = [
  {
    "id": "classic",
    "name": {
      "ru": "Классика",
      "en": "Classic"
    }
  },
  {
    "id": "accent",
    "name": {
      "ru": "Сигнал",
      "en": "Signal"
    }
  },
  {
    "id": "mono",
    "name": {
      "ru": "Минимал",
      "en": "Minimal"
    }
  }
];

// id регионов hh: 40 Казахстан, 160 Алматы, 159 Астана, 205 Шымкент, 113 Россия, 1 Москва
export const AREAS = [
  {
    "id": "40",
    "name": {
      "ru": "Весь Казахстан",
      "en": "All Kazakhstan"
    }
  },
  {
    "id": "160",
    "name": {
      "ru": "Алматы",
      "en": "Almaty"
    }
  },
  {
    "id": "159",
    "name": {
      "ru": "Астана",
      "en": "Astana"
    }
  },
  {
    "id": "205",
    "name": {
      "ru": "Шымкент",
      "en": "Shymkent"
    }
  },
  {
    "id": "113",
    "name": {
      "ru": "Вся Россия",
      "en": "All Russia"
    }
  },
  {
    "id": "1",
    "name": {
      "ru": "Москва",
      "en": "Moscow"
    }
  }
];

export const SCHEDULES = [
  {
    "id": "remote",
    "name": {
      "ru": "Удалённо",
      "en": "Remote"
    }
  },
  {
    "id": "fullDay",
    "name": {
      "ru": "Полный день",
      "en": "Full day"
    }
  },
  {
    "id": "flexible",
    "name": {
      "ru": "Гибкий",
      "en": "Flexible"
    }
  },
  {
    "id": "shift",
    "name": {
      "ru": "Сменный",
      "en": "Shifts"
    }
  }
];

export const APP_STATUSES = [
  {
    "id": "sent",
    "name": {
      "ru": "Отправлено",
      "en": "Sent"
    },
    "color": "var(--bone)"
  },
  {
    "id": "viewed",
    "name": {
      "ru": "Просмотрено",
      "en": "Viewed"
    },
    "color": "var(--ash)"
  },
  {
    "id": "invite",
    "name": {
      "ru": "Приглашение",
      "en": "Invite"
    },
    "color": "var(--fire)"
  },
  {
    "id": "reject",
    "name": {
      "ru": "Отказ",
      "en": "Rejected"
    },
    "color": "var(--dim)"
  }
];

export const DAILY_LIMIT = 20;

// Сетлист: 5 треков от нуля до собеседования (поле alt оставлено для совместимости со старым состоянием)
export const CHECKPOINTS = [
  {
    "id": "resume",
    "alt": 800,
    "go": "builder",
    "name": {
      "ru": "Резюме 70+",
      "en": "Resume 70+"
    }
  },
  {
    "id": "proj",
    "alt": 1700,
    "go": "portfolio",
    "name": {
      "ru": "Проект в портфолио",
      "en": "Portfolio project"
    }
  },
  {
    "id": "apps",
    "alt": 2600,
    "go": "jobs",
    "name": {
      "ru": "10 откликов",
      "en": "10 applications"
    }
  },
  {
    "id": "train",
    "alt": 3300,
    "go": "interview",
    "name": {
      "ru": "Тренировка",
      "en": "Rehearsal"
    }
  },
  {
    "id": "invite",
    "alt": 4000,
    "go": "applications",
    "name": {
      "ru": "Первое собеседование",
      "en": "First interview"
    }
  }
];

export const ACHIEVEMENTS = [
  {
    "id": "first-resume",
    "glyph": "01",
    "title": {
      "ru": "Первое резюме",
      "en": "First resume"
    },
    "hint": {
      "ru": "Собери резюме в конструкторе",
      "en": "Build a resume"
    }
  },
  {
    "id": "score-70",
    "glyph": "70",
    "title": {
      "ru": "Сильное резюме",
      "en": "Strong resume"
    },
    "hint": {
      "ru": "Оценка резюме 70+",
      "en": "Resume score 70+"
    }
  },
  {
    "id": "first-step",
    "glyph": "↑",
    "title": {
      "ru": "Первый шаг",
      "en": "First step"
    },
    "hint": {
      "ru": "Закрой первый день мини-проекта",
      "en": "Close day one of a project"
    }
  },
  {
    "id": "project-done",
    "glyph": "✓",
    "title": {
      "ru": "Проект зачтён",
      "en": "Project cleared"
    },
    "hint": {
      "ru": "Заверши мини-проект",
      "en": "Finish a mini-project"
    }
  },
  {
    "id": "first-apply",
    "glyph": "→",
    "title": {
      "ru": "Первый отклик",
      "en": "First application"
    },
    "hint": {
      "ru": "Отправь отклик",
      "en": "Send an application"
    }
  },
  {
    "id": "ten-apply",
    "glyph": "10",
    "title": {
      "ru": "Десятка",
      "en": "Ten"
    },
    "hint": {
      "ru": "10 откликов",
      "en": "10 applications"
    }
  },
  {
    "id": "interview",
    "glyph": "?!",
    "title": {
      "ru": "Репетиция",
      "en": "Rehearsal"
    },
    "hint": {
      "ru": "Пройди тренажёр собеседования",
      "en": "Finish the interview trainer"
    }
  },
  {
    "id": "streak-3",
    "glyph": "3",
    "title": {
      "ru": "Три дня подряд",
      "en": "Three in a row"
    },
    "hint": {
      "ru": "Стрик 3 дня",
      "en": "3-day streak"
    }
  }
];

export const VERB_RU = {
  "делал": "Сделал",
  "помогал": "Помог",
  "вёл": "Вёл",
  "вел": "Вёл",
  "писал": "Написал",
  "занимался": "Организовал",
  "участвовал": "Внёс вклад"
};
export const VERB_EN = {
  "did": "Delivered",
  "helped": "Supported",
  "worked": "Drove",
  "was": "Led",
  "made": "Built",
  "participated": "Contributed"
};
