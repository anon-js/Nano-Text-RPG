# Nano-Text-RPG
[개발 중단] Nano Bot (KakaoTalk Bot) Game Module

메신저봇R 기준으로 돌아가는 소스입니다.
> 모든 설명은 메신저봇R 기준으로 설명 됩니다.
>
> Module 경로에 스크립트를 넣어주세요. (이 소스만으로는 작동 X)
>
> 쓰실 분은 쓰셔도 되는데 개발은 끝나고 써주세요.

## 패치 내역
**Ver 0.0.1**
> Bridge 사용하지 않고 module로 변경.

**Ver 0.0.2**
> module 방식 수정
> 
> move 함수 작동 방식 수정
> 
> training 함수 구현

**Ver 0.0.3**
> 훈련 밸런스 수정
> 
> 레벨 업 메시지 수정
> 
> use_item 함수 구현

**Ver 0.0.3.1**
> 약간의 밸런스 조절

**Ver 0.0.4**
> 스크립트 이름 변경 (Game.js → Rpg.js)
> 
> 스크립트 불러오는 방식 
>
> 사용자간 정보 공유 버그 수정
>
> 상점, 지도 등 사용자 편의 기능 추가
>
> 소스 구조 변경
>
> 약간의 밸런스 조절

## 구현 된 기능

```js
.init(sender, replier); // 초기화
/**
 * sender: 보내는 사람
 * replier: 답장
 */

.join(); // 가입

.info(); // 내정보

.remove(); // 탈퇴

.move(place_name); // 이동
/**
 * place_name: 장소 이름
 */

.read_item(); // 아이템

.live(); // 부활

.training(); // 훈련

.store(); // 상점

.map(); // 지도

.use_item(item_name, item_int); // 아이템 사용
/**
 * item_name: 아이템 이름
 * item_int: 아이템 갯수
 */
```

## 구현 중인 기능

```js
buy(); // 구매

battle(); // 전투
```

## 예시 ex)

index.js
```js
const rpgGame = require("Rpg.js"); // 모듈 불러오기 (예시)
const rpg = rpgGame(path, va, fs);
/**
 * path: 파일 경로
 * va: 전체보기 ['\u200b'.repeat(500);]
 * fs: FileStream
 */
```
```js
rpg.init(s, r); // 함수 불러오기 (예시)
/**
 * s: sender
 * r: replier
 */
rpg.함수명(/* 필요 시 매개변수 */)
```


**개발이 중지된 프로젝트 입니다.**
