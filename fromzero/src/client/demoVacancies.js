// Резервные примеры вакансий: показываются, только если hh.ru недоступен. Помечены test: true.
export const DEMO_VACANCIES = [
  {
    "experience": {
      "id": "noExperience"
    },
    "test": true,
    "id": "test-1",
    "name": {
      "ru": "Стажёр SMM-специалист",
      "en": "SMM intern"
    },
    "area": {
      "id": "160",
      "name": {
        "ru": "Алматы",
        "en": "Almaty"
      }
    },
    "salary": {
      "from": 150000,
      "to": 200000,
      "currency": "KZT"
    },
    "schedule": {
      "id": "flexible"
    },
    "employment": {
      "id": "probation",
      "name": {
        "ru": "Стажировка",
        "en": "Internship"
      }
    },
    "employer": {
      "name": "Тестовая кофейня «Зерно»"
    },
    "dir": "marketing",
    "key_skills": [
      "SMM",
      "Контент-план",
      "Canva",
      "Copywriting",
      "Аналитика"
    ],
    "description": {
      "ru": "Ведение Instagram и TikTok сети из 4 кофеен. Съёмка, тексты, отчёты по охватам раз в неделю.",
      "en": "Run Instagram and TikTok for a chain of 4 cafés. Shooting, copy, weekly reach reports."
    },
    "requirements": [
      {
        "ru": "Насмотренность в соцсетях",
        "en": "A good eye for social"
      },
      {
        "ru": "Умение писать живые тексты",
        "en": "Lively writing"
      },
      {
        "ru": "Базовая аналитика охватов",
        "en": "Basic reach analytics"
      }
    ],
    "published": {
      "ru": "2 дня назад",
      "en": "2 days ago"
    },
    "url": "https://hh.kz"
  },
  {
    "experience": {
      "id": "noExperience"
    },
    "test": true,
    "id": "test-2",
    "name": {
      "ru": "Junior Frontend-разработчик (React)",
      "en": "Junior Frontend Developer (React)"
    },
    "area": {
      "id": "159",
      "name": {
        "ru": "Астана",
        "en": "Astana"
      }
    },
    "salary": {
      "from": 350000,
      "to": 500000,
      "currency": "KZT"
    },
    "schedule": {
      "id": "remote"
    },
    "employment": {
      "id": "full",
      "name": {
        "ru": "Полная занятость",
        "en": "Full-time"
      }
    },
    "employer": {
      "name": "Тест-студия «Кодекс»"
    },
    "dir": "dev",
    "key_skills": [
      "JavaScript",
      "React",
      "Git",
      "TypeScript",
      "CSS"
    ],
    "description": {
      "ru": "Разработка интерфейсов для клиентов студии. Код-ревью, ментор, задачи из бэклога.",
      "en": "Build interfaces for studio clients. Code review, a mentor, backlog tasks."
    },
    "requirements": [
      {
        "ru": "React на уровне pet-проектов",
        "en": "React at pet-project level"
      },
      {
        "ru": "Git",
        "en": "Git"
      },
      {
        "ru": "Желание учиться",
        "en": "Eagerness to learn"
      }
    ],
    "published": {
      "ru": "сегодня",
      "en": "today"
    },
    "url": "https://hh.kz"
  },
  {
    "experience": {
      "id": "noExperience"
    },
    "test": true,
    "id": "test-3",
    "name": {
      "ru": "Стажёр-аналитик данных",
      "en": "Data analyst intern"
    },
    "area": {
      "id": "160",
      "name": {
        "ru": "Алматы",
        "en": "Almaty"
      }
    },
    "salary": null,
    "schedule": {
      "id": "fullDay"
    },
    "employment": {
      "id": "probation",
      "name": {
        "ru": "Стажировка",
        "en": "Internship"
      }
    },
    "employer": {
      "name": "Тестовый банк «Сарыарка»"
    },
    "dir": "analytics",
    "key_skills": [
      "SQL",
      "Excel",
      "Python",
      "Визуализация",
      "Статистика"
    ],
    "description": {
      "ru": "Подготовка отчётов, A/B-тесты, дашборды для продуктовой команды.",
      "en": "Reports, A/B tests and dashboards for the product team."
    },
    "requirements": [
      {
        "ru": "SQL: JOIN, GROUP BY",
        "en": "SQL: JOIN, GROUP BY"
      },
      {
        "ru": "Excel/Google Таблицы",
        "en": "Excel/Google Sheets"
      },
      {
        "ru": "Аккуратность",
        "en": "Attention to detail"
      }
    ],
    "published": {
      "ru": "вчера",
      "en": "yesterday"
    },
    "url": "https://hh.kz"
  },
  {
    "experience": {
      "id": "noExperience"
    },
    "test": true,
    "id": "test-4",
    "name": {
      "ru": "Младший UI/UX-дизайнер",
      "en": "Junior UI/UX Designer"
    },
    "area": {
      "id": "159",
      "name": {
        "ru": "Астана",
        "en": "Astana"
      }
    },
    "salary": {
      "from": 250000,
      "to": null,
      "currency": "KZT"
    },
    "schedule": {
      "id": "remote"
    },
    "employment": {
      "id": "part",
      "name": {
        "ru": "Частичная занятость",
        "en": "Part-time"
      }
    },
    "employer": {
      "name": "Тест-агентство «Номад»"
    },
    "dir": "design",
    "key_skills": [
      "Figma",
      "UI/UX",
      "Прототипирование",
      "Типографика"
    ],
    "description": {
      "ru": "Макеты лендингов и мобильных экранов. Работа в паре с арт-директором.",
      "en": "Landing pages and mobile screens, paired with an art director."
    },
    "requirements": [
      {
        "ru": "Портфолио из 2+ кейсов",
        "en": "Portfolio with 2+ cases"
      },
      {
        "ru": "Figma: компоненты, автолейаут",
        "en": "Figma: components, auto layout"
      }
    ],
    "published": {
      "ru": "3 дня назад",
      "en": "3 days ago"
    },
    "url": "https://hh.kz"
  },
  {
    "experience": {
      "id": "noExperience"
    },
    "test": true,
    "id": "test-5",
    "name": {
      "ru": "Менеджер по продажам без опыта",
      "en": "Sales manager, no experience"
    },
    "area": {
      "id": "205",
      "name": {
        "ru": "Шымкент",
        "en": "Shymkent"
      }
    },
    "salary": {
      "from": 200000,
      "to": 400000,
      "currency": "KZT"
    },
    "schedule": {
      "id": "fullDay"
    },
    "employment": {
      "id": "full",
      "name": {
        "ru": "Полная занятость",
        "en": "Full-time"
      }
    },
    "employer": {
      "name": "Тестовый магазин «Ақ жол»"
    },
    "dir": "sales",
    "key_skills": [
      "Переговоры",
      "CRM",
      "Холодные звонки",
      "Работа с возражениями"
    ],
    "description": {
      "ru": "Входящие и исходящие звонки, ведение клиентов в CRM. Обучение за счёт компании.",
      "en": "Inbound and outbound calls, managing clients in a CRM. Paid training."
    },
    "requirements": [
      {
        "ru": "Грамотная речь",
        "en": "Clear speech"
      },
      {
        "ru": "Казахский и русский",
        "en": "Kazakh and Russian"
      },
      {
        "ru": "Энергия",
        "en": "Energy"
      }
    ],
    "published": {
      "ru": "сегодня",
      "en": "today"
    },
    "url": "https://hh.kz"
  },
  {
    "experience": {
      "id": "noExperience"
    },
    "test": true,
    "id": "test-6",
    "name": {
      "ru": "Контент-менеджер (стажировка)",
      "en": "Content manager (internship)"
    },
    "area": {
      "id": "160",
      "name": {
        "ru": "Алматы",
        "en": "Almaty"
      }
    },
    "salary": {
      "from": 120000,
      "to": 160000,
      "currency": "KZT"
    },
    "schedule": {
      "id": "remote"
    },
    "employment": {
      "id": "probation",
      "name": {
        "ru": "Стажировка",
        "en": "Internship"
      }
    },
    "employer": {
      "name": "Тест-медиа «Дала»"
    },
    "dir": "content",
    "key_skills": [
      "Copywriting",
      "Редактура",
      "SEO",
      "Видеомонтаж"
    ],
    "description": {
      "ru": "Тексты для сайта и соцсетей медиа, редактура новостей, работа с CMS.",
      "en": "Copy for a media site and socials, news editing, CMS work."
    },
    "requirements": [
      {
        "ru": "Грамотность",
        "en": "Literacy"
      },
      {
        "ru": "3 примера текстов",
        "en": "3 writing samples"
      },
      {
        "ru": "Базовое SEO",
        "en": "Basic SEO"
      }
    ],
    "published": {
      "ru": "5 дней назад",
      "en": "5 days ago"
    },
    "url": "https://hh.kz"
  },
  {
    "experience": {
      "id": "noExperience"
    },
    "test": true,
    "id": "test-7",
    "name": {
      "ru": "Python-стажёр в команду данных",
      "en": "Python intern, data team"
    },
    "area": {
      "id": "1",
      "name": {
        "ru": "Москва",
        "en": "Moscow"
      }
    },
    "salary": {
      "from": 60000,
      "to": 80000,
      "currency": "RUR"
    },
    "schedule": {
      "id": "remote"
    },
    "employment": {
      "id": "probation",
      "name": {
        "ru": "Стажировка",
        "en": "Internship"
      }
    },
    "employer": {
      "name": "Тест-лаб «Квант»"
    },
    "dir": "dev",
    "key_skills": [
      "Python",
      "SQL",
      "Git",
      "Pandas"
    ],
    "description": {
      "ru": "ETL-скрипты, автоматизация отчётов, помощь аналитикам.",
      "en": "ETL scripts, report automation, supporting analysts."
    },
    "requirements": [
      {
        "ru": "Python: функции, pandas",
        "en": "Python: functions, pandas"
      },
      {
        "ru": "SQL",
        "en": "SQL"
      },
      {
        "ru": "Git",
        "en": "Git"
      }
    ],
    "published": {
      "ru": "вчера",
      "en": "yesterday"
    },
    "url": "https://hh.ru"
  },
  {
    "experience": {
      "id": "noExperience"
    },
    "test": true,
    "id": "test-8",
    "name": {
      "ru": "Ассистент маркетолога",
      "en": "Marketing assistant"
    },
    "area": {
      "id": "159",
      "name": {
        "ru": "Астана",
        "en": "Astana"
      }
    },
    "salary": {
      "from": 180000,
      "to": 220000,
      "currency": "KZT"
    },
    "schedule": {
      "id": "fullDay"
    },
    "employment": {
      "id": "full",
      "name": {
        "ru": "Полная занятость",
        "en": "Full-time"
      }
    },
    "employer": {
      "name": "Тест-сеть фитнес-клубов «Тау»"
    },
    "dir": "marketing",
    "key_skills": [
      "Таргет",
      "Аналитика",
      "SMM",
      "Excel"
    ],
    "description": {
      "ru": "Запуск акций, помощь с таргетом, отчёты по заявкам.",
      "en": "Promo launches, paid social support, lead reports."
    },
    "requirements": [
      {
        "ru": "Понимание воронки",
        "en": "Understanding of funnels"
      },
      {
        "ru": "Excel",
        "en": "Excel"
      },
      {
        "ru": "Инициативность",
        "en": "Initiative"
      }
    ],
    "published": {
      "ru": "4 дня назад",
      "en": "4 days ago"
    },
    "url": "https://hh.kz"
  }
];
