var low = require('lowdb');
var db = low(__dirname + '/../data/radio.json', {
    storage: require('lowdb/file-sync')
});
var prefs = low(__dirname + '/../data/preferences.json', {
    storage: require('lowdb/file-sync')
});
var _ = require('lodash');

module.exports = {
    getStations: function(req, res, next) {
        var filter = req.query.filter;
        var acceptedFilters = ['category', 'country'];
        var filters = {};

        if(_.isString(filter)) {
            _.each(filter.split('|'), function(filter) {
                var pieces = filter.split('::');

                if(pieces.length === 2) {
                    if(acceptedFilters.indexOf(pieces[0]) > -1) {
                        filters[pieces[0]] = pieces[1];
                    }
                }
            });
        }

        if(!filter || !_.keys(filters).length) {
            return next({
                status: 400,
                message: 'Missing or incorrect filter parameter'
            });
        }

        res.send(db('stations').filter(function(station) {
            var countryValid, categoryValid;

            if(filters.country) {
                if(station.country === parseInt(filters.country)) {
                    countryValid = true;
                } else {
                    countryValid = false;
                }
            } else {
                countryValid = true;
            }

            if(filters.category) {
                if(station.categories.indexOf(parseInt(filters.category)) > -1) {
                    categoryValid = true;
                } else {
                    categoryValid = false;
                }
            } else {
                categoryValid = true;
            }

            return countryValid && categoryValid;
        }));
    },
    getCategories: function(req, res, next) {
        res.send(db('categories').clone());
    },
    getCountries: function(req, res, next) {
        res.send(db('countries').clone());
    },
    getPinned: function(req, res, next) {
        var ids = prefs('pinned-stations').clone();

        if(!ids.length) {
            res.send([]);
        } else {
            res.send(db('stations').filter(function(station) {
                return (ids.indexOf(station.id) > -1);
            }));
        }
    },
    getStation: function (req, res, next) {
        var id = parseInt(req.params.id);

        if(_.isNaN(id)) {
            return res.status(404).send();
        }

        var station = db('stations').find({id: id});

        if(station) {
            res.send(station);
        } else {
            res.status(404).send();
        }
    }
};
