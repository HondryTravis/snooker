define(
  'ephox.snooker.demo.DetectDemo',

  [
    'ephox.compass.Arr',
    'ephox.perhaps.Option',
    'ephox.snooker.api.Structs',
    'ephox.snooker.api.TableOperations',
    'ephox.snooker.api.TableResize',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Class',
    'ephox.sugar.api.Compare',
    'ephox.sugar.api.Css',
    'ephox.sugar.api.DomEvent',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Insert',
    'ephox.sugar.api.Ready',
    'ephox.sugar.api.Replication',
    'ephox.sugar.api.SelectorFind'
  ],

  function (Arr, Option, Structs, TableOperations, TableResize, Attr, Class, Compare, Css, DomEvent, Element, Insert, Ready, Replication, SelectorFind) {
    return function () {
      var subject = Element.fromHtml(
        '<table contenteditable="true" style="border-collapse: collapse;"><tbody>' +
          '<tr>' +
            '<td style="width: 110px;">1</td>' +
            '<td colspan="5">.</td>' +
          '</tr>' +
          '<tr>' +
            '<td colspan=2>.</td>' +
            '<td style="width: 130px;">3</td>' +
            '<td colspan=2>.</td>' +
            '<td style="width: 160px;">6</td>' +
          '</tr>' +
          '<tr>' +
            '<td colspan=3>.</td>' +
            '<td style="width: 140px;">4</td>' +
            '<td colspan=2>.</td>' +
          '</tr>' +
          '<tr>' +
            '<td colspan=4>.</td>' +
            '<td colspan=2>.</td>' +
          '</tr>' +
          '<tr>' +
            '<td rowspan=2>x</td>' +
            '<td style="width: 120px;">2</td>' +
            '<td colspan=2>.</td>' +
            '<td style="width: 150px;">5</td>' +
            '<td>x</td>' +
          '</tr>' +
          '<tr>' +
            '<td style="width: 120px;" rowspan=2>2</td>' +
            '<td colspan=2>.</td>' +
            '<td style="width: 150px;">5</td>' +
            '<td>x</td>' +
          '</tr>' +
          '<tr>' +
            '<td>1</td>' +
            '<td colspan=2>.</td>' +
            '<td style="width: 150px;">5</td>' +
            '<td>x</td>' +
          '</tr>' +
        '</tbody></table>'
      );

// subject = Element.fromHtml('<table contenteditable="true" style="border-collapse: collapse;"><tbody><tr><td>A</td><td>A2</td></tr><tr><td rowspan=2>B</td><td>C</td></tr><tr><td>d</td></tr></tbody></table>');
// subject = Element.fromHtml('<table contenteditable="true" style="border-collapse: collapse;"><tbody><tr><td>A</td></tr><tr><td rowspan=2>B</td></tr></tbody></table>');

      var subject2 = Element.fromHtml(
        '<table contenteditable="true" style="border-collapse: collapse;"><tbody>' +
          '<tr>' +
            '<td style="width: 110px;">1</td>' +
            // '<td colspan="1">.</td>' +
          '</tr>' +
          // '<tr>' +
          //   '<td>x</td>' +
          //   '<td style="width: 120px;">2</td>' +
          //   '<td>.</td>' +
          //   '<td style="width: 150px;">5</td>' +
          //   '<td>x</td>' +
          // '</tr>' +
        '</tbody></table>'
      );

      var subject3 = Element.fromHtml('<table contenteditable="true" width="100%" cellpadding="0" border="1" cellspacing="0"> <tbody><tr> <td rowspan="2" width="34%">&nbsp;a</td> <td width="33%">&nbsp;b</td> <td width="33%">&nbsp;c</td> </tr> <tr> <td width="33%">&nbsp;d</td> <td rowspan="2" width="33%">&nbsp;e</td> </tr> <tr> <td width="34%">&nbsp;f</td> <td width="33%">&nbsp;g</td> </tr> <tr> <td width="34%">&nbsp;h</td> <td width="33%">&nbsp;i</td> <td width="33%">j&nbsp;</td> </tr> </tbody></table>');

      var ephoxUi = SelectorFind.first('#ephox-ui').getOrDie();
      Insert.append(ephoxUi, subject);
      Insert.append(ephoxUi, Element.fromTag('p'));
      Insert.append(ephoxUi, subject2);
      Insert.append(ephoxUi, Element.fromTag('p'));
      Insert.append(ephoxUi, subject3);

      var manager = TableResize(ephoxUi);
      manager.on();

      // manager.refresh(subject);

      // For firefox.
      Ready.execute(function () {
        // document.execCommand("enableInlineTableEditing", null, false);
        // document.execCommand("enableObjectResizing", false, "false");
      });


      var afterRow = Element.fromTag('button');
      Insert.append(afterRow, Element.fromText('Row After'));
      Insert.append(ephoxUi, afterRow);

      var beforeRow = Element.fromTag('button');
      Insert.append(beforeRow, Element.fromText('Row Before'));
      Insert.append(ephoxUi, beforeRow);

      var afterColumn = Element.fromTag('button');
      Insert.append(afterColumn, Element.fromText('Column After'));
      Insert.append(ephoxUi, afterColumn);

      var beforeColumn = Element.fromTag('button');
      Insert.append(beforeColumn, Element.fromText('Column Before'));
      Insert.append(ephoxUi, beforeColumn);

      var eraseRow = Element.fromTag('button');
      Insert.append(eraseRow, Element.fromText('Erase row'));
      Insert.append(ephoxUi, eraseRow);

      var eraseColumn = Element.fromTag('button');
      Insert.append(eraseColumn, Element.fromText('Erase column'));
      Insert.append(ephoxUi, eraseColumn);

      var makeButton = function (desc) {
        var button = Element.fromTag('button');
        Insert.append(button, Element.fromText(desc));
        Insert.append(ephoxUi, button);
        return button;
      };

      var makeColumnHeader = makeButton('Make column header');
      var unmakeColumnHeader = makeButton('Unmake column header');
      var makeRowHeader = makeButton('makeRowHeader');
      var unmakeRowHeader = makeButton('unmakeRowHeader');

      var detection = function () {
        var selection = window.getSelection();
        if (selection.rangeCount > 0) {
          var range = selection.getRangeAt(0);
          return Option.some(Element.fromDom(range.startContainer));
        } else {
          return Option.none();
        }
      };

      var newCell = function (prev) {
        var td = Element.fromTag('td');
        Insert.append(td, Element.fromText('?'));
        if (prev.colspan() === 1) Css.set(td, 'width', Css.get(prev.element(), 'width'));
        if (prev.rowspan() === 1) Css.set(td, 'height', Css.get(prev.element(), 'height'));
        return Structs.detail(td, 1, 1);
      };

      var newRow = function (prev) {
        var tr = Element.fromTag('tr');
        return Structs.detail(tr, 1, 1);
      };

      var replace = function (cell, tag, attrs) {
        var replica = Replication.change(cell, tag);
        Attr.setAll(replica, attrs);
        return replica;
      };

      var eq = Compare.eq;

      var generators = {
        row: newRow,
        cell: newCell,
        replace: replace
      };

      var runOperation = function (operation) {
        return function (event) {
          detection().each(function (start) {
            operation(ephoxUi, start, generators);
          });
        };
      };

      DomEvent.bind(afterRow, 'click', runOperation(TableOperations.insertRowAfter));
      DomEvent.bind(beforeRow, 'click', runOperation(TableOperations.insertRowBefore));
      DomEvent.bind(beforeColumn, 'click', runOperation(TableOperations.insertColumnBefore));
      DomEvent.bind(afterColumn, 'click', runOperation(TableOperations.insertColumnAfter));

      DomEvent.bind(eraseRow, 'click', runOperation(TableOperations.eraseRow));
      DomEvent.bind(eraseColumn, 'click', runOperation(TableOperations.eraseColumn));

      DomEvent.bind(makeColumnHeader, 'click', runOperation(TableOperations.makeColumnHeader));
      DomEvent.bind(unmakeColumnHeader, 'click', runOperation(TableOperations.unmakeColumnHeader));
      DomEvent.bind(makeRowHeader, 'click', runOperation(TableOperations.makeRowHeader));
      DomEvent.bind(unmakeRowHeader, 'click', runOperation(TableOperations.unmakeRowHeader));
    };
  }
);