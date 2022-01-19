/**
 * Nano Bot Text-RPG Module (개발 중)
 * 
 * Module 경로에 스크립트를 넣어 주세요.
 * 이 소스 수정 시 발생한 문제는 책임지지 않습니다.
 * 소스 자체에 오류가 있어도 고쳐서 사용 해 주세요.
 */

let fs, s, r;
path = "/sdcard/nanobot/rpg/user.json";
va = "\u200b".repeat(500);
user = JSON.parse(fs.read(path));
place = ["마을", "상점", "훈련장", "숲1", "숲2", "사막", "광야", "깊은 산골1", "깊은 산골2"];
lv_int = 0;

save = function() { fs.write(path, JSON.stringify(user)); };
nd = function(x) { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); };

isMoving = function(p) {
    if (place.indexOf(user.s.place) == -1) {
        user.s.place = "마을";
        save();
        return r.reply("장소 오류로 인해 \"마을\"로 이동 했습니다.");
    }
    isM = {
        "마을" : ["상점", "훈련장", "숲1", "사막"],
        "상점" : ["마을"],
        "훈련장" : ["마을"],
        "숲1" : ["마을", "숲2"],
        "숲2" : ["숲1", "깊은 산골1"],
        "깊은 산골1" : ["숲2", "깊은 산골2"],
        "깊은 산골2" : ["깊은 산골1"],
        "사막" : ["마을", "광야"],
        "광야" : ["사막"]
    };
    if (isM[user.s.place].indexOf(p) != -1) {
        user.s.place = p;
        save();
        return r.reply(user.s.place + "(으)로 이동 했습니다.");
    }
    else return r.reply("이동할 수 없거나 존재하지 않는 장소 입니다.");
}

fight = function(mon_name, mon_dem, mon_hp, e, m, log, turn) {
    if (user.s.hp <= 0) {
        user.s.place = "마을";
        user.s.die = true;
        user.s.dieTime = Date.now();
        save();
        return r.reply(mon_name + "에게 제압 당했습니다.\n\n" + mon_name + "\n - 남은 체력: " + mon_hp + "\n" + va + "\n\n\n[ 전투 기록 ]\n\n\n" + log.join("\n\n"));
    }
    if (mon_hp <= 0) {
        user.s.exp += e;
        user.s.money += m;
        save();
        r.reply(mon_name + "(을)를 처치 했습니다!\n\n보상 :\n + Exp " + e + "\n + " + m + "*\n" + va + "\n\n\n[ 전투 기록 ]\n\n\n" + log.join("\n\n"));
        if (user.s.fexp <= user.s.exp) levelUp();
        return;
    }
    if (turn) {
        prev_mon_hp = mon_hp;
        mon_hp -= Math.floor(Math.random() * user.s.dem + (user.s.dem / 2));
    } else {
        prev_hp = user.s.hp;
        user.s.hp -= Math.floor(Math.random() * mon_dem + (mon_dem / 2));
        save();
    }
    log.push(turn ? s + " _ 공격!\n - " + mon_name + " _ 입은 피해: " + (prev_mon_hp - mon_hp) + "\n - " + mon_name + " _ 체력: " + prev_mon_hp + " → " + mon_hp : mon_name + " _ 공격!\n - " + s + " _ 입은 피해: " + (prev_hp - user.s.hp) + "\n - " + s + " _ 체력: " + prev_hp + " → " + user.s.hp);
    fight(mon_name, mon_dem, mon_hp, e, m, log, !turn);
}

levelUp = function() {
    lv_int++;
    user.s.exp -= user.s.fexp;
    user.s.fhp += user.s.lv;
    user.s.lv += 1;
    user.s.fexp += (user.s.lv * Math.floor((user.s.fhp / 2)));
    user.s.hp = user.s.fhp;
    save();
    if (user.s.fexp > user.s.exp) {
        r.reply("레벨업! Level Up!\n\n - 레벨이 +" + lv_int + " 올랐습니다.");
        lv_int = 0;
        return;
    } else levelUp();
}

module.exports = {
    init : function(sender, replier, file) { s = sender; r = replier; fs = file; },
    join : function() {
        if (user == null) fs.write(path, "{}");
        if (user.s != null) return r.reply("이미 가입 되셨습니다."); 
        user.s = { lv : 1, exp : 0, fexp : 15, money : 0, dem : 5, hp : 10, fhp : 10, die : false, dieTime : 0, place : "마을", weapon : "맨 손", top : "가죽 흉갑", bottom : "가죽 레깅스", item : { "체력 물약" : 20 } };
        save();
        return r.reply("가입을 축하드립니다!");
    },
    remove : function() {
        if (user.s == null) return r.reply("탈퇴 조건이 충족되지 않았습니다.");
        delete user.s;
        save();
        return r.reply("탈퇴 되셨습니다.");
    },
    info  : function() {
        if (user.s == null) return r.reply("가입 후 이용 가능합니다.");
        return r.reply(
            "¤ [RPG] " + s + "님 정보 ¤\n" +
            "\n" + 
            "[ 기본 ]\n" + 
            "Lv." + user.s.lv + " | Exp: " + nd(user.s.exp) + "/" + nd(user.s.fexp) + "\n" +
            "hp: " + user.s.hp + "/" + user.s.fhp + (user.s.die ? ((Date.now() - user.s.dieTime) < 180000 ? " (약 " + (Math.floor(((user.s.dieTime + 180000) - Date.now()) / 1000) >= 60 ? Math.floor((((user.s.dieTime + 180000) - Date.now()) / 1000) / 60) + "분" : Math.floor(((user.s.dieTime + 180000) - Date.now()) / 1000) + "초") + " 뒤 부활 가능)" : " (부활 가능)") : "") + "\n" +
            "데미지: " + user.s.dem + "\n" +
            "money: " + user.s.money + "*\n" +
            "장소: " + user.s.place + "\n" +
            "\n" +
            "[ 장비 ]\n" +
            "무기: " + user.s.weapon + "\n" +
            "상의: " + user.s.top + "\n" +
            "하의: " + user.s.bottom
        ); 
    },
    read_item  : function() {
        if (user.s == null) return r.reply("가입 후 이용 가능합니다.");
        if (user.s.item == {}) return r.reply("¤ [RPG] " + s + "님 아이템 ¤\n\n아이템 없음 X");
        keys = Object.keys(user.s.item);
        str = [];
        for (i in keys) {
            str.push(keys[i] + " * " + user.s.item[keys[i]]);
        }
        return r.reply("¤ [RPG] " + s + "님 아이템 ¤\n\n" + str.join("\n"));
    },
    use_item  : function(n, i) {
        if (user.s == null) return r.reply("가입 후 이용 가능합니다.");
        if (isNaN(i)) return r.reply("갯수를 입력 해주세요.");
        if (i <= 0) return r.reply("제대로 된 갯수를 입력 해주세요.");
        if (Object.keys(user.s.item).indexOf(n) == -1) return r.reply("아이템이 존재하지 않습니다.");
        if (user.s.item[n] <= i) return r.reply("아이템 갯수가 부족합니다.");
        user.s.item[n] -= i;
        save();
        if (user.s.item[n] == 0) {
            delete user.s.item[n];
            save();
            return r.reply("아이템을 모두 사용 했습니다.");
        } else return r.reply("아이템을 사용 했습니다.");
    },
    live  : function() {
        if (!user.s.die) return;
        if (Date.now() - user.s.dieTime < 180000) return r.reply("부활까지 약 " + (Math.floor(((user.s.dieTime + 180000) - Date.now()) / 1000) >= 60 ? Math.floor((((user.s.dieTime + 180000) - Date.now()) / 1000) / 60) + "분" : Math.floor(((user.s.dieTime + 180000) - Date.now()) / 1000) + "초") + " 남음");
        user.s.die = false;
        user.s.dieTime = 0;
        user.s.hp = user.s.fhp;
        save();
        return r.reply("부활 했습니다.")
    },
    move  : function(p) {
        if (user.s.hp <= 0) return r.reply("체력이 모두 소모 되어 있습니다.");
        if (user.s.place == p) return r.reply("현재 장소에 계십니다.");
        isMoving(p);
    },
    training  : function() {
        if (user.s.hp <= 0) return r.reply("체력이 모두 소모 되어 있습니다.");
        if (user.s.place != "훈련장") return r.reply("훈련장이 아니면 훈련을 할 수 없습니다.");
        random_num = Math.floor(Math.random() * (user.s.hp / 2)) + user.s.lv;
        mons_hp = Math.floor(random_num * (user.s.dem / 2)) + user.s.lv;
        return fight((user.s.lv > 100 ? "신성한 훈련 봇" : (user.s.lv > 60 ? "고급 훈련 봇" : (user.s.lv > 30 ? "중급 훈련 봇" : "초급 훈련 봇"))), random_num, mons_hp, Math.floor(Math.random() * mons_hp) + Math.floor(mons_hp / 3), Math.floor(Math.random() * (mons_hp / 3)) + Math.floor(mons_hp / 3), [], true);
    }
}
