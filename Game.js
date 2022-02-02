/**
 * Nano Bot Text-RPG Module (개발 중)
 * 
 * Module 경로에 스크립트를 넣어 주세요.
 * 이 소스 수정 시 발생한 문제는 책임지지 않습니다.
 * 소스 자체에 오류가 있어도 고쳐서 사용 해 주세요.
 */

let fs, s, r, path, va,
user = JSON.parse(fs.read(path)), 
place = ['마을', '상점', '훈련장', '숲1', '숲2', '사막', '광야', '깊은 산골1', '깊은 산골2'],
isM = {
    '마을': ['상점', '훈련장', '숲1', '사막'],
    '상점': ['마을'],
    '훈련장': ['마을'],
    '숲1': ['마을', '숲2'],
    '숲2': ['숲1', '깊은 산골1'],
    '깊은 산골1': ['숲2', '깊은 산골2'],
    '깊은 산골2': ['깊은 산골1'],
    '사막': ['마을', '광야'],
    '광야': ['사막']
},
arms = {
    '맨 손': 0,
    '나무 검': 3,
    '깨진 돌': 5,
    '갈린 돌': 7,
    '날카로운 뼈': 8,
    '철 단검': 10,
    '철 장검': 12,
    '암흑의 검': 20,
    '빛의 검': 50
},
lv_int = 0;

save = function() { fs.write(path, JSON.stringify(user)); };

nd = function(x) { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); };

isArms = function() { return arms[user[s].arms]; }

isMoving = function(p) {
    if (place.indexOf(user[s].place) == -1) {
        user[s].place = '마을';
        save();
        return r.reply(`장소 오류로 인해 "마을"로 이동 했습니다.`);
    } else if (isM[user[s].place].indexOf(p) != -1) {
        user[s].place = p;
        save();
        return r.reply(user[s].place + "(으)로 이동 했습니다.");
    }
    return r.reply(`이동할 수 없거나 존재하지 않는 장소 입니다.\n*Tip. "n.지도"을 통해 이동 할 수 있는 지역을 확인해 보세요!`);
}

fight = function(mons, turn) {
    if (user[s].hp <= 0) {
        user[s].place = '죽음의 골짜기';
        user[s].die = true;
        user[s].dieTime = Date.now();
        save();
        return r.reply(mons.name + "에게 제압 당했습니다.\n\n" + mons.name + " 정보\n - 공격력: " + mons.dem + "\n - 남은 체력: " + mons.hp + "\n" + va + "\n\n\n[ 전투 기록 ]\n\n\n" + mons.log.join("\n\n"));
    } else if (mons.hp <= 0) {
        user[s].exp += mons.exp;
        user[s].money += mons.money;
        save();
        r.reply(mons.name + "(을)를 처치 했습니다!\n\n보상 :\n + Exp " + mons.exp + "\n + " + mons.money + "*\n" + va + "\n\n\n[ 전투 기록 ]\n\n\n" + mons.log.join("\n\n"));
        if (user[s].fexp <= user[s].exp) return levelUp();
        else return;
    } else if (turn) {
        prev_mon_hp = mons.hp;
        mons.hp -= Math.floor(Math.random() * (user[s].dem + isArms()) + (user[s].dem / 2));
    } else {
        prev_hp = user[s].hp;
        user[s].hp -= Math.floor(Math.random() * mons.dem + (mons.dem / 2));
        save();
    }
    mons.log.push(turn ? s + " _ 공격!\n - " + mons.name + " _ 입은 피해: " + (prev_mon_hp - mons.hp) + ((prev_mon_hp - mons.hp) > (user[s].dem + isArms()) ? " (Critical)" : ((prev_mon_hp - mons.hp) < ((user[s].dem + isArms()) - 1)) ? " (Miss)" : " ") + "\n - " + mons.name + " _ 체력: " + prev_mon_hp + " → " + mons.hp : mons.name + " _ 공격!\n - " + s + " _ 입은 피해: " + (prev_hp - user[s].hp) + ((prev_hp - user[s].hp) > mons.dem ? " (Critical)" : (((prev_hp - user[s].hp) < (mons.dem - 1)) ? " (Miss)" : " ")) + "\n - " + s + " _ 체력: " + prev_hp + " → " + user[s].hp);
    fight({
        name: mons.name,
        dem: mons.dem,
        hp: mons.hp,
        exp: mons.exp,
        money: mons.money,
        log: mons.log
    }, !turn);
}

levelUp = function() {
    let  prev_fhp, prev_dem;
    lv_int++;
    if (lv_int == 1) {
        prev_fhp = user[s].fhp;
        prev_dem = user[s].dem;
    }
    user[s].exp -= user[s].fexp;
    user[s].fhp += user[s].lv;
    user[s].lv += 1;
    user[s].fexp += (user[s].lv * Math.floor((user[s].fhp / 2)));
    user[s].hp = user[s].fhp;
    user[s].dem += Math.floor(user[s].lv / 2 < 1 ? 1 : user[s].lv / 2);
    save();
    if (user[s].fexp > user[s].exp) {
        r.reply("레벨업! Level Up!\n\n - 레벨이 +" + lv_int + " 올랐습니다.\n\n + Lv." + (user[s].lv - lv_int) + " → " + user[s].lv + "\n + 체력: " + prev_fhp + " → " + user[s].fhp + "\n + 공격력: " + (prev_dem + isArms()) + " → " + (user[s].dem + isArms()));
        lv_int = 0;
        return;
    } else levelUp();
}

useItems = function(n, i) {
    prev_item = user[s].item[n];
    prev_hp = user[s].hp;
    for (i; i > 0; i--) {
        if (n == '체력물약') user[s].fhp < 30 ? user[s].hp = user[s].fhp : ((user[s].hp + 30) < user[s].fhp ? user[s].hp += 30 : user[s].hp = user[s].fhp);
        user[s].item[n]--;
    save();
    }
    if (user[s].item[n] == 0) {
        delete user[s].item[n];
        save();
        return r.reply("아이템을 모두 사용 했습니다.");
    }
    return r.reply("아이템을 사용 했습니다.\n\n - " + n + " * " + prev_item + " → " + user[s].item[n] + "\n + 체력: " + prev_hp + " → " + user[s].hp);
}

mapView = function() {
    arr = [];
    keys = Object.keys(isM);
    for (i in keys) {
        if (keys[i] != user[s].place) arr.push('[ ' + keys[i] + ' ]\n이동 가능한 장소\n|\n▸ ' + isM[keys[i]].join('\n▸ '));
    }
    return r.reply("[ 현재 장소 ] *" + user[s].place + "\n이동 가능한 장소\n|\n▸ " + isM[user[s].place].join('\n▸ ') + va + "\n\n" + arr.join('\n\n'));
}

function Rpg(route, viewAll, file) { path = route, va = viewAll, fs = file; }

Rpg.prototype.init = function(sender, replier) { s = sender, r = replier }

Rpg.prototype.join = function() {
    if (user == null) fs.write(path, '{}');
    if (user[s] != null) return r.reply("(!) 가입된 정보가 존재합니다."); 
    user[s] = { lv: 1, exp: 0, fexp: 12, money: 0, dem: 5, hp: 20, fhp: 20, die: false, dieTime: 0, place: "마을", arms: "맨 손", item: { "체력물약": 20, } };
    save();
    r.reply("~ [ " + s + "님 ] ~\n가입을 축하 드립니다!");
    r.reply("+ 체력물약 20개 (가입 보상)");
}

Rpg.prototype.remove = function() {
    if (user[s] == null) return r.reply("(!) 탈퇴 조건이 충족되지 않았습니다.");
    delete user[s];
    save();
    return r.reply("탈퇴 되셨습니다.");
}

Rpg.prototype.info = function() {
    if (user[s] == null) return r.reply("(!) 가입 후 이용 가능합니다.");
    return r.reply(
        "¤ [RPG] " + s + " 님 정보 ¤\n\n" + 
        "[ 기본 ]\n" + 
        "Lv. " + user[s].lv + " | Exp: " + nd(user[s].exp) + " / " + nd(user[s].fexp) + "\n" +
        "공격력: " + (user[s].dem + isArms()) + "\n" +
        "체력: " + user[s].hp + " / " + user[s].fhp + (user[s].die ? ((Date.now() - user[s].dieTime) < 180000 ? " (약 " + (Math.floor(((user[s].dieTime + 180000) - Date.now()) / 1000) >= 60 ? Math.floor((((user[s].dieTime + 180000) - Date.now()) / 1000) / 60) + "분" : Math.floor(((user[s].dieTime + 180000) - Date.now()) / 1000) + "초") + " 뒤 부활 가능)\n" : " (부활 가능)\n") : "\n") +
        "무기: " + user[s].arms + "\n" +
        "돈: " + user[s].money + "*\n" +
        "장소: "+ user[s].place
    ); 
}

Rpg.prototype.readItem = function() {
    if (user[s] == null) return r.reply("(!) 가입 후 이용 가능합니다.");
    if (user[s].item == {}) return r.reply("¤ [RPG] " + s + "님 아이템 ¤\n\n아이템 없음 X");
    keys = Object.keys(user[s].item);
    str = [];
    for (i in keys) {
        str.push(keys[i] + " * " + user[s].item[keys[i]]);
    }
    return r.reply("¤ [RPG] " + s + "님 아이템 ¤\n\n" + str.join("\n"));
}

Rpg.prototype.useItem = function(n, i) {
    if (user[s] == null) return r.reply("(!) 가입 후 이용 가능합니다.");
    if (user[s].hp <= 0) return r.reply("(!) 체력이 모두 소모 되어 있습니다.");
    if (isNaN(i)) return r.reply("(!) 갯수를 입력 해주세요.");
    if (i <= 0) return r.reply("(!) 제대로 된 갯수를 입력 해주세요.");
    if (Object.keys(user[s].item).indexOf(n) == -1) return r.reply("(!) 아이템이 존재하지 않습니다.");
    if (user[s].item[n] <= i) return r.reply("(!) 아이템 갯수가 부족합니다.");
    useItems(n, i);
}

Rpg.prototype.live = function() {
    if (user[s] == null) return r.reply("(!) 가입 후 이용 가능합니다.");
    if (!user[s].die) return;
    if (Date.now() - user[s].dieTime < 180000) return r.reply("부활까지 약 " + (Math.floor(((user[s].dieTime + 180000) - Date.now()) / 1000) >= 60 ? Math.floor((((user[s].dieTime + 180000) - Date.now()) / 1000) / 60) + "분" : Math.floor(((user[s].dieTime + 180000) - Date.now()) / 1000) + "초") + " 남음");
    user[s].die = false;
    user[s].dieTime = 0;
    user[s].hp = user[s].fhp;
    user[s].place = '마을';
    save();
    return r.reply("부활 했습니다.")
}

Rpg.prototype.move = function(p) {
    if (user[s] == null) return r.reply("(!) 가입 후 이용 가능합니다.");
    if (user[s].hp <= 0) return r.reply("(!) 체력이 모두 소모 되어 있습니다.");
    if (user[s].place == p) return r.reply("(!) 현재 장소에 계십니다.");
    isMoving(p);
}

Rpg.prototype.training = function() {
    if (user[s] == null) return r.reply("(!) 가입 후 이용 가능합니다.");
    if (user[s].hp <= 0) return r.reply("(!) 체력이 모두 소모 되어 있습니다.");
    if (user[s].place != '훈련장') return r.reply("(!) 훈련장에 이동 후 이용 해 주세요");
    mons_hp = Math.floor(((Math.random() * (user[s].lv * 2)) + user[s].lv) * (user[s].dem / 3)) + user[s].lv;
    return fight({
        name: (user[s].lv > 100 ? '신성한 훈련 봇' : (user[s].lv > 60 ? '고급 훈련 봇' : (user[s].lv > 30 ? '중급 훈련 봇' : '초급 훈련 봇'))), 
        dem: Math.floor(mons_hp / user[s].lv), 
        hp: mons_hp,
        exp: Math.floor(mons_hp + (user[s].lv / 2)), 
        money: Math.floor((mons_hp / 3) + (user[s].lv / 2)), 
        log: []
    }, true);
}

Rpg.prototype.store = function() {
    if (user[s] == null) return r.reply("(!) 가입 후 이용 가능합니다.");
    if (user[s].hp <= 0) return r.reply("(!) 체력이 모두 소모 되어 있습니다.");
    if (user[s].place != '상점') return r.reply("(!) 상점에 이동 후 이용 해 주세요");
    let armsList = Object.keys(arms);
    r.reply(
        "[ RPG 상점 ]\n\n전체보기를 눌러 주세요.\n" + va + "\n\n\n" +
        "[ 물약 ]\n" +
        "체력물약 | 20*\n\n" +
        "[ 무기 ]\n" + 
        armsList[1] + " | 50*\n" +
        armsList[2] + " | 75*\n" +
        armsList[3] + " | 90*\n" +
        armsList[4] + " | 110*\n" +
        armsList[5] + " | 150*\n" +
        armsList[7] + " | 250*"
    );
}

/*
Rpg.prototype.buy = function(n, i) {
    if (user[s] == null) return r.reply("(!) 가입 후 이용 가능합니다.");
    if (user[s].hp <= 0) return r.reply("(!) 체력이 모두 소모 되어 있습니다.");
    if (user[s].place != '상점') return r.reply("(!) 상점에 이동 후 이용 해 주세요");
    if (n == null || ["체력물약", "나무 검", "깨진 돌", "갈린 돌", "날까로운 뼈", "철 단검", "철 장검"].indexOf(n) == -1) return r.reply("(!) 올바른 아이템 이름을 입력 해 주세요");
    if (i == null || isNaN(i)) return r.reply("(!) 올바르게 갯수를 입력 해 주세요")
    r.reply("구매 구현 중...");
}

Rpg.prototype.battle = function() {
    if (user[s] == null) return r.reply("(!) 가입 후 이용 가능합니다.");
    if (user[s].hp <= 0) return r.reply("(!) 체력이 모두 소모 되어 있습니다.");
    if (user[s].place != '숲1' || user[s].place != '숲2' || user[s].place != '사막' || user[s].place != '광야' || user[s].place != '깊은 산골2' || user[s].place != '깊은 산골2') return r.reply(`(!) 전투가 불가능한 지역 입니다.\n*Tip. "n.지도"를 통해 전투 가능 지역을 확인해 보세요!`);
    r.reply("전투 구현 중...");
}
*/

Rpg.prototype.map = function() {
    if (user[s] != null) mapView();
}

module.exports = Rpg;
