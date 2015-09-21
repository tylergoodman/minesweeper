should = require 'should'
Minesweeper = require('../../src/Game/').default
Tile = Minesweeper.Tile

describe 'Tile', ->

  describe 'constructor', ->
    it 'set up default values', ->
      tile = new Tile
      tile.state.should.equal Tile.State.DEFAULT
      tile.value.should.equal 0

  describe '#isBomb', ->
    it 'returns true if the tile is a bomb', ->
      (new Tile -1).isBomb().should.equal true
      (new Tile).isBomb().should.equal false
