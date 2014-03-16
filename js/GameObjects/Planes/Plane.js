Plane = GameObject.extend({
    init: function () {
        this._super();
        this.image = document.createElement('img');
        this.div.appendChild(this.image);
    },
    image: null,
    updateCoords: function (left, bottom) {
        this._super(left, bottom);
    }
});