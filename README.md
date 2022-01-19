# Nano-Text-RPG (개발 중)
Nano Bot (KakaoTalk Bot) Game Module

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
> 레벨 업 메시지 수정
> use_item 함수 구현

**Ver 0.0.4**
> 개발 중...

## 구현 된 기능

```js
.join(); // 가입

.info(); // 내정보

.remove(); // 탈퇴

/**
 * 필요한 값
 * place_name: 장소 이름
 */
.move(place_name); // 이동

.read_item(); // 아이템

.live(); // 부활

.training(); // 훈련

/**
 * 필요한 값
 * item_name: 아이템 이름
 * item_int: 아이템 갯수
 */
.use_item(item_name, item_int); // 아이템 사용
```

## 구현 중인 기능

```js
battle(); // 전투
```

## ex) 예시

index.js
```js
const game = require("Game.js"); // 모듈 불러오기 (예시)
```
```js
game.join(); // 함수 불러오기 (예시)
```


사용자가 기본 지식을 가지고 있지 않으면 사용하는데 어려움이 있을 수 있습니다.

**\*주의)** *소스에 대한 문제는 책임 지지 않습니다.*
