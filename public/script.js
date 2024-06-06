document.addEventListener('DOMContentLoaded', () => {
    const categories = ['Science', 'History', 'Geography', 'Literature', 'Sports', 'Music'];
    const difficulties = ['easy', 'medium', 'hard', 'very hard', 'extreme'];
    const values = [200, 400, 600, 800, 1000];
    const board = document.getElementById('jeopardy-board');
    const questionModal = document.getElementById('question-modal');
    const questionText = document.getElementById('question-text');
    const answerText = document.getElementById('answer-text');
    const revealAnswerButton = document.getElementById('reveal-answer');
    const buzzButton = document.getElementById('buzz-button');
    const buzzInfo = document.getElementById('buzz-info');
    const loginForm = document.getElementById('login-form');
    const gameDiv = document.getElementById('game');
    const playerInfoDiv = document.getElementById('player-info');
    let currentAnswer = '';
    let players = [];
    let currentPlayer = null;
    let currentQuestionValue = 0;

    // Sign in function
    document.getElementById('login-button').addEventListener('click', () => {
        const playerName = document.getElementById('player-name').value.trim();
        if (playerName) {
            players.push({ name: playerName, score: 0 });
            updatePlayerInfo();
            loginForm.style.display = 'none';
            gameDiv.style.display = 'block';
        }
    });

    // Update player information display
    function updatePlayerInfo() {
        playerInfoDiv.innerHTML = '';
        players.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.textContent = `${player.name}: $${player.score}`;
            playerInfoDiv.appendChild(playerDiv);
        });
    }

    // Generate the Jeopardy board
    categories.forEach(category => {
        const categoryCell = document.createElement('div');
        categoryCell.className = 'category';
        categoryCell.innerText = category;
        board.appendChild(categoryCell);

        difficulties.forEach((difficulty, index) => {
            const questionCell = document.createElement('div');
            questionCell.className = 'question';
            questionCell.innerText = `$${values[index]}`;
            questionCell.addEventListener('click', async () => {
                const response = await fetch(`/generate?category=${category}&difficulty=${difficulty}`);
                if (!response.ok) {
                    console.error('Error fetching question:', response.statusText);
                    return;
                }

                const data = await response.json();
                if (data.error) {
                    console.error('Error in response data:', data.error);
                    return;
                }

                questionText.innerText = data.question;
                currentAnswer = data.answer;
                answerText.innerText = '';
                buzzInfo.innerText = '';
                currentQuestionValue = values[index];
                currentPlayer = null;
                questionModal.style.display = 'block';
            });
            board.appendChild(questionCell);
        });
    });

    revealAnswerButton.addEventListener('click', () => {
        if (currentPlayer) {
            currentPlayer.score += currentQuestionValue;
            updatePlayerInfo();
        }
        answerText.innerText = `The answer is: ${currentAnswer}`;
    });

    buzzButton.addEventListener('click', () => {
        if (!currentPlayer) {
            currentPlayer = players[0]; // For simplicity, we'll just assign the first player to buzz in
            buzzInfo.innerText = `${currentPlayer.name} buzzed in!`;
        }
    });

    window.addEventListener('click', (event) => {
        if (event.target === questionModal) {
            questionModal.style.display = 'none';
        }
    });
});
