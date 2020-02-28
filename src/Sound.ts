import SoundManager from "./SoundManager";

export default class Sound {
  private loop = false;
  private buffer: AudioBuffer;
  private gainNode: GainNode;
  private source: AudioBufferSourceNode;
  private played: boolean = false;
  private paused: boolean = false;
  private offset: number = 0;
  private playedAt: number = 0;

  //音楽データを表現するクラス
  constructor(buf: AudioBuffer) {
    if (!SoundManager.sharedContext) return;
    this.buffer = buf;
    this.gainNode = SoundManager.sharedContext.createGain();
  }
  public play(loop: boolean = false, offset: number = 0) {
    const audioContext = SoundManager.sharedContext;
    if (!audioContext) return;
    this.loop = loop;
    //AudioSourceNodeの初期化
    this.source = audioContext.createBufferSource();
    //ループ情報の設定
    this.source.loop = this.loop;
    this.source.loopStart = 0;
    this.source.loopEnd = this.buffer.duration as number;
    //バッファを渡す
    this.source.buffer = this.buffer;

    //AudioGainNodeをAudioContext出力先に接続
    this.gainNode.connect(audioContext.destination);
    //AudioSourceNodeをAudioGainNodeに接続
    this.source.connect(this.gainNode);
    //AudioSourceNode処理開始
    this.source.start(0, offset);

    this.source.onended = () => this.stop(); //再生終了時に確実にAudioSourceNodeを破棄する
    this.played = true;
  }
  public stop(): void {
    if (!this.source || !this.played) return;
    this.source.disconnect();
    try {
      (this.source as any).buffer = null;
    } catch (_e) {}
    this.source.onended = null;
    this.source = null; //SourceNodeは一度再生したら再利用できないので破棄
  }
  //サウンド再生時間を返す

  public pause(): void {}
  public resume(): void {}
}
