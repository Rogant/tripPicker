class datePicker {
    constructor(config) {
        var vm = this;

        vm.today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        vm.startBox   = config.start[0];
        vm.endBox     = config.end[0];
        vm.startDate  = vm.startBox.value !== '' ? new Date(vm.startBox.value) : vm.today;
        vm.endDate    = vm.endBox.value !== '' ? new Date(vm.endBox.value) : new Date(vm.today.getFullYear(), vm.today.getMonth(), vm.today.getDate() + 1);
        vm.months     = config.months;
        vm.calendarWidget = 'calendar-' + new Date().getTime();


        vm.monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        vm.dayNames = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ];
        vm.weekDays = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
        ];
        vm.daysAbbreviation = [
            'Mo',
            'Tu',
            'We',
            'Th',
            'Fr',
            'Sa',
            'Su'
        ];

        vm.getWeekOfMonth = function(date) {
            var day = date.getDate()
            day-=(date.getDay()==0?6:date.getDay()-1);//get monday of vm week
            //special case handling for 0 (sunday)

            day+=7;
            //for the first non full week the value was negative

            var prefixes = ['0', '1', '2', '3', '4', '5'];
            return prefixes[0 | (day) / 7];
        };

        var resizeTimer;
        vm.startBox.addEventListener('focus', function(e){
            vm._showCalendar(e.target);
        });
        vm.startBox.addEventListener('keyup', function(e){
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                vm._typeDate(e.target);
            }, 1000);
        });
        

        vm.endBox.addEventListener('focus', function(e){
            vm._showCalendar(e.target);
        });
        vm.endBox.addEventListener('keyup', function(e){
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                vm._typeDate(e.target);
            }, 1000);
        });
    }

    _showCalendar(element, startDate){
        var vm = this;
        var startDate = startDate ? startDate : element === vm.startBox ? vm.startDate : new Date(vm.endDate.getFullYear() , vm.endDate.getMonth() -1, 1);
        startDate = startDate.getTime() >= vm.today.getTime() ? startDate : vm.today;

        var sinceDate; 

        if(element === vm.startBox){
            sinceDate = vm.today;
        }else{
            sinceDate = vm.startDate.getTime() >= vm.today.getTime() ? vm.startDate : vm.today;
        }

        vm.calendar = vm.getMonts(startDate);
        vm.renderCalendar(sinceDate, element);

        var calendar = document.getElementsByClassName(vm.calendarWidget)[0];
        var position = vm._getPosition(element);
        calendar.className = calendar.className.replace('hidden', '');
        calendar.style.top  = position.top + element.offsetHeight + 10 + 'px';
        calendar.style.left = position.left + 'px';
    }

    _getPosition(obj){
        var curleft = 0, curtop = 0;
        if (obj.offsetParent) {
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
            return { left: curleft, top: curtop };
        }
        return undefined;
    }

    _setDate(element, date){
        var vm = this;

        element.value = date.getDate() + ' ' + vm.monthNames[date.getMonth()] + ' ' + date.getFullYear();

        if(element === vm.startBox){
            vm.startDate = date;

            if(vm.startDate.getTime() > vm.endDate.getTime()){
                vm.endDate = date;
            }

            vm.endBox.focus();
        }else{
            vm.endDate = date;
            vm._showCalendar(element);
            vm.toggleClass(document.getElementsByClassName(vm.calendarWidget)[0], 'hidden');
        }

    }

    _typeDate(element) {
        var vm = this;
        var newDate = new Date(element.value);

        if(newDate.getTime() >= vm.today.getTime()){
            vm._setDate(element, newDate);
        }
    }

    toggleClass(element, className){
        if (!element || !className){
            return;
        }

        var classString = element.className, nameIndex = classString.indexOf(className);
        if (nameIndex == -1) {
            classString += ' ' + className;
        }
        else {
            classString = classString.substr(0, nameIndex) + classString.substr(nameIndex+className.length);
        }
        element.className = classString;
    }

    getMonts(startDate) {
        var months = [];
        for (var i = 0; i < this.months; i++) {
            var date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
            var month = {
                name: this.monthNames[date.getMonth()],
                year: date.getFullYear(),
                weeks: []
            }

            while (date.getMonth() === new Date(startDate.getFullYear(), startDate.getMonth() + i, 1).getMonth()) {
                var week = this.getWeekOfMonth(new Date(date));
                if(month.weeks[week] == null){
                    month.weeks[week] = {};
                }

                var day = new Date(date);
                month.weeks[week][this.dayNames[day.getDay()]] = {
                    date: day,
                    //name: dayNames[day.getDay()]
                };
                date.setDate(date.getDate() + 1);
            }

            months.push(month);
        }

        return months;
    }

    renderCalendar(sinceDate, element) {
        var vm = this;


        if(document.getElementsByClassName(vm.calendarWidget).length > 0){
            document.body.removeChild(document.getElementsByClassName(vm.calendarWidget)[0]);
        }

        var widget = document.createElement('div');
        widget.className = 'hidden calendar ' + vm.calendarWidget;

        var leftNavWrapper = document.createElement('div');
        leftNavWrapper.className = 'navWrapper';
        var leftNav = document.createElement('span');
        leftNav.className = 'glyphicon glyphicon-chevron-left';

        leftNav.addEventListener('click', function(e){
            var date = new Date(1 + ' ' + vm.calendar[0].name + ' ' + vm.calendar[0].year);
            var startDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);

            vm._showCalendar(element, startDate);
        });

        leftNavWrapper.appendChild(leftNav);


        widget.appendChild(leftNavWrapper);

        vm.calendar.forEach(function(month){
            var monthDiv = document.createElement('div');
            monthDiv.className = 'month';

            var name = document.createElement('h4');
            name.appendChild(
                document.createTextNode(month.name + ' ' + month.year)
            );
            monthDiv.appendChild(name);

            var table = document.createElement('table');
            table.className = 'table';

            var tableHead = document.createElement('thead');
            var tr =  document.createElement('tr');
            vm.daysAbbreviation.forEach(function(abb) {
                var td = document.createElement('td');
                td.appendChild(
                    document.createTextNode(abb)
                );

                tr.appendChild(td);
            });

            tableHead.appendChild(tr);
            table.appendChild(tableHead);

            var tbody = document.createElement('tbody');
            month.weeks.forEach(function(week){
                var tr = document.createElement('tr');
                var td;

                vm.weekDays.forEach(function(day){
                    if(typeof week[day] !== 'undefined'){
                        td = document.createElement('td');
                        if(week[day].date.getTime() >= sinceDate.getTime()){
                            td.className = 'active';
                            
                            if(week[day].date.getTime() >= vm.startDate.getTime() && week[day].date.getTime() <= vm.endDate.getTime()){
                                td.className = 'selected';
                            }

                            td.addEventListener('click', function(e){
                                vm._setDate(element, week[day].date);
                            });
                        }else{
                            td.className = 'disabled';
                        }

                        td.appendChild(
                            document.createTextNode(week[day].date.getDate())
                        );
                        tr.appendChild(td);
                    }else{
                        td = document.createElement('td');
                        tr.appendChild(td);
                    }
                });

                tbody.appendChild(tr);
            });

            table.appendChild(tbody);
            monthDiv.appendChild(table);
            widget.appendChild(monthDiv);
        })

        var rightNavWrapper = document.createElement('div');
        rightNavWrapper.className = 'navWrapper';
        var righttNav = document.createElement('span');
        righttNav.className = 'glyphicon glyphicon-chevron-right';

        righttNav.addEventListener('click', function(e){
            var date = new Date(1 + ' ' + vm.calendar[0].name + ' ' + vm.calendar[0].year);
            var startDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);

            vm._showCalendar(element, startDate);
        });
        rightNavWrapper.appendChild(righttNav);
        widget.appendChild(rightNavWrapper);

        var closeWidget = document.createElement('div');
        closeWidget.className = 'closeWidget';
        var p = document.createElement('p');
        p.appendChild(
            document.createTextNode('Close')
        );

        p.addEventListener('click', function(){
            vm.toggleClass(document.getElementsByClassName(vm.calendarWidget)[0], 'hidden');
        });

        closeWidget.appendChild(p);
        widget.appendChild(closeWidget);

        document.body.appendChild(widget);
    }
}