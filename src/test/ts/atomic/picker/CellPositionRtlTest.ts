import Structs from 'ephox/snooker/api/Structs';
import CellPosition from 'ephox/snooker/picker/CellPosition';
import { UnitTest, assert } from '@ephox/bedrock';

UnitTest.test('CellPositionRtlTest', function () {
  const check = function (expected, posX, posY, width, height, rows, cols, x, y) {
   const position = Structs.coords(posX, posY);
   const dimensions = Structs.dimensions(width, height);
   const grid = Structs.grid(rows, cols);
   const mouse = Structs.coords(x, y);
   const actual = CellPosition.findCellRtl(position, dimensions, grid, mouse);
   assert.eq(expected.col, actual.column());
   assert.eq(expected.row, actual.row());
  };

  check({row: 0, col: 10}, 0, 0, 500, 500, 10, 10, 0, 0);
  check({row: 2, col: 7}, 0, 0, 500, 500, 10, 10, 110, 100);
  check({row: 0, col: 7}, 0, 0, 500, 500, 10, 10, 110, 10);
  check({row: 2, col: 3}, 0, 0, 300, 1000, 10, 5, 110, 210);
  check({row: 0, col: 4}, 50, 180, 300, 1000, 10, 5, 110, 210);
});
