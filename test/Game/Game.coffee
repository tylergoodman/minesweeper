should = require 'should'
Minesweeper = require('../../src/Game').default

describe 'Game', ->

  describe 'constructor', ->
    it 'set up default values', ->
      ms = new Minesweeper
      ms.should.be.an.instanceof Minesweeper
      ms.should.have.properties {
        width: 30
        height: 16
        mines: 99
      }
      ms.should.have.property('tiles').which.is.an.Array
      ms.tiles.should.have.length(16 * 30);
      ms.state.should.equal Minesweeper.State.PREGAME
      ms.time.should.equal -1
    it 'best linear fit mines', ->
      (new Minesweeper 16, 30).should.have.property 'mines', 99
      (new Minesweeper 16, 16).should.have.property 'mines', 41 # couldn't fit it D:
      (new Minesweeper 9, 9).should.have.property 'mines', 10

  describe '#getAdjacentTiles', ->
    it 'returns neighbors in all 8 directions', ->
      ms = new Minesweeper 3, 3
      # 0 1 2
      # 3 4 5
      # 6 7 8
      ms.getAdjacentTiles(0).should.eql [1, 3, 4]
      ms.getAdjacentTiles(1).should.eql [0, 2, 3, 4, 5]
      ms.getAdjacentTiles(2).should.eql [1, 4, 5]
      ms.getAdjacentTiles(3).should.eql [0, 1, 4, 6, 7]
      ms.getAdjacentTiles(4).should.eql [0, 1, 2, 3, 5, 6, 7, 8]
      ms.getAdjacentTiles(5).should.eql [1, 2, 4, 7, 8]
      ms.getAdjacentTiles(6).should.eql [3, 4, 7]
      ms.getAdjacentTiles(7).should.eql [3, 4, 5, 6, 8]
      ms.getAdjacentTiles(8).should.eql [4, 5, 7]

  describe '#generateBoard', ->
    it 'creates the right amount of mines', ->
      ms = new Minesweeper
      ms.tiles.filter((tile) -> tile.isBomb()).length.should.equal ms.mines
    it 'assigns tile value correctly', ->
      ms = new Minesweeper 4, 4
      ms.tiles.forEach (tile, i) ->
        if tile.isBomb()
          tile.value.should.equal -1
        else
          ms.getAdjacentTiles(i).map((i) -> ms.tiles[i]).filter((tile) -> tile.isBomb()).length.should.equal tile.value

  describe '#toggleMarkTile', ->
    it 'returns the Minesweeper instance', ->
      ms = new Minesweeper
      ms.toggleMarkTile(0, 0).should.equal ms
    it 'can reference tiles by index', ->
      ms = new Minesweeper
      ms.toggleMarkTile 0
      ms.tiles[0].state.should.equal Minesweeper.Tile.State.MARKED
    it 'can reference tiles by coordinate', ->
      ms = new Minesweeper
      ms.toggleMarkTile 0, 0
      ms.tiles[0].state.should.equal Minesweeper.Tile.State.MARKED
    it 'marks an unmarked tile', ->
      ms = new Minesweeper
      ms.tiles[0].should.have.property 'state', Minesweeper.Tile.State.DEFAULT
      ms.toggleMarkTile 0
      ms.tiles[0].state.should.equal Minesweeper.Tile.State.MARKED
    it 'unmarks a marked tile', ->
      ms = new Minesweeper
      ms.tiles[0].should.have.property 'state', Minesweeper.Tile.State.DEFAULT
      ms.toggleMarkTile 0
      ms.tiles[0].state.should.equal Minesweeper.Tile.State.MARKED
      ms.toggleMarkTile 0
      ms.tiles[0].state.should.equal Minesweeper.Tile.State.DEFAULT
    it 'does nothing to a revealed tile', ->
      ms = new Minesweeper
      ms.revealTile 0
      ms.toggleMarkTile 0
      ms.tiles[0].state.should.equal Minesweeper.Tile.State.REVEALED

  describe '#revealTile', ->
    it 'returns the Minesweeper instance', ->
      ms = new Minesweeper
      ms.revealTile(0).should.equal ms
    it 'sets the state to RUNNING', ->
      ms = new Minesweeper
      ms.revealTile 0
      ms.state.should.equal Minesweeper.State.RUNNING
    it 'sets the timer', ->
      ms = new Minesweeper
      ms.revealTile 0
      ms.time.should.be.aboveOrEqual 1
    it 'can reference tiles by index', ->
      ms = new Minesweeper
      ms.revealTile 0
      ms.tiles[0].state.should.equal Minesweeper.Tile.State.REVEALED
    it 'can reference tiles by coordinate', ->
      ms = new Minesweeper
      ms.revealTile 0, 0
      ms.tiles[0].state.should.equal Minesweeper.Tile.State.REVEALED
    it 'will ensure no first-turn mine revealing', ->
      ms = new Minesweeper
      for tile, i in ms.tiles
        if tile.isBomb()
          bomb_index = i;
          break;
      bomb = ms.tiles[bomb_index]
      for tile, i in ms.tiles
        if !tile.isBomb()
          safe_index = i;
          break;
      safe = ms.tiles[safe_index]
      ms.revealTile bomb_index
      safe.state.should.equal Minesweeper.Tile.State.REVEALED
      bomb.state.should.equal Minesweeper.Tile.State.DEFAULT
      ms.tiles[bomb_index].should.equal safe
      ms.tiles[safe_index].should.equal bomb
    it 'will put the game in the LOSE state if tile is a bomb', ->
      ms = new Minesweeper
      for tile, i in ms.tiles
        if tile.isBomb()
          bomb_index = i;
          break;
      bomb = ms.tiles[bomb_index]
      # pretend we've made our first move already
      ms._first_turn = false;
      ms.revealTile bomb_index
      ms.state.should.equal Minesweeper.State.LOSE
    it 'will pu the game in the WIN state if all non-bomb tiles are revealed', ->
      ms = new Minesweeper 1, 1, 0
      ms.revealTile 0
      ms.state.should.equal Minesweeper.State.WIN


  describe '#_getCoordinates', ->
    it 'returns coordinates of an index', ->
      ms = new Minesweeper
      ms._getCoordinates(50).should.eql [20, 1]

  describe '#_getIndex', ->
    it 'returns the index of a pair of coordinates', ->
      ms = new Minesweeper
      ms._getIndex(20, 1).should.equal 50
