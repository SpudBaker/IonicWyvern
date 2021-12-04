export enum GameState {
  WAITING_FOR_PLAYERS = 'waitingForPlayers',
  IN_PROGRES = 'inProgress',
  FINISHED = 'finished'
}

export enum EdgeState {
    Border = 'edgeBorder',
    Opening = 'edgeOpening',
    Unknown = 'edgeUnknown',
    Wall = 'edgeWall'
  }
  
export enum Orientation {
  Horizontal = 'horizontal',
  Vertical = 'vertical'
}

export enum SquareState {
  Unknown,
  ReachableNotChecked,
  ReachableChecked
}

export class Piece {
  horizontal: number;
  vertical: number;
  constructor(horizontal: number, vertical: number ) {
    this.horizontal = horizontal;
    this.vertical = vertical;
  }
}
  
export class GameModel {
  horizontalEdges: EdgeState[][] = [
    [EdgeState.Border, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Border],
    [EdgeState.Border, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Border],
    [EdgeState.Border, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Border],
    [EdgeState.Border, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Border],
    [EdgeState.Border, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Border],
    [EdgeState.Border, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Border],
    [EdgeState.Border, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Border]
  ]
  marker = new Piece(0, 0);
  squares: SquareState[][]  = [
    [SquareState.ReachableNotChecked, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown],
    [SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown],
    [SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown], 
    [SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown], 
    [SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown], 
    [SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown, SquareState.Unknown], 
  ];
  target = new Piece(5, 5);
  validRouteExists: boolean = true;
  verticalEdges: EdgeState[][] = [
    [EdgeState.Border, EdgeState.Border, EdgeState.Border, EdgeState.Border, EdgeState.Border, EdgeState.Border, EdgeState.Border],
    [EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown],
    [EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown],
    [EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown],
    [EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown],
    [EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown, EdgeState.Unknown],
    [EdgeState.Border, EdgeState.Border, EdgeState.Border, EdgeState.Border, EdgeState.Border, EdgeState.Border, EdgeState.Border]
  ]
}