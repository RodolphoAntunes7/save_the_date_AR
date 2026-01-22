import { Component, signal, computed, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

// 1. Definimos a ordem exata da Linha do Tempo
type AnimationStage = 'loading' | 'reveal' | 'show-names' | 'show-logo' | 'show-date' | 'show-countdown';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  stage = signal<AnimationStage>('loading');
  
  // Data atualizada para 11 de Julho
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

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startAnimationSequence();
      this.startTimer();
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private startTimer() {
    this.intervalId = setInterval(() => {
      this.now.set(new Date());
    }, 1000);
  }

  private startAnimationSequence() {
    // A NOVA COREOGRAFIA (TIMELINE)
    
    // 0s: Tela preta (Loading)
    
    // 2.5s: Fundo aparece (Sai o PNG preto)
    setTimeout(() => this.stage.set('reveal'), 2500); 

    // 3.5s: 1º NOMES
    setTimeout(() => this.stage.set('show-names'), 3500);

    // 4.5s: 2º LOGO
    setTimeout(() => this.stage.set('show-logo'), 4500);
    
    // 5.5s: 3º DATA
    setTimeout(() => this.stage.set('show-date'), 5500);

    // 6.5s: 4º CRONÔMETRO (Fim)
    setTimeout(() => this.stage.set('show-countdown'), 6500);
  }
  
  // Lógica auxiliar para saber se o elemento já deve estar na tela
  isVisible(minStage: AnimationStage): boolean {
    const order: AnimationStage[] = [
      'loading', 
      'reveal', 
      'show-names',     // 1
      'show-logo',      // 2
      'show-date',      // 3
      'show-countdown'  // 4
    ];
    // Se o estágio atual for maior ou igual ao estágio mínimo exigido, mostra o elemento
    return order.indexOf(this.stage()) >= order.indexOf(minStage);
  }
}