(function () {
    // Capture script element immediately while it's executing
    // Note: document.currentScript might not work inside a callback if the script finished executing.
    // But since we are inside a closure defined at execution time, we need to capture currentScript immediately.
    const currentScript = document.currentScript;

    function main() {
        // Get the API Key from the script tag
        const apiKey = currentScript.getAttribute('data-api-key');

        if (!apiKey) {
            console.error('AI Chat Widget: API Key is missing. Please add data-api-key attribute to the script tag.');
            return;
        }

        // Backend URL (Dynamically determine or hardcode for now.
        // Since this file is served from the same domain, we can use the origin.)
        const BACKEND_URL = new URL(currentScript.src).origin;

        // Inject Styles
        const style = document.createElement('style');
        style.innerHTML = `
            .ai-chat-widget-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background-color: #2563eb;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                transition: transform 0.2s;
            }
            .ai-chat-widget-btn:hover {
                transform: scale(1.05);
                background-color: #1d4ed8;
            }
            .ai-chat-widget-icon {
                color: white;
                width: 30px;
                height: 30px;
            }
            .ai-chat-window {
                position: fixed;
                bottom: 100px;
                right: 20px;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.15);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                z-index: 99999;
                opacity: 0;
                pointer-events: none;
                transform: translateY(20px);
                transition: all 0.3s ease;
            }
            .ai-chat-window.open {
                opacity: 1;
                pointer-events: all;
                transform: translateY(0);
            }
            .ai-chat-header {
                background: #2563eb;
                color: white;
                padding: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: 600;
            }
            .ai-chat-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 20px;
            }
            .ai-chat-messages {
                flex: 1;
                padding: 16px;
                overflow-y: auto;
                background: #f9fafb;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .ai-chat-message {
                max-width: 80%;
                padding: 10px 14px;
                border-radius: 14px;
                font-size: 14px;
                line-height: 1.4;
            }
            .ai-chat-message.user {
                align-self: flex-end;
                background: #2563eb;
                color: white;
                border-bottom-right-radius: 2px;
            }
            .ai-chat-message.bot {
                align-self: flex-start;
                background: white;
                color: #1f2937;
                border: 1px solid #e5e7eb;
                border-bottom-left-radius: 2px;
            }
            .ai-chat-input-area {
                padding: 16px;
                border-top: 1px solid #e5e7eb;
                display: flex;
                gap: 8px;
            }
            .ai-chat-input {
                flex: 1;
                padding: 10px;
                border: 1px solid #d1d5db;
                border-radius: 24px;
                outline: none;
                font-size: 14px;
            }
            .ai-chat-input:focus {
                border-color: #2563eb;
            }
            .ai-chat-send {
                background: #2563eb;
                color: white;
                border: none;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .ai-chat-send:disabled {
                background: #9ca3af;
            }
        `;
        document.head.appendChild(style);

        // Create Container
        const container = document.createElement('div');
        document.body.appendChild(container);

        // Create Toggle Button
        const btn = document.createElement('div');
        btn.className = 'ai-chat-widget-btn';
        btn.innerHTML = `<svg class="ai-chat-widget-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>`;
        container.appendChild(btn);

        // Create Chat Window
        const chatWindow = document.createElement('div');
        chatWindow.className = 'ai-chat-window';
        chatWindow.innerHTML = `
            <div class="ai-chat-header">
                <span>Support Chat</span>
                <button class="ai-chat-close">&times;</button>
            </div>
            <div class="ai-chat-messages" id="ai-chat-messages">
                <div class="ai-chat-message bot">Hi! How can I help you today?</div>
            </div>
            <form class="ai-chat-input-area" id="ai-chat-form">
                <input type="text" class="ai-chat-input" placeholder="Ask a question..." required>
                <button type="submit" class="ai-chat-send">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                </button>
            </form>
        `;
        container.appendChild(chatWindow);

        // Logic
        let isOpen = false;
        const messagesContainer = chatWindow.querySelector('#ai-chat-messages');
        const form = chatWindow.querySelector('#ai-chat-form');
        const input = chatWindow.querySelector('input');
        const closeBtn = chatWindow.querySelector('.ai-chat-close');

        function toggleChat() {
            isOpen = !isOpen;
            if (isOpen) {
                chatWindow.classList.add('open');
                btn.style.display = 'none';
            } else {
                chatWindow.classList.remove('open');
                btn.style.display = 'flex';
            }
        }

        btn.addEventListener('click', toggleChat);
        closeBtn.addEventListener('click', toggleChat);

        function addMessage(text, role) {
            const msg = document.createElement('div');
            msg.className = `ai-chat-message ${role}`;
            msg.textContent = text;
            messagesContainer.appendChild(msg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = input.value.trim();
            if (!text) return;

            addMessage(text, 'user');
            input.value = '';

            const submitBtn = form.querySelector('button');
            submitBtn.disabled = true;

            try {
                const res = await fetch(`${BACKEND_URL}/api/embed/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ apiKey, question: text })
                });
                const data = await res.json();

                if (data.error) throw new Error(data.error);
                addMessage(data.answer, 'bot');

            } catch (err) {
                addMessage("Sorry, I'm having trouble connecting right now.", 'bot');
                console.error(err);
            } finally {
                submitBtn.disabled = false;
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();
