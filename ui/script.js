document.getElementById('sendButton').addEventListener('click', async () => {
    const userInput = document.getElementById('userInput').value;
    const responseArea = document.getElementById('responseArea');

    if (!userInput) {
        responseArea.innerHTML = 'Please enter a query.';
        return;
    }

    responseArea.innerHTML = 'Sending...';

    try {
        const response = await fetch('/api/openrouter-openai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: userInput }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        responseArea.innerHTML = data.message || 'No response from AI agent.';
    } catch (error) {
        responseArea.innerHTML = 'Error: ' + error.message;
    }
});
