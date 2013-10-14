(function(window, undefined) {
    window.app.filter('state', function() {
        return function(items, options) {
            if (items) {
                items = items.filter(function(item) {
                    return item.state.failed !== 0 || options;
                });
            }
            return items;
        };
    });

    window.app.filter('shortPackage', function() {
        return function(text, separator) {
            var result = '', packageParts;
            separator = separator || '.';

            if (text) {
                packageParts = text.split('.');
                for (var i=0;i<packageParts.length-1;i++) {
                    result += packageParts[i].substr(0,1) + separator;
                }
                result += packageParts[packageParts.length-1];
            }
            return result;
        };
    });
}(window));