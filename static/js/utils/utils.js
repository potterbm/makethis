MakeThis.utils = {};

MakeThis.utils.pretty_date = function(date) {
    date = new Date(date);
	return [date.getDate(), MakeThis.months[date.getMonth() + 1], date.getFullYear()].join(' ');
};
