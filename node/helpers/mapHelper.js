module.exports = {
    /**
     *
     *
     * @param object
     * @returns {Map<string, any>}
     */
    objectToMap: function(object) {
        let map = new Map();
        Object.keys(object).forEach(key => {
            map.set(key, object[key]);
        });
        return map;
    },
    /**
     *
     *
     * @param map
     * @returns {{}}
     */
    mapToObject: function(map) {
        let obj = {};
        for (let [k,v] of map) {
            obj[k] = v;
        }
        return obj;
    }
}