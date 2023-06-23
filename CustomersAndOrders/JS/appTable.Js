/**
 * This generate a table with bootstrap css
 * user can be add/delete a row in table
 * can be get selected row
 * can be get modify row only
 * @Author DPareta
 * @Date 04/May/2015
 * @pram {Object} tableConfig
 * tableConfig ={
    id (required)(string) : table id for make
    header (optional)(true/false)  : if you want to create header row
    selectingCheckboxes (optional)(true/false) : if need check box before row
    rowCalculation (optional) (true/false) : if calculation based on row level then true
    isMobileBrowser (optional) (true/false)
    columns : {
        text (string) (required)
        fieldName (string) (required)
        hidden (true/false) (optional) (default false)
        type (select/date/text) (optional) (default text)
        editable (true/false) (optional) (default false)
        required (true/false) (optional) (default text)
        dataType (date/decimal/text) (optional) (default text)
        options (array as {value, text) (optional)

    }
    data {
        array according columns fieldName need to all columns
    }
}
 * @return {TypeName}
 */

 
function dpTable(tableConfig) {
    var self = this;

    function init() {
        self.tableId = tableConfig.id;
        self.tableConfig = tableConfig;
        self.columns = tableConfig.columns;
        self.data = tableConfig.data;
        self.paging = tableConfig.paging;
        self.currentPageNumber = ((tableConfig.currentPageNumber != undefined) ? tableConfig.currentPageNumber : 1);
        self.defaultPageSize = ((tableConfig.defaultPageSize != undefined) ? tableConfig.defaultPageSize : 10);
        self.selectingCheckboxes = tableConfig.selectingCheckboxes == undefined ? false : tableConfig.selectingCheckboxes;
        self.selectAllHide = tableConfig.selectAllHide == undefined ? false : tableConfig.selectAllHide;

        //self.tableConfig.isMobileBrowser = isMobileBrowser();
    }

    //Initialization
    init();

    function createTable() {
        var table = document.createElement('div');
        $(table).addClass("tableLayout");

        for (var key in self.tableConfig) {
            if (key == 'id') {
                table.setAttribute('id', self.tableConfig[key]);
            }

            if (key == 'class') {
                $(table).addClass(self.tableConfig[key]);
            }
        }
        if (self.tableConfig.header != false) {
            var header = createHeader(self.columns);
            table.appendChild(header);
        }

        var columData = self.data;
        var endPoint = self.currentPageNumber * self.defaultPageSize;
        var start = endPoint - self.defaultPageSize;
        if (self.paging) {
            columData = columData.slice(start, endPoint);
        }

        var row = createRow(self.columns, columData);
        table.appendChild(row);

        return table;
    }

    function nextPageShow(pageNumber) {
        var existRow = $('#' + self.tableId).find(".tableBody");
        existRow.remove();
        var table = $('#' + self.tableId);
        var columData = self.data;
        var endPoint = pageNumber * self.defaultPageSize;
        var start = endPoint - self.defaultPageSize;
        columData = columData.slice(start, endPoint);
        self.currentPageNumber = pageNumber;
        var row = createRow(self.columns, columData);
        table.append(row);
    }

    function createHeader(headerObj) {
        var tableHeader = document.createElement('div');
        tableHeader.setAttribute('id', self.tableId + "_thead");
        $(tableHeader).addClass('tableHeader');
        var headerRow = document.createElement('ul');
        if (self.selectingCheckboxes == true) {
            var check = document.createElement('li');

            if (self.selectAllHide == true) {
                headerRow.appendChild(check);
            } else {
                var checkBox = document.createElement('input');
                checkBox.setAttribute('type', 'checkbox');
                checkBox.setAttribute('checkType', 'rowcheck');
                check.setAttribute("style", "width:12px;");
                checkBox.onclick = function (e) {
                    var tableDiv = $(e.target).closest('.tableLayout');
                    $('.tableBody li input:checkbox[checkType="rowcheck"]', tableDiv).each(function (view) {
                        this.checked = this.disabled ? this.checked : e.target.checked;
                        var row = $(this).parents('ul:first');
                        this.checked == true ? selectRow(row) : deselectRow(row);
                    });
                };
                check.appendChild(checkBox);
                headerRow.appendChild(check);
            }

        }
        //else {
        //    var headercheck = document.createElement('li');
        //    headerRow.appendChild(headercheck);
        //}

        for (var i = 0; i < headerObj.length; i++) {
            var th = document.createElement('li');
            $(th).css('padding-right', '5px');
            $(th).css('padding-left', '5px');
            $(th).css('white-space', 'pre-wrap');
            for (var key in headerObj[i]) {
                if (key == 'hidden' && headerObj[i][key] == true) {
                    $(th).hide();
                } else if (key == 'allowSorting') {
                    th.setAttribute('onClick', headerObj[i][key]);
                }
                else if (key == 'cellClass' && headerObj[i][key] == true)
                    th.setAttribute(String('class'), "cellClass");
                else {
                    th.setAttribute(String(key), headerObj[i][key]);
                    if (key == 'colspan') {
                        var col = headerObj[i][key];
                        if (!isEmptyOrNull(col)) {
                            i = i + parseInt(col) - 1;
                        }
                    }
                }
            }
            var txt = headerObj[i].text;
            th.innerHTML = txt;
            if (headerObj[i].allowSorting) {
                th.innerHTML += '<i class="fa fa-fw fa-sort fa-sort-icon"></i>';
            }
            headerRow.appendChild(th);
        }
        tableHeader.appendChild(headerRow);
        return tableHeader;
    }

    function createSubHeader(headerObj) {
        var heradeRow = document.createElement('ul');
        for (var i = 0; i < headerObj.length; i++) {
            var th = document.createElement('li');
            for (var key in headerObj[i]) {
                if ((key == 'hidden' && headerObj[i][key] == false) || key == 'colspan') {
                }
                else {
                    th.setAttribute(String(key), headerObj[i][key]);
                }
            }
            var txt = headerObj[i].subtext == undefined ? "" : headerObj[i].subtext;
            th.innerHTML = txt;
            $(heradeRow).css("font-weight", "bold");
            heradeRow.appendChild(th);
        }
        return heradeRow;
    }

    function createRow(columnObj, rowData) {
        var tableBody = document.createElement('div');
        tableBody.setAttribute('id', self.tableId + "_tbody");
        $(tableBody).addClass('tableBody');

        if (self.tableConfig.header != false && self.tableConfig.subheader == true) {
            var subheader = createSubHeader(self.columns);
            tableBody.appendChild(subheader);
        }

        if (rowData != null && rowData != "") {
            for (var i = 0; i < rowData.length; i++) {
                var datarow = document.createElement('ul');
                if (rowData[i].RowIndexId != undefined) {
                    datarow.setAttribute('id', 'RowId_' + rowData[i].RowIndexId);
                }
                modifyRowElement(datarow, rowData[i]);
                tableBody.appendChild(datarow);
            }
        } else {
            var defaultRow = document.createElement('ul');
            $(defaultRow).addClass('tableNoRecord');
            var tableCell = document.createElement('li');
            $(tableCell).attr('colspan', self.columns.length);
            $(tableCell).attr('align', 'center');
            $(tableCell).html("<b> Record not found</b>");
            defaultRow.appendChild(tableCell);
            tableBody.appendChild(defaultRow);
        }

        return tableBody;
    }

    function makeDomElement(rowData, value, columnObj) {
        var element;

        var type = columnObj.type;
        var dataType = columnObj.dataType;
        var required = columnObj.required;
        var isDisabled = columnObj.disabled;
        var options = columnObj.options;
        var maxLength = columnObj.maxLength;
        var negative = columnObj.negative;
        var decimalPlace = columnObj.decimalPlace;
        //  var format = columnObj.format == 'dollar' ? '$' : undefined;

        // chnages to introduced percentage sign (%) by sanjay mishra on 04/25/2017 4:58PM
        var format;
        if (columnObj.format == 'percentage' || columnObj.format == 'dollar') {
            if (columnObj.format == 'dollar')
                format = '$';
            else if (columnObj.format == 'percentage')
                format = '%';
            else
                format = undefined;
        }
        else {
            format = undefined;
        }

        if (type == 'select') {
            element = document.createElement('select');
            // $(element).addClass('selectpicker');
            $(element).attr('data-live-search', true);
            //element.className += " selectpicker";
            if (options != undefined) {
                options = JSON.parse(options);
                var firstCount = 0;
                for (var i = 0; i < options.length; i++) {
                    var optionvalue = options[i];
                    if (firstCount == 0) {
                        if (isEmptyOrNull(value))
                            value = optionvalue.Value;

                        firstCount++;
                    }

                    if (value == optionvalue.Value) {
                        if (optionvalue.IsDisabled) {
                            $(element).append($("<option disabled='disabled' Selected='true'></option>").val(optionvalue.Value).html(optionvalue.Text).data('optionRecord', optionvalue));
                        } else {
                            $(element).append($("<option Selected='true'></option>").val(optionvalue.Value).html(optionvalue.Text).data('optionRecord', optionvalue));
                        }
                    } else
                        if (optionvalue.IsDisabled) {
                            $(element).append($("<option disabled='disabled'></option>").val(optionvalue.Value).html(optionvalue.Text).data('optionRecord', optionvalue));
                        } else {
                            $(element).append($("<option></option>").val(optionvalue.Value).html(optionvalue.Text).data('optionRecord', optionvalue));
                        }

                }
                rowData[columnObj.fieldName] = value;
            }

        } else if (type == 'textArea') {
            element = document.createElement('textarea');
            element.setAttribute("rows", 1);
        } else if (type == 'checkBox') {
            element = document.createElement('input');
            element.setAttribute('type', 'checkbox');
            element.checked = value;
        } else {
            element = document.createElement('input');
            element.setAttribute("type", 'text');
            if (dataType == 'date') {
                element.className += " datepicker";
                rowData[columnObj.fieldName] = value;
            }
            // element.setAttribute('style', 'padding-right:10px!important');
        }

        if (isDisabled) {
            element.setAttribute("disabled", 'disabled');
        }
        if (dataType == 'date') {
            element.setAttribute("pattern", "^(0[1-9]|1[0-2])\/(0[1-9]|1[0-9]|2[0-9]|3[0-1])\/(19|20|21)[0-9]{2}$");
        }

        if (dataType == 'decimal') {
            var pattern = '';
            if (negative) {
                pattern = pattern + '-?';
            }
            if (!isEmptyOrNull(format) && format == '$') {
                pattern = pattern + '\\$?';
            }
            if (required) {
                element.setAttribute("min", 0);
            }
            pattern = pattern + '(([0-9 ,]{1,13})(\.[0-9]{1,4})?)?';

            if (!isEmptyOrNull(format) && format == '%') {
                pattern = pattern + '(\%)';
            }
            pattern = pattern + '';
            element.setAttribute("pattern", "^" + pattern + "$");
            $(element).addClass('decimalsOnly textRightAlignTd');
            NumberFromat($(element), 'decimal', format, decimalPlace);
        }

        if (dataType == 'int') {
            if (negative) {
                element.setAttribute("pattern", "^-?([0-9 ,]{1,13})?$");
                $(element).addClass('numbersOnly textRightAlignTd');
            } else {
                if (required)
                    element.setAttribute("min", 0);

                element.setAttribute("pattern", "^([0-9 ,]{1,13})?$");
                $(element).addClass('numbersOnly textRightAlignTd');
            }
            NumberFromat($(element), 'int', format);
        }

        if (required == true) {
            element.setAttribute("required", true);
        }
        if (dataType == 'email') {
            element.setAttribute("pattern", "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$");
        }
        if (dataType == 'alphanumeric') {
            element.setAttribute("pattern", "^[a-zA-Z0-9-,]+(\s{0,1}[a-zA-Z0-9-, ])*$");
        }

        if (maxLength > 0) {
            element.setAttribute("maxlength", maxLength);
        }
        return element;
    }

    function modifyRowElement(datarow, rowData) {
        var columnObj = self.columns;

        if (self.selectingCheckboxes == true) {
            var check = document.createElement('li');
            var checkBox = document.createElement('input');
            checkBox.setAttribute('type', 'checkbox');
            checkBox.setAttribute('checkType', 'rowcheck');

            if (!isEmptyOrNull(self.tableConfig.rowDisabledKey)) {
                checkBox.checked = true;
                checkBox.disabled = true;
            }

            $(checkBox).click(rowData, function (e) {
                var tableDiv = $(e.target).closest('.tableLayout');
                if (this.checked == false) {
                    $('.tableHeader li input:checkbox', tableDiv).attr('checked', e.target.checked);

                } else {
                    var allchecked = tableDiv.find('.tableBody input[checkType="rowcheck"]:checked');
                    var rows = $('ul[rowtype="datarow"]', tableDiv);
                    if (self.selectAllHide == false) {
                        if (allchecked.length == rows.length) {
                            var headercheck = $('.tableHeader li input:checkbox', tableDiv);
                            headercheck[0].checked = true;
                        }
                    }
                }
                var row = $(this).parents('ul:first');
                this.checked == true ? selectRow(row) : deselectRow(row);

            });
            check.appendChild(checkBox);
            datarow.appendChild(check);

        }
        else {
            datarow.onclick = function (e) {
                var row = $(this);
                singleRowSelected(row);
            };
        }
        for (var j = 0; j < columnObj.length; j++) {
            var tableCell = document.createElement('li');
            //$(tableCell).css('padding-right', '2px');
            //$(tableCell).css('padding-left', '2px');
            var cellData = rowData == undefined ? '' : rowData[columnObj[j].fieldName];
            cellData = (cellData == null ? '' : cellData);

            tableCell.setAttribute(String('name'), columnObj[j].fieldName);

            if (columnObj[j].hidden == true) {
                $(tableCell).hide();
            }
            if (columnObj[j].width != undefined) {
                $(tableCell).css('width', columnObj[j].width);
                //tableCell.setAttribute(String('width'), columnObj[j].width);
            }

            if (columnObj[j].cellClass != undefined) {
                tableCell.setAttribute(String('class'), columnObj[j].cellClass);
            }

            if (columnObj[j].dataType == 'date') {
                if (cellData.indexOf('Date') != -1)
                    cellData = DateConvertMDY(cellData);
            }

            if (columnObj[j].editable == true) {
                var domElement = makeDomElement(rowData, cellData, columnObj[j]);

                if (columnObj[j].dataType == 'int' || columnObj[j].dataType == 'decimal') {

                    SetNumberFromatValue($(domElement), cellData);
                    domElement.defaultValue = $(domElement).val();
                } else {
                    domElement.value = cellData;
                    domElement.defaultValue = cellData;
                }

                // $(domElement).css('border', '0px');
                // $(domElement).css('width', '100%');
                if (columnObj[j].dataType == 'date' || columnObj[j].type == 'select') {

                    $(domElement).change(function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var selectObject = $(this);
                        selectObject.css('background', '');
                        selectObject.css('color', '');

                        var selecedRow = selectObject.closest("ul");
                        if (self.selectingCheckboxes != true)
                            singleRowSelected(selecedRow);
                        //data get
                        var record = JSON.parse(selecedRow.data('records'));
                        var fild = selectObject.closest("li").attr('name');
                        record[fild] = selectObject[0].value;
                        //data set
                        selecedRow.data("records", JSON.stringify(record));
                        selecedRow.attr('dirty', true);

                        if (self.tableConfig.rowCalculation == true) {
                            if (self.tableConfig.isMobileBrowser == true) {
                                RowUpdateEvent(self.tableId, this);
                            } else {
                                RowUpdateEvent(self.tableId, this);
                            }

                        }
                    });

                } else if (columnObj[j].type == 'checkBox') {

                    $(domElement).change(function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var selectObject = $(this);
                        var selecedRow = selectObject.closest("ul");
                        if (self.selectingCheckboxes != true)
                            singleRowSelected(selecedRow);
                        //data get
                        var record = JSON.parse(selecedRow.data('records'));
                        var fild = selectObject.closest("li").attr('name');
                        record[fild] = selectObject.is(':checked');
                        //data set
                        selecedRow.data("records", JSON.stringify(record));
                        selecedRow.attr('dirty', true);
                        // recheck the calculation .
                        if (self.tableConfig.rowCalculation == true) {
                            if (self.tableConfig.isMobileBrowser == true) {
                                RowUpdateEvent(self.tableId, this);
                            } else {
                                RowUpdateEvent(self.tableId, this);
                            }
                        }

                    });
                } else {
                    if (self.tableConfig.rowCalculation == true) {
                        if (self.tableConfig.isMobileBrowser == true) {
                            $(domElement).attr("onfocusout", "return RowUpdateEvent('" + self.tableId + "', this);");
                        } else {
                            $(domElement).attr("onkeyup", "return RowUpdateEvent('" + self.tableId + "', this);");
                        }

                        if (self.tableConfig.eventKey != undefined) {
                            var arrayEvents = self.tableConfig.eventKey.split(';');
                            for (var ae = 0; ae < arrayEvents.length; ae++) {
                                var eventFunction = arrayEvents[ae].split('|');
                                $(domElement).attr(eventFunction[0], "return " + eventFunction[1] + "('" + self.tableId + "', this);");
                            }

                        }
                    }
                    $(domElement).focusin(function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var textbox = $(this);
                        var selecedRow = textbox.closest("ul");
                        if (self.selectingCheckboxes != true)
                            singleRowSelected(selecedRow);
                    });
                    $(domElement).change(function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var textbox = $(this);
                        textbox.css('background', '');
                        textbox.css('color', '');
                        if (textbox[0].defaultValue != textbox[0].value) {
                            var selecedRow = textbox.closest("ul");
                            //data get
                            var record = JSON.parse(selecedRow.data('records'));
                            var fild = textbox.closest("li").attr('name');
                            if ($(textbox).hasClass('numbersOnly') || $(textbox).hasClass('decimalsOnly')) {
                                record[fild] = GetNumberFromatValue($(textbox));
                            } else {
                                record[fild] = textbox[0].value;
                            }

                            //data set
                            selecedRow.data("records", JSON.stringify(record));
                            selecedRow.attr('dirty', true);
                        }
                        /*textbox.attr('readOnly');*/
                    });
                }
                tableCell.appendChild(domElement);

            } else {
                if (columnObj[j].dataType == 'int' || columnObj[j].dataType == 'decimal') {

                    var format;
                    if (columnObj[j].format == 'dollar' || columnObj[j].format == 'percentage') {
                        if (columnObj[j].format == 'dollar')
                            format = '$';
                        else if (columnObj[j].format == 'percentage')
                            format = '%';
                        else
                            format = undefined;
                    }
                    else
                        format = undefined;

                    NumberFromat($(tableCell), columnObj[j].dataType, (format), columnObj[j].decimalPlace);
                    SetNumberFromatValue($(tableCell), cellData);
                } else if (columnObj[j].type == 'checkBox') {
                    var element = document.createElement('input');
                    element.setAttribute('type', 'checkbox');
                    element.setAttribute('disabled', true);
                    element.checked = cellData;

                    tableCell.appendChild(element);
                    //td.innerHTML = ((cellData == true) ? 'Yes': 'No');
                } else if (columnObj[j].type == 'image') {
                    var element = document.createElement('div');
                    // element.setAttribute('style', 'cursor: pointer; color: #C9302C;float:right');
                    element.className = "fa fa-exclamation-circle";
                    // element.className = "glyphicon glyphicon-trash";
                    tableCell.appendChild(element);
                }

                else if (columnObj[j].type == 'link') {
                    var element = document.createElement('a');
                    //  element.setAttribute('href', '#');
                    element.innerHTML = cellData;
                    $(element).css('color', '#337ab7');
                    $(element).css('cursor', 'pointer');
                    tableCell.appendChild(element);
                    if (columnObj[j].isEnable != undefined) {
                        columnObj[j].isEnable(rowData, element);
                    }


                    //td.innerHTML = ((cellData == true) ? 'Yes': 'No');
                } else {
                    if (columnObj[j].renderer != undefined) {
                        var divElement = document.createElement('div');
                        divElement.innerHTML = cellData;
                        tableCell.appendChild(divElement);
                        columnObj[j].renderer(rowData, divElement);
                    } else {
                        tableCell.innerHTML = cellData;
                    }
                }
                $(tableCell).addClass('nonEditableTd');
                if (columnObj[j].dataType == 'int' || columnObj[j].dataType == 'decimal') {
                    $(tableCell).addClass('textRightAlignTd');
                }

            }


            datarow.appendChild(tableCell);
        }
        //data set
        datarow.setAttribute('rowtype', "datarow");

        $(datarow).data("records", JSON.stringify(rowData));
    }

    function getRecords(selectedRows) {
        var selectedRecord = [];
        for (var i = 0; i < selectedRows.length; i++) {
            //data get
            var data = $(selectedRows[i]).data("records");
            if (!isEmptyOrNull(data))
                selectedRecord.push(JSON.parse(data));
        }
        return selectedRecord;
    }

    function singleRowSelected(row) {
        var allSelectedRows = $('#' + self.tableId).find(".tableBody >ul.selected");
        for (var i = 0; i < allSelectedRows.length; i++) {
            $(allSelectedRows[i]).removeClass("selected");
        }
        row.addClass('selected');
    }

    function selectRow(rows) {
        if (!$(rows).hasClass('selected'))
            $(rows).addClass('selected');
    }

    function deselectRow(rows) {
        if ($(rows).hasClass('selected'))
            $(rows).removeClass('selected');
    }

    this.html = function () {
        var htmlText = document.createElement('div');
        if (self.paging) {
            var pages = Math.ceil(self.data.length / self.defaultPageSize);
            self.currentPageNumber = ((pages < self.currentPageNumber || self.currentPageNumber == 0) ? pages : self.currentPageNumber);
        }
        var table = createTable();
        htmlText.appendChild(table);

        if (self.paging) {
            var pagingDiv = document.createElement('div');
            //$(pagingDiv).addClass("tableFooter");

            var ul = document.createElement('ul');
            $(ul).addClass('pagination').css('cursor', 'pointer');

            for (var p = 0; p < pages; p++) {
                var li = document.createElement('li');
                if (p == (self.currentPageNumber - 1)) {
                    $(li).addClass('active');
                }
                li.onclick = function (e) {
                    var editRecords = self.getDirtyRecords();
                    var showPromatMesage = undefined;
                    if (editRecords.length > 0)
                        showPromatMesage = confirm("Modify data will lost. are you sure?");

                    if (showPromatMesage == undefined || showPromatMesage == true) {

                        var allSelectedRows = $('.pagination').find("li.active");
                        for (var i = 0; i < allSelectedRows.length; i++) {
                            $(allSelectedRows[i]).removeClass("active");
                        }
                        $(this).addClass('active');
                        nextPageShow(parseInt($($(this).find('a')).html()));
                    }
                };
                var anchor = document.createElement('a');
                anchor.innerHTML = (p + 1);
                li.appendChild(anchor);
                ul.appendChild(li);
            }
            pagingDiv.appendChild(ul);
            htmlText.appendChild(pagingDiv);

        }

        return htmlText;

    };

    this.deleteRow = function (row) {
        //row data remove in table Data
        /*var data = $(row).data("records");
        if (!isEmptyOrNull(data)) {
            var selectedRecord = JSON.parse(data);
            for (var i = 0; i < self.data.length; i++) {
                if (selectedRecord.RowIndexId == self.data[i].RowIndexId) {
                    var index = self.data.indexOf(self.data[i]);
                    self.data.splice(index, 1);
                }
            }
        }*/
        //row remove
        row.remove();
        var existRow = $('#' + self.tableId).find(".tableBody > ul");
        if (existRow.length == 0) {
            var tableBody = $('.tableBody');
            var defaultRow = document.createElement('ul');
            $(defaultRow).addClass('tableNoRecord');
            var tableCell = document.createElement('li');
            $(tableCell).html("<b> Record not found</b>");
            defaultRow.appendChild(tableCell);
            tableBody.append(defaultRow);
        }
    };

    this.addRow = function (position, rowData, rowDirty) {
        var existRow = $('#' + self.tableId).find(".tableBody > ul.tableNoRecord");
        existRow.remove();
        if (rowData == '' || rowData == undefined)
            rowData = {};

        var tableBody = $('#' + self.tableId).find(".tableBody");
        var datarow = document.createElement('ul');

        if (!isEmptyOrNull(rowData.RowIndexId)) {
            datarow.setAttribute('id', 'RowId_' + rowData.RowIndexId);
        }

        modifyRowElement(datarow, rowData);

        if (position == 'first') {
            tableBody.prepend(datarow);
        } else {
            tableBody.append(datarow);
        }
        $('#' + self.tableId).find('.tableHeader input[checkType="rowcheck"]').attr('checked', false);

        //self.data.push(rowData);

        if (rowDirty == true)
            $(datarow).attr('dirty', true);
    };

    this.UpdateRow = function (datarow, rowData, rowDirty) {
        $(datarow).empty();

        if (rowData == '' || rowData == undefined)
            rowData = {};

        modifyRowElement(datarow, rowData);

        $('#' + self.tableId).find('.tableHeader input[checkType="rowcheck"]').attr('checked', false);

        //self.data.push(rowData);

        if (rowDirty == true)
            $(datarow).attr('dirty', true);
    };

    // all the data get method call after the table creating.....
    this.getDirtyRecords = function () {
        return getRecords($('#' + self.tableId).find('.tableBody >ul[dirty="true"]'));
    };

    this.getRecord = function (selectedRow) {
        return getRecords($(selectedRow));
    };

    this.getSelectedRecord = function () {
        return getRecords($('#' + self.tableId).find(".tableBody >ul.selected"));
    };

    this.getAllRecords = function () {
        return getRecords($('#' + self.tableId).find('.tableBody >ul'));
    };

    /*this.getNotShowData = function() {
        var allDataList = self.data;
        var disPlayData = [];

        var endPoint = self.currentPageNumber * self.defaultPageSize;
        var start = endPoint - self.defaultPageSize;
        if (self.paging) {
            disPlayData = allDataList.slice(start, endPoint);
        }

        for (var i = 0; i < disPlayData.length; i++) {
            var index = allDataList.indexOf(allDataList[i]);
            self.data.splice(index, 1);
        }

        return allDataList;
    };*/

    this.getRowByTdName = function (fieldName, value) {
        var lstAllRow = $('#' + self.tableId).find('.tableBody >ul');
        for (var i = 0; i < lstAllRow.length; i++) {
            if ($($(lstAllRow[i]).find('li[name="' + fieldName + '"]')).html() == value) {
                return $(lstAllRow[i]);
            }
        }
    };

    this.getRowByRowId = function (id) {
        return $('#' + self.tableId + ' ul#RowId_' + id);// 
        //return $('#RowId_' + id);
    };

    this.validationMessage = function () {

        var lstMessage = [];
        var lstAllRow = $('#' + self.tableId).find('.tableBody >ul[dirty="true"]');
        var lstColumn = [];
        for (var l = 0; l < self.columns.length; l++) {
            if (self.columns[l].editable == true) {
                lstColumn.push(self.columns[l]);
            }
        }
        for (var i = 0; i < lstAllRow.length; i++) {
            var rowData = getRecords($(lstAllRow[i]));
            var lstRowTds = $(lstAllRow[i]).find('li');
            for (var j = 0; j < lstRowTds.length; j++) {
                var inputField = $(lstRowTds[j]).find('input');
                if (isEmptyOrNull(inputField)) {
                    inputField = $(lstRowTds[j]).find('textArea');
                }
                if (isEmptyOrNull(inputField)) {
                    inputField = $(lstRowTds[j]).find('select');
                }

                if (!isEmptyOrNull(inputField)) {
                    $(inputField).removeClass('validation-error');

                    if (!inputField[0].validity.valid) {
                        if (!$(inputField).hasClass('validation-error'))
                            $(inputField).addClass('validation-error');
                        var message = '';
                        //   if (isEmptyOrNull(message)) {
                        if (inputField[0].validity.patternMismatch) {
                            message = 'Input format Invalid';
                        } else if (inputField[0].validity.valueMissing) {
                            message = 'Required field';
                        } else {
                            message = inputField[0].validationMessage;
                        }
                        if (lstMessage.indexOf(message) == -1)
                            lstMessage.push(message);
                        //}
                    }
                    var inputName = $(inputField).closest("li").attr('name');
                    for (var k = 0; k < lstColumn.length; k++) {
                        if (lstColumn[k].fieldName == inputName) {
                            if ((lstColumn[k].required == true) && (isEmptyOrNull(rowData[0][inputName]))) {
                                if (!$(inputField).hasClass('validation-error'))
                                    $(inputField).addClass('validation-error');
                                message = 'Required field';
                                if (lstMessage.indexOf(message) == -1)
                                    lstMessage.push(message);
                            }

                            if ((lstColumn[k].dataType == 'int' || lstColumn[k].dataType == 'decimal') && ((lstColumn[k].negative != true)) && (rowData[0][inputName] < 0)) {
                                if (!$(inputField).hasClass('validation-error'))
                                    $(inputField).addClass('validation-error');
                                message = 'Negative value not allow';
                                if (lstMessage.indexOf(message) == -1)
                                    lstMessage.push(message);
                            }
                        }
                    }
                }
            }
        }
        var result = lstMessage.join(".<br\>");
        if (!isEmptyOrNull(result)) {
            result = result + '.';
        }
        return result;
    };

    this.getDisabledRecords = function () {
        return getRecords($('#' + self.tableId).find("ul input:checkbox:disabled"));
    };

    this.getCheckedRecords = function () {
        //get the selected row checks
        var allchecked = $('#' + self.tableId).find('.tableBody input[checkType="rowcheck"]:checked');
        return allchecked;
    };

    this.currentFieldDataUpdate = function (selecedRow, fieldName, value) {
        var record = JSON.parse(selecedRow.data('records'));
        if (record[fieldName] != value) {
            record[fieldName] = value;
            selecedRow.data("records", JSON.stringify(record));
            selecedRow.attr('dirty', true);
        }
    };

    this.rowDataUpdate = function (selecedRow, fieldName, value, rowDirty, editable) {
        var record = JSON.parse(selecedRow.data('records'));
        record[fieldName] = value;
        var cellData = value;
        cellData = (cellData == null ? '' : cellData);
        for (var j = 0; j < self.columns.length; j++) {
            if (editable == true) {
                if (self.columns[j].fieldName == fieldName) {

                    if (self.columns[j].dataType == 'int' || self.columns[j].dataType == 'decimal') {
                        SetNumberFromatValue($(selecedRow.find('li[name="' + fieldName + '"] > input')), cellData);
                    } else {
                        $(selecedRow.find('li[name="' + fieldName + '"] > input')).val(cellData);
                    }
                }
            } else {
                if (self.columns[j].fieldName == fieldName) {

                    if (self.columns[j].dataType == 'int' || self.columns[j].dataType == 'decimal') {
                        SetNumberFromatValue($(selecedRow.find('li[name="' + fieldName + '"]')), cellData);
                    } else {
                        $(selecedRow.find('li[name="' + fieldName + '"]')).html(cellData);
                    }
                }
            }

        }
        selecedRow.data("records", JSON.stringify(record));

        if (rowDirty != false)
            selecedRow.attr('dirty', true);
    };

    this.rowNonEditable = function (selecedRow, lstColumnName) {
        var record = JSON.parse(selecedRow.data('records'));
        var lstTd = $(selecedRow.find('li'));
        for (var i = 0; i < lstTd.length; i++) {
            if (lstTd[i].attributes['name'] != undefined) {
                var fieldName = lstTd[i].attributes['name'].value;
                if (lstColumnName == undefined || (lstColumnName != undefined && lstColumnName.includes(fieldName))) {
                    var cellData = record[fieldName];
                    var isNumber = false;
                    cellData = (cellData == null ? '' : cellData);
                    for (var j = 0; j < self.columns.length; j++) {
                        if (self.columns[j].fieldName == fieldName) {
                            isNumber = (self.columns[j].dataType == 'int' || self.columns[j].dataType == 'decimal');
                            if (isNumber) {
                                NumberFromat($(selecedRow.find('li[name="' + fieldName + '"]')), self.columns[j].dataType, (self.columns[j].format == 'dollar' ? '$' : ((self.columns[j].format == 'percentage' ? '%' : undefined))), self.columns[j].decimalPlace);
                                SetNumberFromatValue($(selecedRow.find('li[name="' + fieldName + '"]')), cellData);
                            } else {
                                $(selecedRow.find('li[name="' + fieldName + '"]')).html(cellData);
                            }
                            $(selecedRow.find('li[name="' + fieldName + '"]')).addClass("nonEditableTd");
                            if (isNumber) {
                                $(selecedRow.find('li[name="' + fieldName + '"]')).addClass("textRightAlignTd");
                            }
                        }
                    }
                }
            }
        }
    };

    this.getSelectedRow = function () {
        return $('#' + self.tableId).find(".tableBody >ul.selected");
    };

    this.getAllRow = function () {
        return $('#' + self.tableId).find(".tableBody >ul");
    };
    this.getAllRowByTdName = function (fieldName, value) {
        var lstSelectedRow = [];
        var lstAllRow = $('#' + self.tableId).find('.tableBody >ul');
        for (var i = 0; i < lstAllRow.length; i++) {
            if ($($(lstAllRow[i]).find('li[name="' + fieldName + '"]')).html() == value) {
                lstSelectedRow.push($(lstAllRow[i]));
                //return $(lstAllRow[i]);
            }
        }
        return lstSelectedRow;
    };
}