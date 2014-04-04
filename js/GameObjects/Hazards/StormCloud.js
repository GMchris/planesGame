StormCloud = Hazard.extend({
    init: function (left, bottom) {
        this._super(left, bottom);
        this.div.className = 'stormCloudDiv';
        this.lastDamageTickTimestamp = -1;
    }
});