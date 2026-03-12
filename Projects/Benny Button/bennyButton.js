document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - Benny button ready');
    const audioElement = document.getElementById('no');
    if (!audioElement) {
        console.error('Audio element with id="no" not found in HTML!');
        return;
    }

    const voiceLines = [
        'Resources/voiceline1.mp3',
        'Resources/voiceline2.mp3',
        // add more here
    ];

    const button = document.querySelector('.button-82-pushable');

    if (!button) {
        console.error('Button with class .button-82-pushable not found!');
        return;
    }

    button.addEventListener('click', () => {
        console.log('Benny button clicked');

        const randomIndex = Math.floor(Math.random() * voiceLines.length);
        const selectedSrc = voiceLines[randomIndex];

        console.log('Playing:', selectedSrc);

        audioElement.src = selectedSrc;
        audioElement.load();
        audioElement.play()
            .then(() => {
                console.log('Playback started successfully');
            })
            .catch(err => {
                console.error('Playback failed:', err);
            });
    });
});