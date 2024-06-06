const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(express.static('public'));
app.use(cors());

app.get('/generate', async (req, res) => {
    const category = req.query.category;
    const difficulty = req.query.difficulty;

    if (!category || !difficulty) {
        return res.status(400).json({ error: 'Category and difficulty are required' });
    }

    const prompt = `Generate a unique and challenging trivia question for the category ${category} with a difficulty level of ${difficulty}. The question should be succinct and straightforward. Provide the answer to the question as well.`;

    console.log(`Received request: { category: ${category}, difficulty: ${difficulty} }`);
    console.log(`Prompt: ${prompt}`);

    try {
        const fetch = (await import('node-fetch')).default;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer YOUR_API_KEY` // Replace with your actual API key
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 100
            })
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response from OpenAI:', data);

        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            const generatedText = data.choices[0].message.content.trim();
            const [question, answer] = generatedText.split('Answer:');
            res.json({ question: question.trim(), answer: answer.trim() });
        } else {
            console.log('No questions found in response.');
            res.status(500).json({ error: 'No questions found' });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
