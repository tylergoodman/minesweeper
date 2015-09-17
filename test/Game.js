require('should');
var index_1 = require('../src/Game/index');
describe('#getAdjacentTiles', function () {
    it('returns correct neighbors', function () {
        var ms = new index_1.default(5, 5);
        ms.should.be.an.instanceof(index_1.default);
        console.log(ms);
    });
});
