# Nano-Text-RPG (개발 중)
Nano Bot (KakaoTalk Bot) Game Module

메신저봇R 기준으로 돌아가는 소스입니다.
* 모든 설명은 메신저봇R 기준으로 설명 됩니다.
* Module 경로에 스크립트를 넣어주세요. (이 소스만으로는 작동 X)
* 쓰실 분은 쓰셔도 되는데 개발은 끝나고 써주세요.

## 패치 내역
> Bridge 사용하지 않고 module로 변경.

## 구현 된 기능

```js
.join(); //가입
.info(); //내정보
.remove(); //탈퇴
.move(/*장소*/); //이동
.read_item(); //아이템
.live(); //부활
```

## 구현 중인 기능

```js
.training(); //훈련
.use_item(/*이름*/, /*갯수*/); //아이템 사용
```

## ex) 예시

index.js
```js
const 변수명 = require("스크립트.js"); //불러오기
function response(...) {
  if (msg == "가입") 변수명.join(); //가입 함수
  .
  .
  .
}
```

사용자가 기본 지식을 가지고 있지 않으면 사용하는데 어려움이 있을 수 있습니다.

**\*주의)** *소스에 대한 문제는 책임 지지 않습니다.*
