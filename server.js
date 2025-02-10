const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 3000;
const API_KEY = "AIzaSyB8gdsr2hkCxsgKLoDpKdLuhSMm9T4YXQk"; // 👉 여기에 Google API 키 입력

app.use(cors()); // CORS 문제 해결
app.use(express.json()); // JSON 요청을 파싱하기 위한 미들웨어

// 📌 동아리 정보 (Gemini AI에게 전달할 초기 데이터)
const clubInfo = `
CodeX 프로그래밍 동아리는 다양한 프로그래밍 언어를 배우고 협업하는 동아리입니다.
활동:
- Python, Kotlin, C 언어 심화 교육
- 실시간 협업 프로젝트 진행
- 프로그래밍 대회 준비
- 스터디 그룹 운영

모집 대상: 초보자부터 고급자까지 모두 환영
모집 기간: 2025년 2월 1일 ~ 2월 28일

특징:
- 최신 웹 기술 학습 (React, Firebase, Tailwind CSS 등)
- 프로그래밍 대회 출전 기회 제공
- 동아리 내부 AI 챗봇을 활용한 자동 코드 리뷰

문의 방법: 웹사이트를 방문하거나 관리자에게 문의하세요.
`;

// 📌 AI 채팅 API 라우트
app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message; // 클라이언트에서 보낸 메시지
        if (!userMessage) {
            return res.status(400).json({ error: "메시지가 비어 있습니다." });
        }

        const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

        // ✅ 동아리 정보를 AI에게 전달하는 방식으로 요청 구성
        const response = await axios.post(
            API_URL,
            {
                contents: [
                    {
                        parts: [{ text: `당신은 CodeX 프로그래밍 동아리의 홍보 챗봇입니다. 다음 정보를 바탕으로 질문에 답변하세요:\n${clubInfo}\n\n사용자의 질문: ${userMessage}` }]
                    }
                ]
            },
            { headers: { "Content-Type": "application/json" } }
        );

        // AI 응답 추출
        const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "죄송합니다. 정보를 찾을 수 없습니다.";
        res.json({ response: aiResponse });
    } catch (error) {
        console.error("❌ API 요청 중 오류 발생:", error.response?.data || error.message);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
