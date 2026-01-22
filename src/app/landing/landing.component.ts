import { Component, signal, computed, OnInit, OnDestroy, PLATFORM_ID, Inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

type AnimationStage = 'loading' | 'reveal' | 'show-names' | 'show-logo' | 'show-date' | 'show-countdown';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  @ViewChild('musica') audioRef!: ElementRef<HTMLAudioElement>;
  
  stage = signal<AnimationStage>('loading');
  isOpened = signal(false);
  
  private readonly targetDate = new Date('2026-07-11T16:00:00');
  private intervalId: any;
  now = signal(new Date());

  timeLeft = computed(() => {
    const diff = this.targetDate.getTime() - this.now().getTime();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60)
    };
  });

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  showReminder = signal(false);
  private reminderTimeout: any;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startTimer();
      
      // Inicia o contador de 3 segundos para mostrar o aviso
      this.reminderTimeout = setTimeout(() => {
        if (!this.isOpened()) {
          this.showReminder.set(true);
        }
      }, 3000);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.reminderTimeout) clearTimeout(this.reminderTimeout);
  }

  private startTimer() {
    this.intervalId = setInterval(() => {
      this.now.set(new Date());
    }, 1000);
  }

  isMuted = signal(false); // Controle do estado do som

  toggleMute() {
    if (this.audioRef) {
      const audio = this.audioRef.nativeElement;
      this.isMuted.set(!this.isMuted());
      audio.muted = this.isMuted();
    }
  }

  iniciarConvite() {
    if (this.isOpened()) return; // Evita disparar múltiplos cliques
    
    this.isOpened.set(true);
    this.showReminder.set(false);
    
    if (this.reminderTimeout) {
      clearTimeout(this.reminderTimeout);
    }
    
    if (this.audioRef) {
      const audio = this.audioRef.nativeElement;
      audio.currentTime = 17; 
      audio.volume = 0.5;
      audio.play().catch(e => console.error("Erro áudio:", e));
    }
    
    this.startAnimationSequence();
  }

  private startAnimationSequence() {
    // Escadinha de aparição (Timeline)
    setTimeout(() => this.stage.set('reveal'), 500); 
    setTimeout(() => this.stage.set('show-names'), 1500);
    setTimeout(() => this.stage.set('show-logo'), 2500);
    setTimeout(() => this.stage.set('show-date'), 3500);
    setTimeout(() => this.stage.set('show-countdown'), 4500);
  }

  isVisible(minStage: AnimationStage): boolean {
    const order: AnimationStage[] = ['loading', 'reveal', 'show-names', 'show-logo', 'show-date', 'show-countdown'];
    return order.indexOf(this.stage()) >= order.indexOf(minStage);
  }
}