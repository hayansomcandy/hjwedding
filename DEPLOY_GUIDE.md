# GitHub Pages 배포 가이드

이 문서는 완성된 청첩장을 **GitHub Pages**를 통해 인터넷에 무료로 배포하는 방법을 설명합니다.

## 1. 준비 작업 (터미널에서 입력)

방금 제가 `package.json` 설정을 업데이트했으므로, 먼저 새로운 배포 도구를 설치해야 합니다.

```bash
npm install
```

## 2. GitHub 저장소(Repository) 만들기

1. [GitHub](https://github.com/)에 로그인합니다.
2. 우측 상단 `+` 버튼을 누르고 **New repository**를 클릭합니다.
3. **Repository name**을 입력합니다 (예: `my-wedding-invite`).
4. **Public**으로 설정하고 `Create repository`를 누릅니다.

## 3. 코드 업로드 및 연결

터미널에서 다음 명령어들을 순서대로 입력하여 내 코드를 GitHub에 올립니다.
(*`YOUR_USERNAME`과 `my-wedding-invite` 부분은 본인의 것으로 바꿔주세요.*)

```bash
# 1. 깃 초기화 (이미 되어 있다면 생략 가능)
git init

# 2. 모든 파일 스테이징
git add .

# 3. 커밋 생성
git commit -m "First commit: Wedding Invitation completed"

# 4. GitHub 저장소와 연결 (GitHub에서 복사해오는 것이 가장 정확합니다)
git remote add origin https://github.com/YOUR_USERNAME/my-wedding-invite.git

# 5. 메인 브랜치 설정 및 푸시
git branch -M main
git push -u origin main
```

## 4. 배포하기 (Deploy)

이제 아래 명령어 한 줄이면 배포가 시작됩니다!

```bash
npm run deploy
```

*   이 명령어를 입력하면 자동으로 프로젝트를 빌드(`build`)하고, `gh-pages` 브랜치에 업로드합니다.
*   "Published" 라는 메시지가 나오면 성공입니다.

## 5. 확인하기

1. GitHub 저장소 페이지로 이동합니다.
2. 상단 메뉴의 **Settings** > 좌측 사이드바 **Pages** 클릭.
3. 상단에 배포된 주소가 나옵니다. (보통 `https://[아이디].github.io/[저장소이름]/`)
4. 약 1~2분 뒤에 접속해 보시면 청첩장이 뜹니다!

---

### ⚠️ 주의사항 (새로고침 시 404 에러)
현재 방식은 파일 경로가 주소에 남지 않아서(`?admin=true` 같은 쿼리 파라미터 방식) GitHub Pages에서도 잘 동작합니다.
다만, 변경사항이 있어 다시 배포하고 싶을 때는 **수정 후 `npm run deploy`** 만 다시 입력해 주시면 됩니다.
