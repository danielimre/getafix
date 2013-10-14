(function(window, undefined) {
    window.app.filter('stateFilter', function() {
        return function(items, options) {
            if (items) {
                items = items.filter(function(item) {
                    return item.state.failed !== 0 || options;
                });
            }
            return items;
        };
    });
}(window));