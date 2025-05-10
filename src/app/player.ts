export class Player {
    name: string = "";
    score1: string = "";
    score2: string = "";
    score3: string = ""
    average: number = 0;
    remaining: number = 0;
    index: number = 0;
    round: number = 0;
    currentScoreNumber: number = 1;
    throwsCount: number = 1;
    thrownPoints: number = 0;
    winnerPlace: number = 0;
    resettedThrowsCount: boolean = false;
  }