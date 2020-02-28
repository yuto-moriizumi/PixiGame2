export default class Sound {
    private loop;
    private buffer;
    private gainNode;
    private source;
    constructor(buf: AudioBuffer);
    play(loop?: boolean, offset?: number): void;
    stop(): void;
    pause(): void;
    resume(): void;
}
