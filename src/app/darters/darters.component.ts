import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Player } from '../player';
import { InjectService } from '../inject.service';
import { NgIf, NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';

const INITIAL_SCORE = 501;

@Component({
  selector: 'app-darters',
  templateUrl: './darters.component.html',
  styleUrls: ['./darters.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [NgIf, NgClass, RouterModule, MatIconModule, FormsModule, A11yModule, CommonModule]
})
export class DartersComponent implements OnInit {
  isEditEnable: boolean = true;
  players: Player[] = [];
  playerName: string = '';
  show: boolean = false;
  showOnStart: boolean = true;
  index: number = 1;

  constructor(private injectService: InjectService) {
    this.injectService.players.subscribe((value) => (this.players = value));
  }

  ngOnInit(): void {}

  onAdd(): void {
    this.isEditEnable = !this.isEditEnable;
    this.show = !this.show;
  }

  addPlayer(name: string): void {
    this.onAdd();
    const playerObj: Player = {
      name,
      remaining: INITIAL_SCORE,
      average: 0,
      index: this.index++,
      score1: '',
      score2: '',
      score3: '',
      round: 0,
      currentScoreNumber: 1,
      throwsCount: 1,
      thrownPoints: 0,
      winnerPlace: 0,
      resettedThrowsCount: false
    };
    this.players.push(playerObj);
    this.injectService.setPlayers(this.players);
    this.playerName = '';
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.addPlayer((event.target as HTMLInputElement).value);
  }

  submitForm(): void {
    this.addPlayer(this.playerName);
  }

  getPlayers(): Player[] {
    return this.players;
  }

  startGame(): void {
    this.injectService.setStarted(true);
    this.showOnStart = !this.showOnStart;
  }

  resetGame(): void {
    this.players.forEach((player, index) => {
      Object.assign(player, {
        score1: '',
        score2: '',
        score3: '',
        round: 0,
        index: index + 1,
        currentScoreNumber: 1,
        throwsCount: 1,
        thrownPoints: 0,
        winnerPlace: 0,
        remaining: INITIAL_SCORE,
        average: 0
      });
    });
    this.injectService.setPlayers(this.players);
    this.injectService.setReseted(true);
    this.injectService.setHelperIndex(1);
  }

  isThereAWinner(): boolean {
    return this.players.some((player) => player.winnerPlace > 0);
  }

  getScoreTableClass(player: Player): string {
    if (this.showOnStart) return 'scoreTable';

    const activePlayer = this.players
      .filter((p) => p.winnerPlace === 0)
      .reduce((prev, curr) => (curr.round < prev.round ? curr : prev), this.players[0]);

    return player.index === activePlayer.index ? 'scoreTableSelected' : 'scoreTable';
  }

  hasPlayerAScore(): boolean {
    return !this.showOnStart;
  }

  private searchLastPlayerToDeleteScore(players: Player[], index: number): number {
    if (index - 1 < 1) index = players.length + 1;
    const player = players.find((p) => p.index === index - 1 && p.winnerPlace > 0);
    return player ? this.searchLastPlayerToDeleteScore(players, index - 1) : index - 1;
  }

  deleteLastScore(): void {
    let minRound = Infinity;
    let helperPlayer: Player = new Player();

    this.players.forEach((player) => {
      if (player.round <= minRound && player.winnerPlace === 0) {
        if (minRound - player.round >= 1) {
          minRound = player.round;
          helperPlayer = player;
        }
      }
    });

    const searchPlayerIndex = this.searchLastPlayerToDeleteScore(this.players, helperPlayer.index);

    if (!helperPlayer.score1) {
      this.players.forEach((player) => {
        if (player.index === searchPlayerIndex && player.score3 && player.winnerPlace === 0) {
          helperPlayer = player;
        }
      });
    }

    if (helperPlayer.index === 0) return;

    this.injectService.setHelperIndex(helperPlayer.index);

    const highestPlayerNumber = this.players.reduce(
      (max, player) => (player.winnerPlace === 0 && player.index > max ? player.index : max),
      1
    );

    if (helperPlayer.score3) {
      this.resetScore(helperPlayer, 'score3');
    } else if (helperPlayer.score2) {
      this.resetScore(helperPlayer, 'score2');
    } else if (helperPlayer.score1) {
      this.resetScore(helperPlayer, 'score1');
    }

    helperPlayer.thrownPoints = Math.max(0, helperPlayer.thrownPoints);

    this.players = this.players.map((player) =>
      player.index === helperPlayer.index ? helperPlayer : player
    );
  }

  private resetScore(player: Player, scoreField: 'score1' | 'score2' | 'score3'): void {
    const score = Number(player[scoreField]);
    player.remaining += score;
    player.thrownPoints -= score;
    player[scoreField] = '';

    if (scoreField === 'score3') {
      player.round = Math.max(0, player.round - 1);
      player.currentScoreNumber = 3;
      player.throwsCount = Math.max(1, player.throwsCount - 1);
    } else if (scoreField === 'score2') {
      player.currentScoreNumber = 2;
    } else if (scoreField === 'score1') {
      player.currentScoreNumber = 1;
      player.average =
        player.thrownPoints > 0 && player.throwsCount > 1
          ? Number((player.thrownPoints / (player.throwsCount - 1)).toFixed(2))
          : 0;
    }
  }
}
