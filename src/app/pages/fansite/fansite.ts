import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-fansite',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fansite.html',
  styleUrl: './fansite.css'
})
export class FansiteComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);

  // 1. Playlist con rutas reales a public/audio/
  playlist = [
    {
      title: 'Usseewa (うっせぇわ)',
      album: 'Álbum: Kyogen (狂言)',
      cover: '/img/useewa.jpg',
      audioUrl: '/audio/ussewa.mp3', // Asegúrate de que coincida con el nombre de tu archivo
      duration: '3:24'
    },
    {
      title: 'New Genesis (新時代)',
      album: 'Álbum: One Piece Film Red',
      cover: '/img/1.jpg',
      audioUrl: '/audio/new-genesis.mp3',
      duration: '3:46'
    },
    {
      title: 'Show (唱)',
      album: 'Álbum: Zanmu (残夢)',
      cover: '/img/2.jpg',
      audioUrl: '/audio/show.mp3',
      duration: '3:09'
    }
  ];

  currentTrackIndex = signal(0);
  isPlaying = signal(false);
  progress = signal(0);
  currentTimeFormatted = signal('0:00');
  private audio = new Audio();

  // 2. Muro de Fans
  fanName = '';
  fanMsg = '';
  fanPosts = signal<{ author: string; text: string }[]>([]);

  // 3. Quiz
  quizFeedback = signal('');
  quizCorrect = signal(false);

  // 4. API Fans
  apiFans = signal<any[]>([]);
  apiError = signal(false);

  get currentTrack() {
    return this.playlist[this.currentTrackIndex()];
  }

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user?.displayName) {
      this.fanName = user.displayName;
    }

    // Configurar reproductor real
    this.loadAudioTrack(0, false);

    this.audio.addEventListener('timeupdate', () => {
      if (this.audio.duration) {
        const porcentaje = (this.audio.currentTime / this.audio.duration) * 100;
        this.progress.set(Math.floor(porcentaje));
        this.currentTimeFormatted.set(this.formatTime(this.audio.currentTime));
      }
    });

    this.audio.addEventListener('ended', () => {
      this.nextTrack();
    });

    this.loadApiFans();
  }

  ngOnDestroy(): void {
    // Detener la música si el usuario cierra sesión
    this.audio.pause();
    this.audio.src = '';
  }

  private loadAudioTrack(index: number, autoPlay: boolean): void {
    this.currentTrackIndex.set(index);
    this.progress.set(0);
    this.currentTimeFormatted.set('0:00');
    this.audio.src = this.currentTrack.audioUrl;
    this.audio.load();

    if (autoPlay) {
      this.audio.play();
      this.isPlaying.set(true);
    }
  }

  togglePlay(): void {
    if (this.isPlaying()) {
      this.audio.pause();
      this.isPlaying.set(false);
    } else {
      this.audio.play();
      this.isPlaying.set(true);
    }
  }

  nextTrack(): void {
    const nextIndex = (this.currentTrackIndex() + 1) % this.playlist.length;
    this.loadAudioTrack(nextIndex, this.isPlaying());
  }

  prevTrack(): void {
    const prevIndex = (this.currentTrackIndex() - 1 + this.playlist.length) % this.playlist.length;
    this.loadAudioTrack(prevIndex, this.isPlaying());
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  publishMessage(): void {
    if (!this.fanName.trim() || !this.fanMsg.trim()) return;
    this.fanPosts.update(posts => [{ author: this.fanName, text: this.fanMsg }, ...posts]);
    this.fanMsg = '';
  }

  answerQuiz(option: string): void {
    const isRight = option.startsWith('B');
    this.quizCorrect.set(isRight);
    this.quizFeedback.set(
      isRight
        ? '¡Correcto! "Usseewa" fue el sencillo debut de Ado en octubre de 2020.'
        : 'Incorrecto. La respuesta correcta era "B) Usseewa".'
    );
  }

  async loadApiFans(): Promise<void> {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!res.ok) throw new Error();
      this.apiFans.set(await res.json());
    } catch {
      this.apiError.set(true);
    }
  }
}