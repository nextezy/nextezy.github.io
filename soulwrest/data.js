/* Картинки гайда (папка img) */
var IMG={
"soulwrest": "img/soulwrest.webp",
"skull": "img/skull.webp",
"juju": "img/juju.webp",
"body": "img/body.webp",
"gloves": "img/gloves.webp",
"boots": "img/boots.webp",
"belt": "img/belt.webp",
"abyss": "img/abyss.webp",
"ring1": "img/ring1.webp",
"ring2": "img/ring2.webp",
"cluster": "img/cluster.webp",
"mastery": "img/mastery.webp",
"guardian": "img/guardian.webp",
"pantheon": "img/pantheon.webp",
"monarch": "img/monarch.webp"
};

/* ===== Данные гайда: камни, вещи, флаконы. Правятся здесь, обновляются и во вкладках, и в карточках в тексте ===== */
var STAGES = {lvl:"Лвлинг", swap:"Переход на посох", main:"Основная версия"};

var GEMS = {
  lvl: {
    note: "Лвлинг взят из сборки MasterT (PoB во вкладке «PoB», там же деревья пассивок по актам). Вырыватель душ требует 60 лвл, поэтому акты проходим другими миньонами.",
    groups: [
      {id:"a1-dmg", sub:"Акт 1", title:"Урон", gems:["Призыв неистового духа (Summon Raging Spirit)","Урон приспешников (Minion Damage)","Раскатистый удар (Melee Splash)"]},
      {id:"a1-zombie", sub:"Акт 1", title:"Зомби", gems:["Поднятие зомби (Raise Zombie)","Урон приспешников (Minion Damage)","Призыв фантома (Summon Phantasm)"]},
      {id:"a1-move", sub:"Акт 1", title:"Передвижение", gems:["Удар щитом (Shield Charge)","Импульс (Momentum)"]},
      {id:"a1-other", sub:"Акт 1", title:"Отдельно", gems:["Живучесть (Vitality)","Огненный рывок (Flame Dash)","Подношение плоти (Flesh Offering)"]},

      {id:"a2-dmg", sub:"Акты 2-3", title:"Урон", gems:["Призыв неистового духа (Summon Raging Spirit)","Урон приспешников (Minion Damage)","Физический урон ближнего боя (Melee Physical Damage)","Беспощадность (Ruthless)"]},
      {id:"a2-zombie", sub:"Акты 2-3", title:"Зомби", gems:["Поднятие зомби (Raise Zombie)","Урон приспешников (Minion Damage)","Раскатистый удар (Melee Splash)","Голодное остервенение (Feeding Frenzy)"]},
      {id:"a2-move", sub:"Акты 2-3", title:"Передвижение", gems:["Удар щитом (Shield Charge)","Импульс (Momentum)","Ускорение атак (Faster Attacks)"]},
      {id:"a2-other", sub:"Акты 2-3", title:"Отдельно", gems:["Живучесть (Vitality)","Решимость (Determination)","Огненный рывок (Flame Dash)","Подношение плоти (Flesh Offering)","Осквернение (Desecrate)"], text:"Беспощадность и Голодное остервенение добавляются в 3 акте, Решимость тоже."},

      {id:"a4-dmg", sub:"Акты 4-6", title:"Урон", gems:["Призыв неистового духа (Summon Raging Spirit)","Урон приспешников (Minion Damage)","Эхо магии (Spell Echo)","Град ударов (Multistrike)"]},
      {id:"a4-zombie", sub:"Акты 4-6", title:"Зомби", gems:["Поднятие зомби (Raise Zombie)","Урон приспешников (Minion Damage)","Раскатистый удар (Melee Splash)","Град ударов (Multistrike)"]},
      {id:"a4-golem", sub:"Акты 4-6", title:"Голем и призраки", gems:["Призыв трупного голема (Summon Carrion Golem)","Голодное остервенение (Feeding Frenzy)","Сотворение призрака (Raise Spectre)","Увечье (Maim)"]},
      {id:"a4-aura", sub:"Акты 4-6", title:"Ауры", gems:["Живучесть (Vitality)","Решимость (Determination)","Призыв мехаботов (Summon Skitterbots)","Огненный рывок (Flame Dash)"]},
      {id:"a4-move", sub:"Акты 4-6", title:"Передвижение", gems:["Удар щитом (Shield Charge)","Импульс (Momentum)","Ускорение атак (Faster Attacks)"]},
      {id:"a4-off", sub:"Акты 4-6", title:"Трупы", gems:["Осквернение (Desecrate)","Подношение плоти (Flesh Offering)","Жизнеотвод (Lifetap)"]},

      {id:"a6-dmg", sub:"С 6 акта до конца актов", title:"Урон", gems:["Сотворение скелетов ваал (Vaal Summon Skeletons)","Урон приспешников (Minion Damage)","Раскатистый удар (Melee Splash)","Град ударов (Multistrike)"], text:"С ботинками Тропа войны Алберона скелеты-воины постоянные и ходят за вами."},
      {id:"a6-zombie", sub:"С 6 акта до конца актов", title:"Зомби", gems:["Поднятие зомби (Raise Zombie)","Урон приспешников (Minion Damage)","Раскатистый удар (Melee Splash)","Град ударов (Multistrike)"]},
      {id:"a6-golem", sub:"С 6 акта до конца актов", title:"Голем и призраки", gems:["Призыв трупного голема (Summon Carrion Golem)","Голодное остервенение (Feeding Frenzy)","Сотворение призрака (Raise Spectre)","Увечье (Maim)"]},
      {id:"a6-aura", sub:"С 6 акта до конца актов", title:"Ауры", gems:["Живучесть (Vitality)","Ледяной скачок (Frostblink)","Призыв мехаботов (Summon Skitterbots)","Решимость (Determination)"]},
      {id:"a6-move", sub:"С 6 акта до конца актов", title:"Передвижение", gems:["Удар щитом (Shield Charge)","Импульс (Momentum)","Сбор (Convocation)|1 лвл"]},
      {id:"a6-off", sub:"С 6 акта до конца актов", title:"Трупы и проклятие", gems:["Осквернение (Desecrate)","Подношение плоти (Flesh Offering)","Жизнеотвод (Lifetap)","Беззащитность (Vulnerability)|1 лвл"]}
    ]
  },
  swap: {
    note: "Сетап из сборки MasterT на конец актов, когда берём первые Вырыватели душ (с 60 лвл). Камни 15-16 лвл, это нормально.",
    groups: [
      {id:"sw-boss", title:"Посох 1: босс", gems:["Призыв фантома (Summon Phantasm)","Урон приспешников (Minion Damage)","Свежее мясо (Fresh Meat)","Хищник (Predator)","Жестокость (Brutality)","Учащение критических ударов (Increased Critical Strikes)"]},
      {id:"sw-clear", title:"Посох 2 (свап): зачистка", gems:["Дополнительные снаряды (Multiple Projectiles)","Ускорение снарядов (Faster Projectiles)","Свежее мясо (Fresh Meat)","Призыв фантома (Summon Phantasm)","Усиление критических ударов (Increased Critical Damage)","Урон приспешников (Minion Damage)"]},
      {id:"sw-cyclone", title:"Нагрудник", gems:["Вихрь (Cyclone)","Осквернение (Desecrate)|1 лвл","Сотворение чар при поддержании (Cast while Channelling)","Подношение духа (Spirit Offering)","Беззащитность (Vulnerability)"], text:"Беззащитность ни с чем не связываем, кастуем руками."},
      {id:"sw-minions", title:"Шлем", gems:["Аниматрон (Animate Guardian)","Сотворение призрака (Raise Spectre)","Голодное остервенение (Feeding Frenzy)","Призыв каменного голема (Summon Stone Golem)"]},
      {id:"sw-aura", title:"Перчатки", gems:["Спасение от стихий (Purity of Elements)","Гордость (Pride)","Камень и плоть (Flesh and Stone)","Сбор (Convocation)|1 лвл"]},
      {id:"sw-boots", title:"Ботинки", gems:["Призыв трупного голема (Summon Carrion Golem)","Увечье (Maim)","Ледяной скачок (Frostblink)"]}
    ]
  },
  main: {
    note: "Основная версия из PoB. Вырыватель душ сам даёт Призыв фантома 25 лвл, поэтому сапорты в посохе связаны с ним без линков: нужны только 6 гнёзд.",
    groups: [
      {id:"m-clear", title:"Посох 1: зачистка", gems:["Призыв фантома (Summon Phantasm)|21 лвл","Свежее мясо (Fresh Meat)","Урон приспешников (Minion Damage)","Усиление критических ударов (Increased Critical Damage)","Ускорение снарядов (Faster Projectiles)","Много дополнительных снарядов (Greater Multiple Projectiles)"]},
      {id:"m-boss", title:"Посох 2 (свап): босс", gems:["Призыв фантома (Summon Phantasm)|21 лвл","Свежее мясо (Fresh Meat)","Урон приспешников (Minion Damage)","Усиление критических ударов (Increased Critical Damage)","Учащение критических ударов (Increased Critical Strikes)","Жестокость (Brutality)"]},
      {id:"m-cyclone", title:"Нагрудник: Вихрь", gems:["Вихрь (Cyclone)","Сотворение чар при поддержании (Cast while Channelling)","Подношение духа (Spirit Offering)","Осквернение (Desecrate)|1 лвл"]},
      {id:"m-mark", title:"Нагрудник: метка", gems:["Метка снайпера (Sniper's Mark)","Метка при попадании (Mark On Hit)"]},
      {id:"m-aura", title:"Шлем", gems:["Решимость (Determination)","Камень и плоть (Flesh and Stone)","Сбор (Convocation)|1 лвл","Гордость (Pride)"]},
      {id:"m-minions", title:"Ботинки", gems:["Аниматрон (Animate Guardian)","Голодное остервенение (Feeding Frenzy)","Призыв каменного голема (Summon Stone Golem)","Сотворение призрака (Raise Spectre)"]},
      {id:"m-shell", title:"Перчатки", gems:["Расплавленный панцирь (Molten Shell)","Автоматизация (Automation)","Продление (More Duration)|16 лвл"]},
      {id:"m-blink", title:"Перчатки, отдельно", gems:["Ледяной скачок (Frostblink)"]}
    ]
  }
};

/* Вещи. u = уник, req = обязательные свойства, buy = ссылка на покупку (пусто, пока лига не началась) */
var ITEMS = {
  lvl: {
    note: "Вещи на акты из сборки MasterT. Ничего дорогого не нужно: простые вещи на броню и энергощит с нужными цветами гнёзд.",
    slots: [
      {slot:"Оружие", req:["Палочка на +1 к уровню камней приспешников"]},
      {slot:"Щит", req:["Любой щит на броню и энергощит"], text:"Нужен для Удара щитом."},
      {slot:"Шлем", req:["+1 к уровню камней приспешников, если попадётся"]},
      {slot:"Ботинки", u:["Тропа войны Алберона (Alberon's Warpath)"], text:"С 6 акта: скелеты-воины становятся постоянными. У MasterT стоили 1 хаос. Не путать с копией (Replica Alberon's Warpath), это другая вещь.", buy:""},
      {slot:"Нагрудник, перчатки, пояс, кольца, амулет", req:["Хп и резисты","Статы, если не хватает"]}
    ]
  },
  swap: {
    note: "С 60 лвл берём Вырыватель душ. Второй посох тоже лучше взять как можно раньше: свап между зачисткой и боссом очень сильно облегчает игру.",
    slots: [
      {slot:"Оружие", u:["Вырыватель душ (Soulwrest), 2 штуки"], req:["6 гнёзд (линки не нужны)"], text:"Сапорты в посохе сами связываются с Призывом фантома, который даёт посох. Один посох на зачистку, второй на босса, переключение на X.", imgs:[["soulwrest","Вырыватель душ"]], buy:""},
      {slot:"Остальные слоты", req:["Хп и резисты","Броня и энергощит"], text:"Остальное с актов, по мере фарма меняем на вещи из основной версии."},
      {slot:"Вещи аниматрона", u:["Дыхание увядания (Dying Breath)","Маска труппы хитрецов (Leer Cast)","Брюхо Зверя (Belly of the Beast)","Вопли ветра (Windscream)"], req:["Перчатки: проклятие Беззащитностью при попадании"], text:"Все вещи дешёвые, около 10 хаосов за всё. Как одеть аниматрона, в главе «Миньоны».", imgs:[["guardian","Вещи аниматрона"]]}
    ]
  },
  main: {
    note: "Версия из PoB, примерно 5 диванов на 2 день лиги. Цена со временем только падает.",
    slots: [
      {slot:"Оружие", u:["Вырыватель душ (Soulwrest), 2 штуки"], req:["6 гнёзд (линки не нужны)"], imgs:[["soulwrest","Вырыватель душ"]], buy:""},
      {slot:"Шлем", u:["Древний череп (Ancient Skull)"], text:"Много крита и скорости атаки миньонам, но миньоны теряют здоровье. Как с этим жить, в главе «Древний череп».", max:"Тёмный монарх (The Dark Monarch): 40 Фантомов, но других миньонов быть не может. Сильно режет FPS.", imgs:[["skull","Древний череп"],["monarch","Тёмный монарх"]], buy:""},
      {slot:"Амулет", u:["Дурной джу-джу (The Jinxed Juju)"], text:"Намазка: Adamant.", imgs:[["juju","Дурной джу-джу"]], buy:""},
      {slot:"Нагрудник", req:["Броня и энергощит","Резисты","Сферами Пожирателя миров и Пламенного экзарха: блок чар и усиление аур"], text:"6-линк не нужен, поэтому стоит копейки.", imgs:[["body","Нагрудник"]]},
      {slot:"Перчатки", req:["Урон приспешников","Хп или резисты"], text:"Крафт: фрактурные перчатки на броню и энергощит с хаос резом, спамим сущность на урон приспешников. Сферой экзарха добавляем ещё урон приспешников.", imgs:[["gloves","Перчатки"]]},
      {slot:"Ботинки", u:["Копия Бегства (Replica Stampede)"], text:"Не обязательные, только для комфорта. Можно любые рарные на 30% скорости бега. Намазка: Слияние (Melding).", imgs:[["boots","Копия Бегства"]], buy:""},
      {slot:"Пояс", u:["Воцарившаяся тьма (Darkness Enthroned)"], text:"Ролы от 90% и выше. Два абиссальных самоцвета: физ урон приспешников и хп (или энергощит, что дешевле, хп приоритетнее).", imgs:[["belt","Воцарившаяся тьма"],["abyss","Абиссальный самоцвет"]], buy:""},
      {slot:"Кольца", req:["Ловкость (её сильно не хватает)","Резисты","В идеале скорость атаки или урон приспешников"], imgs:[["ring1","Кольцо 1"],["ring2","Кольцо 2"]]},
      {slot:"Самоцветы", req:["Средний кластер на хп приспешников с Жизнью из смерти"], text:"В PoB кластер на два нода, он дорогой. Бюджетный вариант: кластер на один нод Жизнь из смерти. Ещё 2 абиссальных самоцвета в дереве на физ урон приспешников и статы.", imgs:[["cluster","Средний кластерный самоцвет"]]},
      {slot:"Вещи аниматрона", u:["Дыхание увядания (Dying Breath)","Маска труппы хитрецов (Leer Cast)","Брюхо Зверя (Belly of the Beast)","Вопли ветра (Windscream)"], req:["Перчатки: проклятие Беззащитностью при попадании"], imgs:[["guardian","Вещи аниматрона"]]}
    ]
  }
};

/* Флаконы: наборы по слотам */
var FLASKS = {
  lvl: {
    note: "Особых флаконов на актах не нужно: флаконы на хп и ртутный на скорость бега.",
    sets: [
      {id:"fl-lvl", title:"Набор флаконов", head:["Флакон","Зачем"], rows:[["На хп","Лечение"],["Ртутный (Quicksilver Flask)","Скорость бега"]]}
    ]
  },
  swap: {
    note: "Цель тот же набор, что в основной версии. Пока его нет, бегаем с тем, что есть.",
    sets: [
      {id:"fl-swap", title:"Набор флаконов", head:["Слот","Флакон"], rows:[["1","Божественный флакон жизни (Divine Life Flask), мгновенный"],["2","Вечный флакон жизни (Eternal Life Flask)"],["3","Аметистовый (Amethyst Flask)"],["4","Кварцевый (Quartz Flask)"],["5","Гранитный (Granite Flask)"]]}
    ]
  },
  main: {
    note: "Набор из PoB основной версии.",
    sets: [
      {id:"fl-main", title:"Набор флаконов", head:["Слот","Флакон","Зачем"], rows:[["1","Божественный флакон жизни (Divine Life Flask), мгновенный","Экстренное лечение, иммунитет к кровотечению"],["2","Вечный флакон жизни (Eternal Life Flask)","Лечение, иммунитет к шоку"],["3","Аметистовый (Amethyst Flask)","Хаос рез, используется при накоплении максимума зарядов"],["4","Кварцевый (Quartz Flask)","Шанс избежать оглушения"],["5","Гранитный (Granite Flask)","Броня, используется при накоплении максимума зарядов"]]}
    ]
  }
};

/* PoB (Path of Building) */
var POBS = [
  {id:"lvl", title:"Лвлинг и переход на посох (сборка MasterT)", url:"https://mobalytics.gg/poe/builds/mastert-s-cyclone-cwc-soulwrest-necromancer", desc:"Сборка MasterT на mobalytics. В его PoB (кнопка Copy Code на странице) есть деревья пассивок по актам, камни и вещи на лвлинг и на переход на Вырыватель душ."},
  {id:"main", title:"Основная версия", url:"https://pobb.in/iheTDtkCEcZE", desc:"Основная версия на 91 лвл: два Вырывателя душ, Древний череп, Дурной джу-джу, Воцарившаяся тьма."}
];
var POB_PAIR_NOTE = "";
