async function sendMessage(role, content, model) {
    const url = "http://localhost:8000/stream";  // Adjusted URL for streaming
    const message = {
        role: role,
        content: content,
        model: model,
        stream: true
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error: ${response.status} - ${errorText}`);
            return { error: errorText };
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            console.log(decoder.decode(value));  // Print each line of the streamed response
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

// Example usage

(async () => {
    const role = "user";
    const content = "Explain about NASA";
    const model = "qwen/qwen-2.5-72b-instruct";  // Replace with the desired model
    await sendMessage(role, content, model);  // Call the function to send the message
})();

