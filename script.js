const API_URL = "http://localhost:3000/chat"; // 백엔드 서버 URL

async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    if (!userInput) return;

    appendMessage("user", userInput); // 사용자 메시지 추가
    document.getElementById("user-input").value = ""; // 입력창 비우기

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: userInput }) // 메시지를 백엔드로 전송
        });

        const data = await response.json();
        appendMessage("ai", data.response); // AI 응답 추가
    } catch (error) {
        console.error("Error:", error);
        appendMessage("ai", "오류가 발생했습니다. 다시 시도해주세요.");
    }
}

// ✅ **채팅 메시지 추가하는 함수**
function appendMessage(sender, text) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(sender);
    messageDiv.innerText = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // 채팅 창 스크롤 아래로 이동
}
