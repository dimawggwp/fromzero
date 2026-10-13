// «Состав» на лендинге: пародийные первые резюме по открытым биографиям. Портреты сгенерированы ИИ.
import p0 from "./assets/p-0.webp";
import p1 from "./assets/p-1.webp";
import p2 from "./assets/p-2.webp";
import p3 from "./assets/p-3.webp";
import p4 from "./assets/p-4.webp";
import p5 from "./assets/p-5.webp";
import p6 from "./assets/p-6.webp";

const IMG = { "p-0": p0, "p-1": p1, "p-2": p2, "p-3": p3, "p-4": p4, "p-5": p5, "p-6": p6 };

const RAW = [
  {
    "id": "dracula",
    "img": "p-0",
    "start": {
      "ru": "1462 · замок",
      "en": "1462 · castle"
    },
    "template": "classic",
    "name": {
      "ru": "Граф Дракула",
      "en": "Count Dracula"
    },
    "first": {
      "ru": "Ночной администратор",
      "en": "Night-shift manager"
    },
    "resume": {
      "ru": {
        "city": "Трансильвания",
        "email": "count@castle.ro",
        "phone": "",
        "links": "bran-castle.ro",
        "summary": "Готов к ночным сменам без ограничений по сроку. Ответственно отношусь к гостям: каждый остаётся надолго.",
        "education": [
          {
            "school": "Школа Шоломанча",
            "degree": "Тёмные искусства",
            "years": "1450–1456"
          }
        ],
        "experience": [
          {
            "role": "Владелец и управляющий",
            "org": "Замок в Карпатах",
            "period": "1462 – н.в.",
            "bullets": [
              "Обеспечил круглосуточную работу объекта: 560+ лет без простоя",
              "Сократил дневные расходы на освещение до 0 ₸",
              "Лично встречал каждого гостя, удержание гостей 100%"
            ]
          }
        ],
        "projects": [
          {
            "title": "Переезд в Лондон (1897)",
            "bullets": [
              "Провёл сделку с недвижимостью через юриста-стажёра, сроки соблюдены"
            ]
          }
        ],
        "skills": [
          "Ночные смены",
          "Тайм-менеджмент",
          "Нетворкинг",
          "Румынский",
          "Переговоры"
        ],
        "name": "Граф Дракула",
        "title": "Ночной администратор объекта"
      },
      "en": {
        "city": "Transylvania",
        "email": "count@castle.ro",
        "phone": "",
        "links": "bran-castle.ro",
        "summary": "Available for night shifts with no end date. I care about guests: every one of them stays for a long time.",
        "education": [
          {
            "school": "The Scholomance",
            "degree": "Dark arts",
            "years": "1450–1456"
          }
        ],
        "experience": [
          {
            "role": "Owner and manager",
            "org": "Castle in the Carpathians",
            "period": "1462 – present",
            "bullets": [
              "Kept the site running 24/7: 560+ years with zero downtime",
              "Cut daytime lighting costs to zero",
              "Greeted every guest in person: 100% guest retention"
            ]
          }
        ],
        "projects": [
          {
            "title": "Relocation to London (1897)",
            "bullets": [
              "Closed a property deal via a junior solicitor, on schedule"
            ]
          }
        ],
        "skills": [
          "Night shifts",
          "Time management",
          "Networking",
          "Romanian",
          "Negotiation"
        ],
        "name": "Count Dracula",
        "title": "Night-shift facility manager"
      }
    }
  },
  {
    "id": "einstein",
    "img": "p-1",
    "start": {
      "ru": "1902 · Берн",
      "en": "1902 · Bern"
    },
    "template": "mono",
    "name": {
      "ru": "Альберт Эйнштейн",
      "en": "Albert Einstein"
    },
    "first": {
      "ru": "Эксперт патентного бюро",
      "en": "Patent office clerk"
    },
    "resume": {
      "ru": {
        "city": "Берн",
        "email": "a.einstein@patent.ch",
        "phone": "",
        "links": "",
        "summary": "Выпускник ETH Цюрих по физике. После диплома два года не мог найти работу преподавателем, поэтому пошёл туда, где брали.",
        "education": [
          {
            "school": "ETH Цюрих",
            "degree": "Учитель физики и математики",
            "years": "1896–1900"
          }
        ],
        "experience": [
          {
            "role": "Технический эксперт III класса",
            "org": "Патентное бюро, Берн",
            "period": "1902–1909",
            "bullets": [
              "Проверял патентные заявки на электротехнику, сотни заявок в год",
              "В свободное время написал 4 статьи 1905 года, изменившие физику"
            ]
          }
        ],
        "projects": [
          {
            "title": "Частные уроки физики",
            "bullets": [
              "Давал уроки по объявлению в газете: 3 франка за час"
            ]
          }
        ],
        "skills": [
          "Физика",
          "Мысленные эксперименты",
          "Немецкий",
          "Скрипка",
          "Аналитика"
        ],
        "name": "Альберт Эйнштейн",
        "title": "Технический эксперт III класса"
      },
      "en": {
        "city": "Bern",
        "email": "a.einstein@patent.ch",
        "phone": "",
        "links": "",
        "summary": "ETH Zurich physics graduate. Spent two years failing to land a teaching job, so I took the one that said yes.",
        "education": [
          {
            "school": "ETH Zurich",
            "degree": "Physics & maths teacher diploma",
            "years": "1896–1900"
          }
        ],
        "experience": [
          {
            "role": "Technical expert, 3rd class",
            "org": "Swiss Patent Office, Bern",
            "period": "1902–1909",
            "bullets": [
              "Reviewed electrical patent applications, hundreds a year",
              "In spare time wrote the four 1905 papers that changed physics"
            ]
          }
        ],
        "projects": [
          {
            "title": "Private physics lessons",
            "bullets": [
              "Taught via a newspaper ad: 3 francs an hour"
            ]
          }
        ],
        "skills": [
          "Physics",
          "Thought experiments",
          "German",
          "Violin",
          "Analytics"
        ],
        "name": "Albert Einstein",
        "title": "Technical expert, 3rd class"
      }
    }
  },
  {
    "id": "newton",
    "img": "p-2",
    "start": {
      "ru": "1661 · Кембридж",
      "en": "1661 · Cambridge"
    },
    "template": "classic",
    "name": {
      "ru": "Исаак Ньютон",
      "en": "Isaac Newton"
    },
    "first": {
      "ru": "Студент-работник",
      "en": "Work-study student"
    },
    "resume": {
      "ru": {
        "city": "Кембридж",
        "email": "i.newton@trinity.ac.uk",
        "phone": "",
        "links": "",
        "summary": "Совмещаю учёбу и работу при колледже. Умею работать удалённо: самый продуктивный год провёл дома.",
        "education": [
          {
            "school": "Тринити-колледж, Кембридж",
            "degree": "Бакалавр искусств",
            "years": "1661–1665"
          }
        ],
        "experience": [
          {
            "role": "Субсайзер",
            "org": "Тринити-колледж, Кембридж",
            "period": "1661–1665",
            "bullets": [
              "Оплачивал учёбу работой при колледже: поручения, обслуживание старших студентов"
            ]
          }
        ],
        "projects": [
          {
            "title": "Удалёнка в Вулсторпе, 1665–1666",
            "bullets": [
              "Чума закрыла университет: за 18 месяцев дома заложил основы анализа, оптики и тяготения",
              "Провёл опыт с призмой: белый свет раскладывается на 7 цветов"
            ]
          }
        ],
        "skills": [
          "Математика",
          "Оптика",
          "Удалённая работа",
          "Латынь",
          "Эксперименты"
        ],
        "name": "Исаак Ньютон",
        "title": "Студент-работник (субсайзер)"
      },
      "en": {
        "city": "Cambridge",
        "email": "i.newton@trinity.ac.uk",
        "phone": "",
        "links": "",
        "summary": "Balancing study and a college job. Proven remote worker: my most productive year was spent at home.",
        "education": [
          {
            "school": "Trinity College, Cambridge",
            "degree": "BA",
            "years": "1661–1665"
          }
        ],
        "experience": [
          {
            "role": "Subsizar",
            "org": "Trinity College, Cambridge",
            "period": "1661–1665",
            "bullets": [
              "Paid for tuition by working for the college: errands and serving senior students"
            ]
          }
        ],
        "projects": [
          {
            "title": "Remote year at Woolsthorpe, 1665–1666",
            "bullets": [
              "Plague shut the university: in 18 months at home laid the groundwork for calculus, optics and gravity",
              "Ran the prism experiment: white light splits into 7 colours"
            ]
          }
        ],
        "skills": [
          "Mathematics",
          "Optics",
          "Remote work",
          "Latin",
          "Experiments"
        ],
        "name": "Isaac Newton",
        "title": "Work-study student (subsizar)"
      }
    }
  },
  {
    "id": "tokayev",
    "img": "p-3",
    "start": {
      "ru": "1975 · МИД",
      "en": "1975 · Foreign service"
    },
    "template": "classic",
    "name": {
      "ru": "Касым-Жомарт Токаев",
      "en": "Kassym-Jomart Tokayev"
    },
    "first": {
      "ru": "Атташе посольства",
      "en": "Embassy attaché"
    },
    "resume": {
      "ru": {
        "city": "Алматы",
        "email": "",
        "phone": "",
        "links": "",
        "summary": "Выпускник МГИМО. Учу китайский и английский, готов к работе за рубежом и долгим командировкам.",
        "education": [
          {
            "school": "МГИМО",
            "degree": "Международные отношения",
            "years": "1970–1975"
          }
        ],
        "experience": [
          {
            "role": "Стажёр, затем атташе",
            "org": "Посольство СССР в Сингапуре",
            "period": "1972, 1975–1979",
            "bullets": [
              "Прошёл практику в посольстве ещё студентом и вернулся туда после выпуска",
              "Вёл переводы и справки по региону, работал с китайским и английским"
            ]
          }
        ],
        "projects": [
          {
            "title": "Стажировка в Пекинском институте языков",
            "bullets": [
              "Углубил китайский язык до рабочего уровня (1983–1984)"
            ]
          }
        ],
        "skills": [
          "Дипломатия",
          "Китайский",
          "Английский",
          "Переговоры",
          "Аналитика"
        ],
        "name": "Касым-Жомарт Токаев",
        "title": "Стажёр-дипломат"
      },
      "en": {
        "city": "Almaty",
        "email": "",
        "phone": "",
        "links": "",
        "summary": "MGIMO graduate. Learning Chinese and English, ready to work abroad and for long postings.",
        "education": [
          {
            "school": "MGIMO",
            "degree": "International relations",
            "years": "1970–1975"
          }
        ],
        "experience": [
          {
            "role": "Trainee, then attaché",
            "org": "USSR Embassy in Singapore",
            "period": "1972, 1975–1979",
            "bullets": [
              "Did an internship at the embassy as a student and returned after graduating",
              "Prepared translations and regional briefs in Chinese and English"
            ]
          }
        ],
        "projects": [
          {
            "title": "Beijing Language Institute internship",
            "bullets": [
              "Brought Chinese to working level (1983–1984)"
            ]
          }
        ],
        "skills": [
          "Diplomacy",
          "Chinese",
          "English",
          "Negotiation",
          "Analytics"
        ],
        "name": "Kassym-Jomart Tokayev",
        "title": "Trainee diplomat"
      }
    }
  },
  {
    "id": "trump",
    "img": "p-4",
    "start": {
      "ru": "1968 · Бруклин",
      "en": "1968 · Brooklyn"
    },
    "template": "accent",
    "name": {
      "ru": "Дональд Трамп",
      "en": "Donald Trump"
    },
    "first": {
      "ru": "Помощник в семейной фирме",
      "en": "Family-firm associate"
    },
    "resume": {
      "ru": {
        "city": "Нью-Йорк",
        "email": "",
        "phone": "",
        "links": "",
        "summary": "Выпускник Уортона по экономике. С подросткового возраста работаю на объектах: от сбора аренды до переговоров.",
        "education": [
          {
            "school": "Уортонская школа бизнеса",
            "degree": "Бакалавр экономики",
            "years": "1966–1968"
          }
        ],
        "experience": [
          {
            "role": "Помощник",
            "org": "Elizabeth Trump & Son, Бруклин и Квинс",
            "period": "1968–1971",
            "bullets": [
              "Работал с жилыми комплексами компании: аренда, ремонт, жильцы",
              "В студенчестве участвовал в проекте жилого комплекса Swifton Village в Цинциннати"
            ]
          }
        ],
        "projects": [
          {
            "title": "Сбор аренды (подработка)",
            "bullets": [
              "Подростком ходил с отцом по объектам и собирал арендную плату"
            ]
          }
        ],
        "skills": [
          "Переговоры",
          "Продажи",
          "Недвижимость",
          "Презентации",
          "Нетворкинг"
        ],
        "name": "Дональд Трамп",
        "title": "Младший специалист по недвижимости"
      },
      "en": {
        "city": "New York",
        "email": "",
        "phone": "",
        "links": "",
        "summary": "Wharton economics graduate. Working on properties since my teens: from collecting rent to negotiating deals.",
        "education": [
          {
            "school": "Wharton School",
            "degree": "BS Economics",
            "years": "1966–1968"
          }
        ],
        "experience": [
          {
            "role": "Associate",
            "org": "Elizabeth Trump & Son, Brooklyn & Queens",
            "period": "1968–1971",
            "bullets": [
              "Worked across the company's residential buildings: leasing, repairs, tenants",
              "As a student joined the Swifton Village apartment project in Cincinnati"
            ]
          }
        ],
        "projects": [
          {
            "title": "Rent collection (side job)",
            "bullets": [
              "As a teen toured buildings with my father collecting rent"
            ]
          }
        ],
        "skills": [
          "Negotiation",
          "Sales",
          "Real estate",
          "Presenting",
          "Networking"
        ],
        "name": "Donald Trump",
        "title": "Junior real-estate associate"
      }
    }
  },
  {
    "id": "musk",
    "img": "p-5",
    "start": {
      "ru": "1995 · Пало-Альто",
      "en": "1995 · Palo Alto"
    },
    "template": "mono",
    "name": {
      "ru": "Илон Маск",
      "en": "Elon Musk"
    },
    "first": {
      "ru": "Стажёр в лаборатории",
      "en": "Lab intern"
    },
    "resume": {
      "ru": {
        "city": "Пало-Альто",
        "email": "",
        "phone": "",
        "links": "zip2.com",
        "summary": "Физика и экономика, Пенсильванский университет. Пишу код с 10 лет, первую программу продал в 12.",
        "education": [
          {
            "school": "Пенсильванский университет",
            "degree": "Физика и экономика",
            "years": "1992–1997"
          }
        ],
        "experience": [
          {
            "role": "Летний стажёр",
            "org": "Pinnacle Research Institute",
            "period": "1994",
            "bullets": [
              "Исследовал ультраконденсаторы для хранения энергии в электромобилях"
            ]
          },
          {
            "role": "Стажёр",
            "org": "Rocket Science Games",
            "period": "1994",
            "bullets": [
              "Писал код для видеоигр в стартапе Кремниевой долины"
            ]
          }
        ],
        "projects": [
          {
            "title": "Blastar",
            "bullets": [
              "Написал космическую игру на BASIC и продал журналу за $500 в 12 лет"
            ]
          },
          {
            "title": "Zip2 (1995)",
            "bullets": [
              "Сооснователь онлайн-справочника городов; в 1999 компанию купили за $307 млн"
            ]
          }
        ],
        "skills": [
          "Программирование",
          "Физика",
          "Стартапы",
          "Продажи",
          "Английский"
        ],
        "name": "Илон Маск",
        "title": "Стажёр-инженер"
      },
      "en": {
        "city": "Palo Alto",
        "email": "",
        "phone": "",
        "links": "zip2.com",
        "summary": "Physics & economics, University of Pennsylvania. Coding since 10, sold my first program at 12.",
        "education": [
          {
            "school": "University of Pennsylvania",
            "degree": "Physics & economics",
            "years": "1992–1997"
          }
        ],
        "experience": [
          {
            "role": "Summer intern",
            "org": "Pinnacle Research Institute",
            "period": "1994",
            "bullets": [
              "Researched ultracapacitors for electric-vehicle energy storage"
            ]
          },
          {
            "role": "Intern",
            "org": "Rocket Science Games",
            "period": "1994",
            "bullets": [
              "Wrote video-game code at a Silicon Valley startup"
            ]
          }
        ],
        "projects": [
          {
            "title": "Blastar",
            "bullets": [
              "Wrote a space game in BASIC and sold it to a magazine for $500 at age 12"
            ]
          },
          {
            "title": "Zip2 (1995)",
            "bullets": [
              "Co-founded an online city guide; acquired in 1999 for $307M"
            ]
          }
        ],
        "skills": [
          "Programming",
          "Physics",
          "Startups",
          "Sales",
          "English"
        ],
        "name": "Elon Musk",
        "title": "Engineering intern"
      }
    }
  },
  {
    "id": "zuckerberg",
    "img": "p-6",
    "start": {
      "ru": "2004 · общага",
      "en": "2004 · dorm room"
    },
    "template": "accent",
    "name": {
      "ru": "Марк Цукерберг",
      "en": "Mark Zuckerberg"
    },
    "first": {
      "ru": "Студент-разработчик",
      "en": "Student developer"
    },
    "resume": {
      "ru": {
        "city": "Кембридж, Массачусетс",
        "email": "",
        "phone": "",
        "links": "thefacebook.com",
        "summary": "2 курс Гарварда, психология и информатика. Делаю сервисы для однокурсников, запускаю за выходные.",
        "education": [
          {
            "school": "Гарвардский университет",
            "degree": "Информатика и психология (не окончил)",
            "years": "2002–2004"
          }
        ],
        "experience": [],
        "projects": [
          {
            "title": "Synapse (школа)",
            "bullets": [
              "Сделал музыкальный плеер, который учится на вкусе слушателя; продукт заметили Microsoft и AOL"
            ]
          },
          {
            "title": "CourseMatch",
            "bullets": [
              "Помог студентам выбирать курсы по тому, что выбрали знакомые"
            ]
          },
          {
            "title": "thefacebook.com",
            "bullets": [
              "Запустил соцсеть для студентов Гарварда из общежития: половина кампуса за первый месяц"
            ]
          }
        ],
        "skills": [
          "PHP",
          "Продукт",
          "Программирование",
          "Стартапы",
          "Латынь"
        ],
        "name": "Марк Цукерберг",
        "title": "Студент-разработчик"
      },
      "en": {
        "city": "Cambridge, MA",
        "email": "",
        "phone": "",
        "links": "thefacebook.com",
        "summary": "Harvard sophomore, psychology & computer science. I build tools for classmates and ship them over a weekend.",
        "education": [
          {
            "school": "Harvard University",
            "degree": "CS & psychology (dropped out)",
            "years": "2002–2004"
          }
        ],
        "experience": [],
        "projects": [
          {
            "title": "Synapse (high school)",
            "bullets": [
              "Built a music player that learns listener taste; it drew interest from Microsoft and AOL"
            ]
          },
          {
            "title": "CourseMatch",
            "bullets": [
              "Helped students pick classes based on what friends chose"
            ]
          },
          {
            "title": "thefacebook.com",
            "bullets": [
              "Launched a student network from a dorm room: half the campus joined in the first month"
            ]
          }
        ],
        "skills": [
          "PHP",
          "Product",
          "Programming",
          "Startups",
          "Latin"
        ],
        "name": "Mark Zuckerberg",
        "title": "Student developer"
      }
    }
  }
];

const src = (x) => (typeof x === "string" ? x : x?.src);
export const FAMOUS = RAW.map((x) => ({ ...x, img: src(IMG[x.img]) }));
